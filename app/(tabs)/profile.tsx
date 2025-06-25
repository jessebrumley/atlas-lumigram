import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { homeFeed } from '../../placeholder';
import IconImage from '../../assets/images/icon.png';

const screenWidth =
  Dimensions.get('window').width;
const imageSize = screenWidth / 3;

export default function ProfileScreen() {
  const router = useRouter();
  const profileImage = IconImage;
  const username = 'pink-flowers23131';

  const renderItem = ({ item }: any) => (
    <Image
      source={{ uri: item.image }}
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
          onPress={() =>
            router.push('/(tabs)/edit-profile')
          }
        >
          <Image
            source={profileImage}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <Text style={styles.username}>
          {username}
        </Text>
      </View>

      <FlashList
        data={homeFeed}
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
