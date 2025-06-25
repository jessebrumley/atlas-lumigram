import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function TabsLayout() {
  const router = useRouter();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#1DD2AF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home Feed',
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="home"
                size={size}
                color={color}
              />
            ),
            headerStyle: {
              backgroundColor: 'white',
            },
            headerTitleStyle: {
              color: 'black',
            },
            headerTitleAlign: 'left',
            headerRight: () => (
              <Pressable
                onPress={() =>
                  router.replace('/')
                }
              >
                <Ionicons
                  name="log-out-outline"
                  size={28}
                  color="#1DD2AF"
                  style={{ paddingRight: 20 }}
                />
              </Pressable>
            ),
          }}
        />

        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="search-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="add-post"
          options={{
            title: 'Add post',
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="add-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="favorites"
          options={{
            title: 'Favorites',
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="heart-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="person-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="edit-profile"
          options={{
            title: 'Edit Profile',
            tabBarButton: () => null,
            tabBarItemStyle: { display: 'none' },
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}
