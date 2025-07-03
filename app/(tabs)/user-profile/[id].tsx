import React, {
  useEffect,
  useState,
} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from 'firebase/firestore';
import {
  auth,
  db,
} from '../../../firebaseConfig';
import IconImage from '../../../assets/images/icon.png';

const screenWidth =
  Dimensions.get('window').width;
const imageSize = screenWidth / 3;

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const userId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();

  const [profileImage, setProfileImage] =
    useState<string | null>(null);
  const [username, setUsername] =
    useState('Loading...');
  const [posts, setPosts] = useState<any[]>([]);

  const isCurrentUser =
    auth.currentUser?.uid === userId;

  const fetchUserData = async () => {
    const userRef = doc(
      db,
      'users',
      userId as string
    );
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      setUsername(data.username || '');
      setProfileImage(
        data.profileImageUrl || null
      );
    }
  };

  const fetchUserPosts = async () => {
    const q = query(
      collection(db, 'posts'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    const userPosts = snapshot.docs.map(
      (doc) => ({
        id: doc.id,
        ...doc.data(),
      })
    );

    setPosts(userPosts);
  };

  useEffect(() => {
    fetchUserData();
    fetchUserPosts();
  }, [userId]);

  const renderItem = ({ item }: any) => (
    <Image
      source={{ uri: item.imageUrl }}
      style={{
        width: imageSize,
        height: imageSize,
      }}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <TouchableOpacity
          disabled={!isCurrentUser}
          onPress={() => {
            if (isCurrentUser)
              router.push('/(tabs)/edit-profile');
          }}
        >
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : IconImage
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <Text style={styles.username}>
          {username}
        </Text>
      </View>

      <FlashList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        estimatedItemSize={imageSize}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileHeader: {
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    paddingVertical: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});
