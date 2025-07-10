import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
  Button,
  TextInput,
  Alert,
} from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
  Feather,
  MaterialIcons,
} from '@expo/vector-icons';
import { Link, Stack, useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useRef, useEffect, useState } from 'react';
import { defaultStyles } from '@/constants/Styles';
import * as ImagePicker from 'expo-image-picker';
import { FadeIn } from 'react-native-reanimated';

const Profile = () => {
  const { signOut, isSignedIn } = useAuth();
  const { user } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(
    user?.emailAddresses[0]?.emailAddress || ''
  );
  const [edit, setEdit] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!user) return;

    setFirstName(user.firstName || '');
    setLastName(user.lastName || '');
    setEmail(user.emailAddresses[0]?.emailAddress || '');
  }, [user]);

  const onSaveUser = async () => {
    if (!firstName || !lastName) {
      Alert.alert('Error', 'Please enter both first and last name');
      return;
    }

    try {
      setIsUpdating(true);
      await user?.update({
        firstName,
        lastName,
      });
      setEdit(false);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const onCaptureImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          'Permission required',
          'Please allow access to your photos'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.75,
        base64: true,
      });

      if (!result.canceled) {
        const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
        await user?.setProfileImage({
          file: base64,
        });
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to update profile image');
    }
  };

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
      router.replace('/(modal)/login');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const menuItems = [
    { icon: 'account-circle', name: 'Personal info', color: '#FF6B6B' },
    { icon: 'cog', name: 'Account settings', color: '#4ECDC4' },
    { icon: 'bell', name: 'Notifications', color: '#A78BFA' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {user && (
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
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

          {/* Profile Card - Simplified like reference */}
          <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
            <TouchableOpacity onPress={onCaptureImage}>
              <Image
                source={{
                  uri:
                    user?.imageUrl ||
                    'https://randomuser.me/api/portraits/women/44.jpg',
                }}
                style={styles.avatar}
              />
            </TouchableOpacity>

            {edit ? (
              <View style={styles.editContainer}>
                <View style={styles.inputRow}>
                  <TextInput
                    placeholder='First Name'
                    value={firstName}
                    onChangeText={setFirstName}
                    style={[defaultStyles.inputField, styles.nameInput]}
                    autoCapitalize='words'
                  />
                  <TextInput
                    placeholder='Last Name'
                    value={lastName}
                    onChangeText={setLastName}
                    style={[defaultStyles.inputField, styles.nameInput]}
                    autoCapitalize='words'
                  />
                </View>
                <View style={styles.editButtons}>
                  <TouchableOpacity
                    onPress={() => setEdit(false)}
                    style={styles.cancelButton}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={onSaveUser}
                    style={styles.saveButton}
                    disabled={isUpdating}
                  >
                    <Text style={styles.buttonText}>
                      {isUpdating ? 'Saving...' : 'Save'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.nameContainer}>
                <Text style={styles.userName}>
                  {firstName} {lastName}
                </Text>
                <TouchableOpacity onPress={() => setEdit(true)}>
                  <Ionicons
                    name='create-outline'
                    size={28}
                    color={Colors.dark}
                  />
                </TouchableOpacity>
              </View>
            )}

            <Text style={styles.userEmail}>{email}</Text>
            <Text style={styles.memberSince}>
              Member since {user?.createdAt?.toLocaleDateString()}
            </Text>
          </Animated.View>

          {/* Menu Items */}
          <Animated.View style={[styles.menuContainer, { opacity: fadeAnim }]}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  { backgroundColor: `${item.color}20` },
                ]}
              >
                <View
                  style={[styles.menuIcon, { backgroundColor: item.color }]}
                >
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
              Earn extra income and unlock new opportunities by sharing your
              space
            </Text>
            <TouchableOpacity style={styles.hostButton}>
              <Text style={styles.hostButtonText}>Get Started</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      )}

      {!isSignedIn && (
        <Animated.View
          style={[styles.loginContainer, { opacity: fadeAnim }]}
          entering={FadeIn.duration(500)}
        >
          <Ionicons
            name='person-circle-outline'
            size={100}
            color={Colors.primary}
          />

          <Stack.Screen
            options={{
              headerShown: true,
              headerShadowVisible: false,
            }}
          />

          <Text style={styles.loginTitle}>Welcome to My Airbnb Clone</Text>
          <Text style={styles.loginSubtitle}>
            Log in to view your profile and bookings
          </Text>

          <View style={{ gap: 10 }}>
            <Link href={'/(modal)/login'} asChild>
              <TouchableOpacity style={[defaultStyles.btn, styles.loginButton]}>
                <Text
                  style={[
                    defaultStyles.btnText,
                    {
                      color: 'white',
                      backgroundColor: Colors.primary,
                      paddingHorizontal: 20,
                      padding: 3,
                      borderRadius: 5,
                    },
                  ]}
                >
                  Log In
                </Text>
              </TouchableOpacity>
            </Link>

            <Link href={'/(modal)/login'} asChild>
              <TouchableOpacity
                style={[defaultStyles.btn, styles.registerButton]}
              >
                <Text
                  style={[
                    defaultStyles.btnText,
                    {
                      color: 'white',
                      backgroundColor: Colors.primary,
                      paddingHorizontal: 20,
                      padding: 3,
                      borderRadius: 5,
                    },
                  ]}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#FF5A5F',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'mon-sb',
    color: 'white',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 20,
  },
  logoutText: {
    color: 'white',
    marginLeft: 5,
    fontFamily: 'mon-sb',
    fontSize: 14,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    margin: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    fontSize: 22,
    fontFamily: 'mon-sb',
    color: Colors.dark,
    marginRight: 10,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: 'mon',
    color: Colors.grey,
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
    fontFamily: 'mon',
    color: Colors.grey,
  },
  editContainer: {
    width: '100%',
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  nameInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: Colors.grey,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'mon-sb',
  },
  menuContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
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
    borderRadius: 16,
    padding: 24,
    margin: 16,
    paddingBottom: 110,
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
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginImage: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  loginTitle: {
    fontSize: 24,
    fontFamily: 'mon-b',
    marginBottom: 8,
    textAlign: 'center',
  },
  loginSubtitle: {
    fontSize: 16,
    fontFamily: 'mon',
    color: Colors.grey,
    marginBottom: 32,
    textAlign: 'center',
  },
  loginButtons: {
    width: '100%',
    gap: 16,
  },
  loginButton: {
    backgroundColor: Colors.grey,
  },
  registerButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.grey,
  },
});

export default Profile;
