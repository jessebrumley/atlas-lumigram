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
  where,
  orderBy,
  limit,
  getDocs,
  startAfter,
} from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<
    any[]
  >([]);
  const [lastDoc, setLastDoc] =
    useState<any>(null);
  const [refreshing, setRefreshing] =
    useState(false);
  const [showCaptions, setShowCaptions] =
    useState<{ [key: string]: boolean }>({});

  const fetchFavorites = async (
    reset = false
  ) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    try {
      const baseQuery = query(
        collection(db, 'favorites'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        ...(reset
          ? [limit(5)]
          : [startAfter(lastDoc), limit(5)])
      );

      const snapshot = await getDocs(baseQuery);
      const newData = snapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...doc.data(),
        })
      );

      if (reset) {
        setFavorites(newData);
      } else {
        setFavorites((prev) => [
          ...prev,
          ...newData,
        ]);
      }

      const lastVisible =
        snapshot.docs[snapshot.docs.length - 1];
      setLastDoc(lastVisible || null);
    } catch (err) {
      console.error(
        'Failed to fetch favorites:',
        err
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFavorites(true);
    }, [])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchFavorites(true);
    setRefreshing(false);
  };

  const handleDoubleTap = () => {
    Alert.alert(
      'Double Tap',
      'Added to favorites'
    );
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
      .onEnd(() => handleDoubleTap())
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
        data={favorites}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        estimatedItemSize={450}
        extraData={showCaptions}
        onEndReached={() => fetchFavorites()}
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
  imageWrapper: {
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
