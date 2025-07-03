import React, {
  useState,
  useEffect,
} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import {
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { auth } from '../../firebaseConfig';

export default function HomeScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [lastDoc, setLastDoc] =
    useState<any>(null);
  const [refreshing, setRefreshing] =
    useState(false);
  const [showCaptions, setShowCaptions] =
    useState<{ [key: string]: boolean }>({});

  const fetchPosts = async (reset = false) => {
    try {
      const postsRef = collection(db, 'posts');
      const q = reset
        ? query(
            postsRef,
            orderBy('createdAt', 'desc'),
            limit(5)
          )
        : query(
            postsRef,
            orderBy('createdAt', 'desc'),
            startAfter(lastDoc),
            limit(5)
          );

      const snapshot = await getDocs(q);

      const newPosts = snapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...doc.data(),
        })
      );

      if (reset) {
        setPosts(newPosts);
      } else {
        setPosts((prev) => [
          ...prev,
          ...newPosts,
        ]);
      }

      const lastVisible =
        snapshot.docs[snapshot.docs.length - 1];
      setLastDoc(lastVisible || null);
    } catch (err) {
      console.error(
        'Failed to fetch posts:',
        err
      );
    }
  };

  useEffect(() => {
    fetchPosts(true);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPosts(true);
    setRefreshing(false);
  };

  const handleDoubleTap = async (post: any) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const favRef = doc(
        db,
        'favorites',
        `${userId}_${post.id}`
      );

      await setDoc(favRef, {
        userId,
        postId: post.id,
        imageUrl: post.imageUrl,
        caption: post.caption,
        createdAt: post.createdAt || new Date(),
      });

      Alert.alert(
        'Favorited',
        'Post added to favorites!'
      );
    } catch (err) {
      console.error('Failed to favorite:', err);
      Alert.alert(
        'Error',
        'Could not favorite post.'
      );
    }
  };

  const handleLongPress = (id: string) => {
    setShowCaptions((prev) => ({
      ...prev,
      [id]: true,
    }));
    setTimeout(() => {
      setShowCaptions((prev) => ({
        ...prev,
        [id]: false,
      }));
    }, 5000);
  };

  const renderItem = ({ item }: any) => {
    const tap = Gesture.Tap()
      .numberOfTaps(2)
      .maxDistance(10)
      .onEnd(() => handleDoubleTap(item))
      .runOnJS(true);

    const longPress = Gesture.LongPress()
      .minDuration(300)
      .onStart(() => handleLongPress(item.id))
      .runOnJS(true);

    const composedGesture = Gesture.Simultaneous(
      tap,
      longPress
    );

    return (
      <GestureDetector gesture={composedGesture}>
        <View style={styles.itemContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.image}
            />
            {showCaptions[item.id] && (
              <Text style={styles.caption}>
                {item.caption}
              </Text>
            )}
          </View>
        </View>
      </GestureDetector>
    );
  };

  return (
    <View style={styles.container}>
      <FlashList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        estimatedItemSize={450}
        extraData={showCaptions}
        onEndReached={() => fetchPosts()}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },
  itemContainer: {
    marginVertical: 12,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 400,
    borderRadius: 16,
  },
  caption: {
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
    textAlign: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});
