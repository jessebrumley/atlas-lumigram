import React, {
  useState,
  useEffect,
} from 'react';
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
import IconImage from '../../assets/images/icon.png';

export default function EditProfileScreen() {
  const router = useRouter();

  const [username, setUsername] = useState(
    'username_here'
  );
  const [profileImage, setProfileImage] =
    useState<any>(IconImage);

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
  }, []);

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
      setProfileImage({
        uri: result.assets[0].uri,
      });
    }
  };

  const handleSave = () => {
    console.log('Saved profile:', {
      username,
      profileImage,
    });
    router.push('/(tabs)/profile');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={profileImage}
          style={styles.profileImage}
        />
      </TouchableOpacity>

      <TextInput
        placeholder="Enter new username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
      >
        <Text style={styles.saveText}>
          Save Profile
        </Text>
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
