// LoginScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FontAwesome } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  User,
} from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { RootStackParamList } from '../App';

WebBrowser.maybeCompleteAuthSession();

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [show2FA, setShow2FA] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // ----------------------------
  // Google Auth setup
  // ----------------------------
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    redirectUri: 'https://auth.expo.io/@mrjoey0125/mobile-app',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      setGoogleLoading(true);
      const { id_token } = response.params;
      if (!id_token) {
        setGoogleLoading(false);
        return;
      }

      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(async (userCredential) => {
          await saveUserToFirestore(userCredential.user);
          navigation.replace('Home', { user: userCredential.user.email! });
        })
        .catch((err) => {
          console.error(err);
          Alert.alert('Google Login Failed', err.message);
        })
        .finally(() => setGoogleLoading(false));
    }
  }, [response]);

  // ----------------------------
  // Email & Password login
  // ----------------------------
const handleSignIn = async () => {
  if (!email || !password) {
    Alert.alert('Missing Fields', 'Please enter both email and password.');
    return;
  }

  try {
    setLoading(true);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      Alert.alert('Email Not Verified', 'Please verify your email before logging in.');
      await auth.signOut();
      return;
    }

    // Always generate a new 2FA code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setCurrentUser(user);

    await setDoc(doc(db, '2fa', user.uid), {
      code,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // expires in 5 minutes
    });

    Alert.alert('2FA Code', `Your login code is: ${code}`); // Replace with email or SMS
    setShow2FA(true); // Show 2FA screen
  } catch (err: any) {
    Alert.alert('Login Failed', err.message || 'Something went wrong');
  } finally {
    setLoading(false);
  }
};

  // ----------------------------
  // Verify 2FA code
  // ----------------------------
  const verify2FA = async () => {
    if (!twoFACode || !currentUser) return;

    try {
      const docRef = doc(db, '2fa', currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        Alert.alert('Error', 'No 2FA code found. Please login again.');
        setShow2FA(false);
        return;
      }

      const data = docSnap.data();
      const expiresAt = data?.expiresAt.toDate ? data.expiresAt.toDate() : new Date(data.expiresAt);

      if (data.code !== twoFACode) {
        Alert.alert('Invalid Code', 'The code you entered is incorrect.');
        return;
      }

      if (new Date() > expiresAt) {
        Alert.alert('Expired Code', 'The code has expired. Please login again.');
        setShow2FA(false);
        return;
      }

      // ✅ 2FA passed
      await saveUserToFirestore(currentUser);
      setShow2FA(false);
      navigation.replace('Home', { user: currentUser.email! });
    } catch (err) {
      Alert.alert('Error', 'Something went wrong while verifying 2FA.');
    }
  };

  // ----------------------------
  // Persistent login
  // ----------------------------
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
    if (user && !user.emailVerified) {
      // Force sign out if email is not verified
      auth.signOut();
    }
    // Do NOT auto-navigate here
  });
  return unsubscribe;
}, []);

  // ----------------------------
  // Save user to Firestore
  // ----------------------------
  const saveUserToFirestore = async (user: User) => {
    try {
      await setDoc(
        doc(db, 'users', user.uid),
        {
          email: user.email,
          name: user.displayName || '',
          lastLogin: new Date(),
        },
        { merge: true }
      );
    } catch (err) {
      console.error('Error saving user to Firestore:', err);
    }
  };

  if (show2FA) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.twoFAContainer}>
          <Text style={styles.title}>Enter 2FA Code</Text>
          <TextInput
            placeholder="6-digit code"
            keyboardType="number-pad"
            style={styles.twoFAInput} // use this style
            value={twoFACode}
            onChangeText={setTwoFACode}
          />
          <TouchableOpacity style={styles.signInButton} onPress={verify2FA}>
            <Text style={styles.signInButtonText}>Verify</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Image source={require('../assets/logoo.png')} style={styles.logo} />
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue your journey</Text>

          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            style={[styles.input, { marginBottom: 16 }]}
            value={email}
            onChangeText={setEmail}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              textContentType="password"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.passwordToggle}
            >
              <FontAwesome
                name={showPassword ? "eye" : "eye-slash"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.signInButton, loading && { opacity: 0.7 }]}
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signInButtonText}>Sign In</Text>}
          </TouchableOpacity>

          <Text style={styles.orText}>or continue with</Text>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={() => promptAsync()}
            disabled={!request || googleLoading}
          >
            {googleLoading ? (
              <ActivityIndicator color="#fff" style={{ marginRight: 10 }} />
            ) : (
              <FontAwesome name="google" size={20} color="white" style={{ marginRight: 10 }} />
            )}
            <Text style={styles.googleText}>{googleLoading ? 'Signing in...' : 'Sign in with Google'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signUpText}>
              Don’t have an account? <Text style={{ fontWeight: '600', color: '#228B73' }}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, justifyContent: 'center', backgroundColor: '#fff' },
  container: { padding: 24, alignItems: 'center' },
  logo: { width: 140, height: 160, resizeMode: 'contain', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '700', color: '#222', marginBottom: 5 },
  subtitle: { fontSize: 15, color: '#666', marginBottom: 25 },
  inputContainer: {
    width: '100%',
    position: 'relative', // important for absolute child
    marginBottom: 12,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fafafa',
    paddingRight: 40, // space for eye icon
    textAlignVertical: 'center',
    marginBottom: 16,
  },
  forgotPassword: { color: '#007bff', alignSelf: 'flex-end', marginBottom: 16 },
  signInButton: { backgroundColor: '#228B73', paddingVertical: 14, borderRadius: 10, width: '100%', marginBottom: 20 },
  signInButtonText: { color: '#fff', textAlign: 'center', fontWeight: '600', fontSize: 16 },
  orText: { color: '#666', fontSize: 14, marginBottom: 16 },
  googleButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DB4437', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, marginBottom: 25 },
  googleText: { color: '#fff', fontWeight: '500', fontSize: 16 },
  signUpText: { fontSize: 15, color: '#444', marginTop: 5 },
  passwordContainer: {
  flexDirection: 'row',       // align input + toggle horizontally
  alignItems: 'center',       // vertical center
  width: '100%',
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 8,
  backgroundColor: '#fafafa',
  paddingHorizontal: 12,
  marginBottom: 16,
  },
  passwordInput: {
    flex: 1,                    // take all remaining space
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
  },
  passwordToggle: {
    marginLeft: 8,               // spacing between text and icon
    padding: 4,                  // slightly larger touchable area
  },
  twoFAContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },

  twoFAInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fafafa',
    textAlignVertical: 'center',
    marginTop: 16,   // gap between label and input
    marginBottom: 20 // gap between input and button
  },
});

export default LoginScreen;
