import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import IconImage from '../../assets/images/icon.png';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebaseConfig';

export default function EditProfileScreen() {
  const router = useRouter();

  const [username, setUsername] = useState('Loading...');
  const [profileImage, setProfileImage] = useState<any>(IconImage);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'We need access to your media library to change your profile image.'
        );
      }
    })();

    const fetchUserProfile = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUsername(data.username || '');
        if (data.profileImageUrl) {
          setProfileImage({ uri: data.profileImageUrl });
        }
      }
    };

    fetchUserProfile();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage({ uri: result.assets[0].uri });
    }
  };

const handleSave = async () => {
  const user = auth.currentUser;
  if (!user) return;

  let downloadURL = '';

  if (profileImage?.uri && !profileImage.uri.startsWith('https://')) {
    const response = await fetch(profileImage.uri);
    const blob = await response.blob();
    const imageRef = ref(storage, `profiles/${user.uid}.jpg`);

    await uploadBytes(imageRef, blob);
    downloadURL = await getDownloadURL(imageRef);
  }

  const userRef = doc(db, 'users', user.uid);
  await setDoc(
    userRef,
    {
      username: username.trim(),
      uid: user.uid,
      email: user.email,
      ...(downloadURL && { profileImageUrl: downloadURL }),
    },
    { merge: true }
  );

  Alert.alert('Saved', 'Your profile has been updated.');
  router.push('/(tabs)/profile');
};


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Image source={profileImage} style={styles.profileImage} />
      </TouchableOpacity>

      <TextInput
        placeholder="Enter new username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
    padding: 12,
    borderRadius: 6,
    marginBottom: 24,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#1DD2AF',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 8,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
