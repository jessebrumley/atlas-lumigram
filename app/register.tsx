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

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#FFFFFF"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Pressable style={styles.createButton} onPress={() => router.replace('/(tabs)/home')}>
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
