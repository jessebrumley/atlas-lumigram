import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export default function SearchScreen() {
  const [search, setSearch] = useState('');
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      const userList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllUsers(userList);
    };

    fetchUsers();
  }, []);

  const filtered = allUsers.filter(user =>
    user.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search</Text>
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search"
        style={styles.input}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.result}
            onPress={() => router.push(`/user-profile/${item.id}`)}
          >
            <Image
              source={
                item.profileImageUrl
                  ? { uri: item.profileImageUrl }
                  : require('../../assets/images/icon.png')
              }
              style={styles.avatar}
            />
            <Text style={styles.username}>{item.username}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingTop: 48,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#1DD2AF',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  result: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  username: {
    fontSize: 16,
  },
});
