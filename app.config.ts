import 'dotenv/config';
import { ExpoConfig } from '@expo/config-types';

const config: ExpoConfig = {
  name: 'Doctor Travel & Tours',
  slug: 'mobile-app-v6',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon-v2.png',
  scheme: 'mobileapp',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash-icon-v2.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
  },
  android: {
    splash: {  // <--- add this section
      image: './assets/splash-icon-v2.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon-v2.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: 'com.mrjoey0125.mobileappv3',
    jsEngine: 'hermes',
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    "expo-build-properties",
    "expo-web-browser",
    "expo-image-picker",
    "expo-file-system",
    "expo-system-ui",
    "expo-splash-screen",
    "expo-updates"
  ],
  extra: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    firebaseMeasurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
    googleClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    eas: {
      projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID,
    },
  },
};

export default config;
