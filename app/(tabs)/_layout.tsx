import { Tabs } from 'expo-router';
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { StyleSheet, View, Animated } from 'react-native';
import { useEffect, useRef } from 'react';

const Layout = () => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
      speed: 10,
      bounciness: 10,
    }).start();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.grey,
        tabBarLabelStyle: {
          fontFamily: 'mon-sb',
          fontSize: 12,
          paddingBottom: 4,
        },
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ size, color, focused }) => (
            <Animated.View style={{}}>
              <Ionicons
                name={focused ? 'search' : 'search-outline'}
                size={size}
                color={color}
              />
            </Animated.View>
          ),
        }}
      />
      <Tabs.Screen
        name='wishlists'
        options={{
          tabBarLabel: 'Wishlists',
          tabBarIcon: ({ size, color, focused }) => (
            <Animated.View style={{}}>
              <Ionicons
                name={focused ? 'heart' : 'heart-outline'}
                size={size}
                color={color}
              />
            </Animated.View>
          ),
        }}
      />
      <Tabs.Screen
        name='trips'
        options={{
          tabBarLabel: 'Trips',
          tabBarIcon: ({ size, color, focused }) => (
            <Animated.View
              style={[{ transform: [{ scale: focused ? 1.1 : 1 }] }]}
            >
              <FontAwesome5
                name='airbnb'
                size={focused ? size + 2 : size}
                color={color}
              />
            </Animated.View>
          ),
        }}
      />
      <Tabs.Screen
        name='inbox'
        options={{
          tabBarLabel: 'Inbox',
          tabBarIcon: ({ size, color, focused }) => (
            <Animated.View style={{}}>
              <MaterialCommunityIcons
                name={focused ? 'message-text' : 'message-text-outline'}
                size={size}
                color={color}
              />
            </Animated.View>
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          tabBarLabel: 'Profile',
          headerShown: false,
          tabBarIcon: ({ size, color, focused }) => (
            <Animated.View style={{}}>
              <Ionicons
                name={focused ? 'person-circle' : 'person-circle-outline'}
                size={size}
                color={color}
              />
            </Animated.View>
          ),
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 80,
    paddingTop: 8,

    paddingBottom: 18,
    borderTopWidth: 0,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
    position: 'absolute',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  tabItem: {
    paddingVertical: 6,
  },
  activeIcon: {
    backgroundColor: `${Colors.primary}20`,
    padding: 8,
    borderRadius: 20,
    transform: [{ scale: 1.1 }],
  },
  floatingTab: {
    position: 'absolute',
    bottom: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
});

export default Layout;
