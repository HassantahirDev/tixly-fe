import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { typography } from '../src/styles/theme';
import { useCallback, useEffect } from 'react';
import { router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch } from '../src/store/hooks';
import api from '../src/services/api';

SplashScreen.preventAutoHideAsync();

export default function Splash() {
  const dispatch = useAppDispatch();

  const validateToken = async (token: string) => {
    try {
      // Check if token exists and has the correct format
      if (!token || token === 'undefined' || token === 'null') {
        return false;
      }

      // Set the token in the API instance
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
    

      
      return true;
    } catch (error) {
      // If request fails, token is invalid
      await AsyncStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      return false;
    }
  };

  const checkInitialState = async () => {
    try {
      // Check if it's first time using the app
      const hasUsedApp = await AsyncStorage.getItem('hasUsedApp');
      
      if (!hasUsedApp) {
        // First time user
        await AsyncStorage.setItem('hasUsedApp', 'true');
        router.replace('/onboarding');
        return;
      }

      // Not first time, check authentication
      const token = await AsyncStorage.getItem('token');
      
      if (token) {
        // Validate the token
        const isValid = await validateToken(token);
        
        if (isValid) {
          // Token is valid, user is logged in
          router.replace('/(tabs)');
        } else {
          // Token is invalid, clear it and redirect to login
          await AsyncStorage.removeItem('token');
          router.replace('/(auth)/login');
        }
      } else {
        // No token found, user needs to log in
        router.replace('/(auth)/login');
      }
    } catch (error) {
      // In case of any error, safely redirect to login
      await AsyncStorage.removeItem('token');
      router.replace('/(auth)/login');
    }
  };

  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    // Wait for 2 seconds to show splash screen, then check state
    const timer = setTimeout(() => {
      checkInitialState();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#7F0102', '#0B0179']}
      style={styles.container}
      onLayout={onLayoutRootView}
    >
      <Text style={styles.logo}>TiXLY</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    ...typography.h1,
    fontSize: 48,
    color: '#FFFFFF',
    fontFamily: 'Urbanist_700Bold',
    letterSpacing: 2,
  },
}); 
