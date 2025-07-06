import Colors from '@/constants/Colors';
import { useOAuth } from '@clerk/clerk-expo';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { defaultStyles } from '@/constants/Styles';
import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser';

enum Strategy {
  Google = 'oauth_google',
  Apple = 'oauth_apple',
  Facebook = 'oauth_facebook',
}

const Page = () => {
  useWarmUpBrowser();

  const router = useRouter();
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: appleAuth } = useOAuth({ strategy: 'oauth_apple' });
  const { startOAuthFlow: facebookAuth } = useOAuth({
    strategy: 'oauth_facebook',
  });

  const onSelectAuth = async (strategy: Strategy) => {
    const selectedAuth = {
      [Strategy.Google]: googleAuth,
      [Strategy.Apple]: appleAuth,
      [Strategy.Facebook]: facebookAuth,
    }[strategy];

    try {
      if (!selectedAuth) {
        throw new Error('Authentication method not available');
      }

      const { createdSessionId, setActive } = await selectedAuth();

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.back();
      }
    } catch (err) {
      console.error('OAuth error', err);
      Alert.alert(
        'Error',
        'An error occurred during authentication. Please try again.'
      );
    }
  };

  const handlePhoneLogin = () => {
    try {
      if (!router) {
        throw new Error('Router not available');
      }
      router.push('/(modals)/login-phone');
    } catch (err) {
      console.error('Navigation error', err);
      Alert.alert(
        'Error',
        'Unable to navigate to phone login. Please try again.'
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {/* Logo */}
        <View style={styles.logoContainer}></View>

        {/* Headers */}
        <Text style={styles.headerText}>Log in or sign up</Text>
        <Text style={styles.subHeaderText}>Welcome to Airbnb</Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <TextInput
            autoCapitalize='none'
            placeholder='Email'
            placeholderTextColor={Colors.grey}
            style={[defaultStyles.inputField, styles.inputField]}
            keyboardType='email-address'
          />
        </View>

        <TouchableOpacity
          style={[defaultStyles.btn, styles.continueBtn]}
          onPress={() => Alert.alert('Continue with email')}
        >
          <Text style={defaultStyles.btnText}>Continue</Text>
        </TouchableOpacity>

        {/* Separator */}
        <View style={styles.separatorContainer}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>or</Text>
          <View style={styles.separatorLine} />
        </View>

        {/* OAuth Buttons */}
        <View style={styles.oauthContainer}>
          <TouchableOpacity
            style={[styles.btnOutline, styles.phoneBtn]}
            onPress={handlePhoneLogin}
          >
            <FontAwesome name='phone' size={20} style={styles.btnIcon} />
            <Text style={styles.btnOutlineText}>Continue with Phone</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnOutline, styles.appleBtn]}
            onPress={() => onSelectAuth(Strategy.Apple)}
          >
            <FontAwesome name='apple' size={20} style={styles.btnIcon} />
            <Text style={styles.btnOutlineText}>Continue with Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnOutline, styles.googleBtn]}
            onPress={() => onSelectAuth(Strategy.Google)}
          >
            <FontAwesome name='google' size={20} style={styles.btnIcon} />
            <Text style={styles.btnOutlineText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnOutline, styles.facebookBtn]}
            onPress={() => onSelectAuth(Strategy.Facebook)}
          >
            <FontAwesome name='facebook' size={20} style={styles.btnIcon} />
            <Text style={styles.btnOutlineText}>Continue with Facebook</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to Airbnb's
            <Text style={styles.linkText}> Terms of Service</Text> and
            <Text style={styles.linkText}> Privacy Policy</Text>.
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 26,
    paddingTop: 50,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 40,
  },
  headerText: {
    fontSize: 24,
    fontFamily: 'mon-sb',
    marginBottom: 8,
    color: Colors.dark,
  },
  subHeaderText: {
    fontSize: 16,
    fontFamily: 'mon',
    marginBottom: 30,
    color: Colors.grey,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputField: {
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    borderRadius: 8,
    padding: 14,
    height: 50,
    fontSize: 16,
  },
  continueBtn: {
    marginBottom: 20,
    backgroundColor: Colors.primary,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.lightGrey,
  },
  separatorText: {
    fontFamily: 'mon-sb',
    color: Colors.grey,
    fontSize: 14,
    marginHorizontal: 10,
  },
  oauthContainer: {
    gap: 15,
    marginBottom: 20,
  },
  btnOutline: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  btnIcon: {
    marginRight: 10,
    color: Colors.dark,
  },
  btnOutlineText: {
    color: Colors.dark,
    fontSize: 16,
    fontFamily: 'mon-sb',
  },
  phoneBtn: {
    borderColor: Colors.dark,
  },
  appleBtn: {
    borderColor: Colors.dark,
  },
  googleBtn: {
    borderColor: Colors.dark,
  },
  facebookBtn: {
    borderColor: Colors.dark,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 26,
    right: 26,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'mon',
    color: Colors.grey,
    lineHeight: 18,
  },
  linkText: {
    textDecorationLine: 'underline',
  },
});
