import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import {
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, storage, db } from '../../firebaseConfig';
import uuid from 'react-native-uuid';

export default function AddPostScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    } as ImagePicker.ImagePickerOptions);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!image || !caption) return;
    setUploading(true);

    try {
      console.log('Uploading image URI:', image);

      const response = await fetch(image);
      const blob = await response.blob();
      const filename = `${uuid.v4()}.jpg`;

      const storageRef = ref(storage, `posts/${filename}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'posts'), {
        imageUrl: downloadURL,
        caption: caption,
        createdAt: serverTimestamp(),
        userId: auth.currentUser?.uid || null,
      });

      handleReset();
      Alert.alert('Success', 'Post uploaded!');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setCaption('');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text>Select an Image</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        placeholder="Add a caption"
        value={caption}
        onChangeText={setCaption}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        disabled={!image || !caption || uploading}
      >
        <Text style={styles.saveText}>
          {uploading ? 'Uploading...' : 'Save'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleReset}>
        <Text style={styles.resetText}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#fefefe',
    alignItems: 'center',
  },
  image: {
    width: 280,
    height: 280,
    borderRadius: 16,
    marginBottom: 24,
  },
  placeholderImage: {
    width: 280,
    height: 280,
    backgroundColor: '#eee',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#1DD2AF',
    borderRadius: 6,
    width: '100%',
    padding: 10,
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: '#1DD2AF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  saveText: {
    color: 'white',
    fontSize: 16,
  },
  resetText: {
    color: '#333',
    fontSize: 16,
  },
});
