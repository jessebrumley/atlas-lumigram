import React, { useState } from 'react';
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

const users = [
  {
    id: '1',
    username: 'testuser',
    avatar: require('../../assets/images/icon.png'),
  },
  {
    id: '2',
    username: 'ramonaflowers',
    avatar: require('../../assets/images/icon.png'),
  },
  {
    id: '3',
    username: 'scottpilgrim',
    avatar: require('../../assets/images/icon.png'),
  },
];

export default function SearchScreen() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const filtered = users.filter((user) =>
    user.username
      .toLowerCase()
      .includes(search.toLowerCase())
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
            onPress={() => {}}
          >
            <Image
              source={item.avatar}
              style={styles.avatar}
            />
            <Text style={styles.username}>
              {item.username}
            </Text>
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
