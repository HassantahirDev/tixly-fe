import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link, router } from 'expo-router';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { colors, typography } from '../../src/styles/theme';
import { useAppDispatch, useAppSelector } from '../../src/store/hooks';
import { sendOtp } from '../../src/store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  const handleSubmit = async () => {
    try {
      setErrorMessage('');
      
      const role = await AsyncStorage.getItem('userRole') as 'ORGANIZER' | 'USER';

      if (!email) {
        throw new Error('Please enter your email address');
      }

      await dispatch(sendOtp({ email, role })).unwrap();
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('navigationSource', 'forgot-password');
      router.push('/verify-otp');
    } catch (err: any) {
      setErrorMessage(err || err[0] || 'Failed to send OTP. Please try again.');
    }
  };

  return (
    <LinearGradient colors={['#7F0102', '#0B0179']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>TiXLY</Text>
        <Text style={styles.tagline}>where events come to life!</Text>
        <Text style={styles.title}>
          Stay in the Loop – Reset Your Password Easily!
        </Text>

        <Text style={styles.note}>
          Enter your email address to reset your password
        </Text>
      </View>

      <View style={styles.form}>
        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Your email or phone"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Button title="Continue" onPress={handleSubmit} loading={isLoading} />

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <Link href="/signup" style={styles.signupLink}>
            <Text style={styles.signupLinkText}>Sign Up</Text>
          </Link>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
    paddingHorizontal: 40,
  },
  logo: {
    fontFamily: 'Urbanist_700Bold',
    color: colors.white,
    fontSize: 48,
  },
  tagline: {
    fontFamily: 'Urbanist_400Regular',
    fontSize: 12,
    lineHeight: 12*1.2,
    letterSpacing: 1,
    color: colors.white,
    marginBottom: 24,
  },
  title: {
    top: 50,
    fontFamily: 'Urbanist_400Regular',
    lineHeight: 16*1.2,
    letterSpacing: 1,
    fontSize: 16,
    color: '#F5F5F5',
    marginBottom: 40,

  },
  note: {
    top: 50,
    fontFamily: 'Urbanist_400Regular',
    lineHeight: 14*1.2,
    letterSpacing: 1,
    fontSize: 14,
    color: '#E1E1E1',
    marginBottom: 5,
   
  },
  form: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 40,
  },
  error: {
    color: colors.primary,
    ...typography.body,
    marginBottom: 16,
    textAlign: 'center',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  signupText: {
    color: colors.text.secondary,
    ...typography.body,
  },
  signupLink: {
    marginLeft: 4,
  },
  signupLinkText: {
    color: colors.primary,
    ...typography.body,
    fontFamily: 'Urbanist_600SemiBold',
  },
});
