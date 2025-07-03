import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

const handleRegister = async () => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    setError('');
    router.replace('/(tabs)/home');
  } catch (err: any) {
    switch (err.code) {
      case 'auth/email-already-in-use':
        setError('Email is already registered.');
        break;
      case 'auth/invalid-email':
        setError('Invalid email format.');
        break;
      case 'auth/weak-password':
        setError('Password must be at least 6 characters.');
        break;
      default:
        setError('Could not create account. Please try again.');
    }
  }
};

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />
      <Text style={styles.heading}>Register</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#FFFFFF"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#FFFFFF"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        autoCapitalize="none"
      />

      {error ? <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text> : null}

      <Pressable style={styles.createButton} onPress={handleRegister}>
        <Text style={styles.createText}>Create Account</Text>
      </Pressable>

      <Pressable style={styles.loginButton} onPress={() => router.replace('/')}>
        <Text style={styles.loginText}>Login to existing account</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00003C',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 220,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 32,
  },
  heading: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#1DD2AF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: 'white',
  },
  createButton: {
    backgroundColor: '#1DD2AF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  createText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  loginText: {
    color: 'white',
    fontSize: 16,
  },
});
