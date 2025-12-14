// App.tsx
declare const global: {
  HermesInternal?: any;
} & typeof globalThis;

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Constants from 'expo-constants';

import { FavoritesProvider } from './components/FavoritesContext';

// ----- Screen Imports -----
import SplashScreen from './screens/SplashScreens';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import SearchResultsScreen from './screens/SearchResultScreen';
import ViewMoreScreen from './screens/ViewMoreScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import ProfileScreen from './screens/ProfileScreen';
import PackageDetailsScreen from './screens/PackageDetailsScreen';
import TravellerInfoScreen from './screens/TravellerInfoScreen';
import PastBookingsScreen from './screens/PastBookingsScreen';
import UpcomingFlightsScreen from './screens/UpcomingFlightsScreen';
import FaqsScreen from './screens/FaqsScreen';
import FeedbackScreen from './screens/FeedbackScreen';
import AboutScreen from './screens/AboutScreen';
import AirlinePackageScreen from './screens/AirlinePackageScreen';
import ConfirmationScreen from './screens/ConfirmationScreen';
import BookingScreen from './screens/BookingScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import { BottomNavProvider } from './components/BottomNavContext';

// ----- Types -----
export type PackageType = {
  id: string;
  image: any;
  airline: string;
  destination: string;
  location: string;
  price: number;
  itinerary?: { day: number; activities: string[] }[];
  description?: string;
  gallery?: any[];
  duration?: string;
  stops?: string[];
  inclusions?: string[];
  exclusions?: string[];
  departure?: string;
  arrival?: string;
  available?: number;
  isLocal?: boolean;
};

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  Home: { user: string };
  SearchResults: { origin: string; destination: string; user: string } | undefined;
  ViewMore: { searchTerm?: string };
  FavoritesScreen: undefined;
  ProfileScreen: { user: string } | undefined;
  PackageDetails: { selectedPackage: PackageType };
  TravellerInfo: { selectedPackage: PackageType; totalCost?: number };
  PastBookingsScreen: undefined;
  UpcomingFlightsScreen: { user: string };
  FaqsScreen: undefined;
  FeedbackScreen: undefined;
  AboutScreen: undefined;
  AirlinePackageScreen: undefined;
  Booking: { flightId: string; user: string };
  Confirmation: { bookingId: string; user: string };
  ChangePasswordScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// ----- App Component -----
export default function App() {
  console.log('Hermes enabled?', !!global.HermesInternal);

  const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.SUPABASE_ANON_KEY;

  useEffect(() => {
    const triggerGeocode = async () => {
      if (!SUPABASE_ANON_KEY) {
        console.warn('Supabase anon key missing, skipping geocode trigger');
        return;
      }

      try {
        const res = await fetch(
          'https://sdayzkpfodzqbpugprwq.functions.supabase.co/geocode-itineraries',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
              apikey: SUPABASE_ANON_KEY,
              'Content-Type': 'application/json',
            },
          }
        );

        const text = await res.text();
        console.log('Geocode response:', text);
      } catch (err) {
        console.error('Error triggering geocode:', err);
      }
    };

    triggerGeocode();
  }, []);

  return (
    <BottomNavProvider>
      <FavoritesProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="SearchResults"
              component={SearchResultsScreen}
              initialParams={{ origin: 'string', destination: 'string', user: 'Guest' }}
            />
            <Stack.Screen name="PackageDetails" component={PackageDetailsScreen} />
            <Stack.Screen name="ViewMore" component={ViewMoreScreen} />
            <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="TravellerInfo" component={TravellerInfoScreen} />
            <Stack.Screen name="PastBookingsScreen" component={PastBookingsScreen} />
            <Stack.Screen name="UpcomingFlightsScreen" component={UpcomingFlightsScreen} />
            <Stack.Screen name="FaqsScreen" component={FaqsScreen} />
            <Stack.Screen name="FeedbackScreen" component={FeedbackScreen} />
            <Stack.Screen name="AboutScreen" component={AboutScreen} />
            <Stack.Screen name="AirlinePackageScreen" component={AirlinePackageScreen} />
            <Stack.Screen name="Booking" component={BookingScreen} />
            <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
            <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </FavoritesProvider>
    </BottomNavProvider>

  );
}
