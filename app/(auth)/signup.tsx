import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { Toast } from '../../src/components/Toast';
import { colors, typography } from '../../src/styles/theme';
import { useAppDispatch, useAppSelector } from '../../src/store/hooks';
import { signUp, sendOtp, verifyOtp } from '../../src/store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export default function SignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [toastConfig, setToastConfig] = useState({
    visible: false,
    message: '',
    type: 'error' as 'error' | 'success' | 'info',
  });
  const [validationErrors, setValidationErrors] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      showToast(error, 'error');
    }
  }, [error]);

  const showToast = (message: string, type: 'error' | 'success' | 'info' = 'error') => {
    setToastConfig({ visible: true, message, type });
  };

  const validatePassword = (value: string) => {
    if (!value) return '';
    if (!PASSWORD_REGEX.test(value)) {
      return 'Password must include minimum 8 characters, uppercase letter, lowercase letter, number and a special character.';
    }
    return '';
  };

  const validateEmail = (value: string) => {
    if (!value) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const error = validatePassword(value);
    setValidationErrors(prev => ({ ...prev, password: error }));
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    const error = validateEmail(value);
    setValidationErrors(prev => ({ ...prev, email: error }));
  };

  const handleSignUp = async () => {
    try {
      // Validate inputs
      const errors = {
        fullName: !fullName ? 'Full name is required' : '',
        email: validateEmail(email),
        password: validatePassword(password),
      };

      setValidationErrors(errors);

      if (Object.values(errors).some(error => error)) {
        const firstError = Object.values(errors).find(error => error);
        showToast(firstError || 'Please fix the validation errors');
        return;
      }

      const role = await AsyncStorage.getItem('userRole') as 'ORGANIZER' | 'USER';
      if (!role) {
        showToast('Please select a role first');
        return;
      }

      const result = await dispatch(signUp({
        email,
        password,
        name: fullName,
        role,
      })).unwrap();

      if (result.success === true) {
        await AsyncStorage.setItem('navigationSource', 'signup');
        showToast('Registration successful! Please verify your email.', 'success');
        setTimeout(() => {
          router.replace('/verify-otp');
        }, 2000);
      }
    } catch (err: any) {
      // Error is handled by the auth slice and shown via useEffect
    }
  };

  const handleVerifyOtp = async () => {
    try {
      if (!otp) {
        showToast('Please enter the OTP');
        return;
      }
      const role = await AsyncStorage.getItem('userRole') as 'ORGANIZER' | 'USER';
      if (!role) {
        showToast('Please select a role first');
        return;
      }

      await dispatch(verifyOtp({ email, code: otp, role })).unwrap();
      showToast('OTP verified successfully!', 'success');
    } catch (err: any) {
      // Error is handled by the auth slice
    }
  };

  const handleResendOtp = async () => {
    try {
      const role = await AsyncStorage.getItem('userRole') as 'ORGANIZER' | 'USER';
      if (!role) {
        showToast('Please select a role first');
        return;
      }
      await dispatch(sendOtp({ email, role })).unwrap();
      showToast('OTP sent successfully!', 'success');
    } catch (err: any) {
      // Error is handled by the auth slice
    }
  };

  return (
    <LinearGradient colors={['#7F0102', '#0B0179']} style={styles.container}>
      <ScrollView  contentContainerStyle={styles.content}>
      <Toast
        visible={toastConfig.visible}
        message={toastConfig.message}
        type={toastConfig.type}
        onHide={() => setToastConfig(prev => ({ ...prev, visible: false }))}
      />

      <View style={styles.header}>
        <Text style={styles.logo}>TiXLY</Text>
        <Text style={styles.tagline}>where events come to life!</Text>
        <Text style={styles.title}>Almost There! Set Your New Password Now.</Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter your full name"
          autoCapitalize="words"
          error={validationErrors.fullName}
        />

        <Input
          label="Email"
          value={email}
          onChangeText={handleEmailChange}
          placeholder="Enter your email address"
          keyboardType="email-address"
          autoCapitalize="none"
          error={validationErrors.email}
        />

        <Input
          label="Password"
          value={password}
          onChangeText={handlePasswordChange}
          placeholder="Create a new password"
          secureTextEntry
          error={validationErrors.password}
        />

        {showOtpInput && (
          <Input
            label="OTP"
            value={otp}
            onChangeText={setOtp}
            placeholder="Enter OTP sent to your email"
            keyboardType="number-pad"
          />
        )}

        {showOtpInput ? (
          <View>
            <Button
              title="Verify OTP"
              onPress={handleVerifyOtp}
              loading={isLoading}
            />
            <Button
              title="Resend OTP"
              onPress={handleResendOtp}
              loading={isLoading}
              variant="secondary"
              style={styles.resendButton}
            />
          </View>
        ) : (
        <Button
          title="Sign Up"
          onPress={handleSignUp}
            loading={isLoading}
            style={{width:210, height: 51, alignSelf: 'center'}}
        />
        )}

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <Link href="/login" style={styles.loginLink}>
            <Text style={styles.loginLinkText}>Sign In</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    ...typography.h1,
    color: colors.white,
    fontSize: 48,
    marginBottom: 8,
  },
  tagline: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: 24,
  },
  title: {
    ...typography.h2,
    color: colors.white,
    textAlign: 'center',
  },
  form: {
    flex: 1,
    marginTop: 20,
  },
  passwordRequirements: {
    color: colors.primary,
    ...typography.caption,
    marginTop: -8,
    marginBottom: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginText: {
    color: colors.text.secondary,
    ...typography.body,
  },
  loginLink: {
    marginLeft: 4,
  },
  loginLinkText: {
    color: colors.primary,
    ...typography.body,
    fontFamily: 'Urbanist_600SemiBold',
  },
  resendButton: {
    marginTop: 12,
  },
});