import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
} from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
  Feather,
  MaterialIcons,
} from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useRef, useEffect } from 'react';

const Profile = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(modals)/login');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading user data...</Text>
      </SafeAreaView>
    );
  }

  const menuItems = [
    { icon: 'account-circle', name: 'Personal info', color: '#FF6B6B' },
    { icon: 'cog', name: 'Account settings', color: '#4ECDC4' },
    // { icon: 'shield-account', name: 'Login & security', color: '#FFD166' },
    { icon: 'bell', name: 'Notifications', color: '#A78BFA' },
    // { icon: 'help-circle', name: 'Help Center', color: '#7FDBFF' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header with gradient */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>My Profile</Text>
            <TouchableOpacity
              onPress={handleSignOut}
              style={styles.logoutButton}
            >
              <Feather name='log-out' size={20} color='white' />
              <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Profile Card */}
        <Animated.View style={[styles.profileCard, { opacity: fadeAnim }]}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri:
                  user.imageUrl ||
                  'https://randomuser.me/api/portraits/women/44.jpg',
              }}
              style={styles.avatar}
            />
            <View style={styles.verifiedBadge}>
              <MaterialIcons name='verified' size={20} color='#4CAF50' />
            </View>
          </View>

          <Text style={styles.userName}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={styles.userEmail}>
            {user.primaryEmailAddress?.emailAddress}
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Trips</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Wishlists</Text>
            </View>
          </View>
        </Animated.View>

        {/* Menu Items */}
        <Animated.View style={[styles.menuContainer, { opacity: fadeAnim }]}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { backgroundColor: `${item.color}20` }]}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color }]}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={22}
                  color='white'
                />
              </View>
              <Text style={styles.menuText}>{item.name}</Text>
              <MaterialIcons
                name='keyboard-arrow-right'
                size={24}
                color={Colors.grey}
              />
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Become Host Section */}
        <Animated.View style={[styles.hostCard, { opacity: fadeAnim }]}>
          <FontAwesome5 name='airbnb' size={32} color='#FF5A5F' />
          <Text style={styles.hostTitle}>Become a Host</Text>
          <Text style={styles.hostSubtitle}>
            Earn extra income and unlock new opportunities by sharing your space
          </Text>
          <TouchableOpacity style={styles.hostButton}>
            <Text style={styles.hostButtonText}>Get Started</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* App Settings */}
        <Animated.View style={[styles.settingsCard, { opacity: fadeAnim }]}>
          <Text style={styles.settingsTitle}>App Settings</Text>
          <View style={styles.settingItem}>
            <Ionicons name='moon-outline' size={22} color='#6C63FF' />
            <Text style={styles.settingText}>Dark Mode</Text>
            <MaterialIcons name='toggle-on' size={40} color='#6C63FF' />
          </View>
          <View style={styles.settingItem}>
            <Ionicons name='language' size={22} color='#6C63FF' />
            <Text style={styles.settingText}>Language</Text>
            <Text style={styles.settingValue}>English</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingBottom: 60,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    height: 180,
    backgroundColor: '#FF5A5F',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 50,
    marginBottom: -60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'mon-sb',
    color: 'white',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  logoutText: {
    color: 'white',
    marginLeft: 5,
    fontFamily: 'mon-sb',
    fontSize: 14,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  userName: {
    fontSize: 22,
    fontFamily: 'mon-sb',
    color: Colors.dark,
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: 'mon',
    color: Colors.grey,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'mon-sb',
    color: Colors.dark,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'mon',
    color: Colors.grey,
  },
  menuContainer: {
    marginHorizontal: 24,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'mon-sb',
    color: Colors.dark,
  },
  hostCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  hostTitle: {
    fontSize: 20,
    fontFamily: 'mon-sb',
    color: Colors.dark,
    marginVertical: 10,
  },
  hostSubtitle: {
    fontSize: 14,
    fontFamily: 'mon',
    color: Colors.grey,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  hostButton: {
    backgroundColor: '#FF5A5F',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  hostButtonText: {
    fontSize: 16,
    fontFamily: 'mon-sb',
    color: 'white',
  },
  settingsCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  settingsTitle: {
    fontSize: 18,
    fontFamily: 'mon-sb',
    color: Colors.dark,
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'mon',
    color: Colors.dark,
    marginLeft: 15,
  },
  settingValue: {
    fontSize: 14,
    fontFamily: 'mon',
    color: Colors.grey,
    marginRight: 5,
  },
});

export default Profile;
