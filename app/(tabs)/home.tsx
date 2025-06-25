import React, { useState } from 'react';
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
import { homeFeed } from '../../placeholder';

export default function HomeScreen() {
  const [showCaptions, setShowCaptions] =
    useState<{ [key: string]: boolean }>({});

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
              source={{ uri: item.image }}
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
        data={homeFeed}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        estimatedItemSize={450}
        extraData={showCaptions}
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
