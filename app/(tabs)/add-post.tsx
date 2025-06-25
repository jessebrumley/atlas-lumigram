import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function AddPostScreen() {
  const [image, setImage] = useState<
    string | null
  >(null);
  const [caption, setCaption] = useState('');

  const pickImage = async () => {
    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (image && caption) {
      // add logic to save image here
      console.log('Post saved:', {
        image,
        caption,
      });
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
          <Image
            source={{ uri: image }}
            style={styles.image}
          />
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
        disabled={!image || !caption}
      >
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleReset}>
        <Text style={styles.resetText}>
          Reset
        </Text>
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
