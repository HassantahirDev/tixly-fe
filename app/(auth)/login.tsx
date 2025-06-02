import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import { Input } from '@/src/components/Input';
import { Button } from '../../src/components/Button';
import { Toast } from '../../src/components/Toast';
import { colors, typography } from '../../src/styles/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDispatch, useAppSelector } from '../../src/store/hooks';
import { login, sendOtp } from '../../src/store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [validationErrors, setValidationErrors] = React.useState({
    email: '',
    password: '',
  });
  const [toastConfig, setToastConfig] = React.useState({
    visible: false,
    message: '',
    type: 'error' as 'error' | 'success' | 'info',
  });
  
  const dispatch = useAppDispatch();
  const { isLoading, error, userRole } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      showToast(error, 'error');
    }
  }, [error]);

  const showToast = (message: string, type: 'error' | 'success' | 'info' = 'error') => {
    setToastConfig({ visible: true, message, type });
  };

  const validateEmail = (value: string) => {
    if (!value) return 'Email is required';
    if (!EMAIL_REGEX.test(value)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (value: string) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    return '';
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    const error = validateEmail(value);
    setValidationErrors(prev => ({ ...prev, email: error }));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const error = validatePassword(value);
    setValidationErrors(prev => ({ ...prev, password: error }));
  };

  const handleLogin = async () => {
    try {
      setErrorMessage('');

      // Test Case 1: Empty fields validation
      if (!email || !password) {
        const message = 'Please fill in all fields';
        setErrorMessage(message);
        showToast(message, 'error');
        return;
      }

      // Test Case 2: Email format validation
      const emailError = validateEmail(email);
      if (emailError) {
        setErrorMessage(emailError);
        showToast(emailError, 'error');
        return;
      }

      // Test Case 3: Password validation
      const passwordError = validatePassword(password);
      if (passwordError) {
        setErrorMessage(passwordError);
        showToast(passwordError, 'error');
        return;
      }

      // Test Case 4: Role validation
      const role = await AsyncStorage.getItem('userRole') as 'ORGANIZER' | 'USER';
      if (!role) {
        const message = 'Please select a role first';
        setErrorMessage(message);
        showToast(message, 'error');
        return;
      }
      
      try {
        // Test Case 5: API call and response handling
        const result = await dispatch(login({ email, password, role })).unwrap();
        
        if (result) {
          // Store user role in AsyncStorage (support ADMIN)
          if (result.data && result.data.role) {
            await AsyncStorage.setItem('userRole', result.data.role.toUpperCase());
          }
          showToast('Login successful! Redirecting...', 'success');
          setTimeout(() => {
            if (result.data && result.data.role && result.data.role.toUpperCase() === 'ADMIN') {
              router.replace('/(tabs)/admin/home');
            } else {
              router.replace('/(tabs)');
            }
          }, 1000);
        }
      } catch (loginError: any) {
        // Check if the error is due to unverified email
        if (loginError?.toLowerCase().includes('email not verified') || 
            loginError?.toLowerCase().includes('verify your email')) {
          
          // Store email for OTP verification
          await AsyncStorage.setItem('email', email);
          await AsyncStorage.setItem('navigationSource', 'login');

          // Send OTP for verification
          try {
            await dispatch(sendOtp({ email, role })).unwrap();
            showToast('Please verify your email. Sending verification code...', 'info');
            
            // Navigate to verify OTP screen
            setTimeout(() => {
              router.replace('/verify-otp');
            }, 1500);
          } catch (otpError) {
            const otpErrorMsg = 'Failed to send verification code. Please try again.';
            setErrorMessage(otpErrorMsg);
            showToast(otpErrorMsg, 'error');
          }
        } else {
          // Handle other login errors
          throw loginError;
        }
      }
    } catch (err: any) {
      const errorMessage = err?.message || err || 'Login failed. Please try again.';
      setErrorMessage(errorMessage);
      showToast(errorMessage, 'error');
    }
  };

  return (
    <LinearGradient colors={['#7F0102', '#0B0179']} style={styles.container}>
      <Toast
        visible={toastConfig.visible}
        message={toastConfig.message}
        type={toastConfig.type}
        onHide={() => setToastConfig(prev => ({ ...prev, visible: false }))}
      />

      <View style={styles.header}>
        <Text style={styles.logo}>TiXLY</Text>
        <Text style={styles.tagline}>where events come to life!</Text>
      </View>
      
      <View>
        <Text style={styles.title}>
          Events made easy – Sign in & {'\n'}
          <Text>Get Started!</Text>
        </Text>
      </View>

      <View style={styles.form}>
       

        <Input
          label="Email"
          value={email}
          onChangeText={handleEmailChange}
          placeholder="Your email or phone"
          keyboardType="email-address"
          autoCapitalize="none"
          error={validationErrors.email}
        />

        <Input
          label="Password"
          value={password}
          onChangeText={handlePasswordChange}
          placeholder="Enter your password"
          secureTextEntry
          error={validationErrors.password}
        />

        <TouchableOpacity
          onPress={() => router.push({
            pathname: '/(auth)/role-selection',
            params: { source: 'forgot-password' }
          })}
          style={styles.forgotPassword}
        >
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        <Button 
          title="Sign In" 
          onPress={handleLogin} 
          loading={isLoading} 
          style={{width:210, height: 51, alignSelf: 'center'}}
        />
        
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
    backgroundColor: colors.background,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    ...typography.h1,
    top: 41,
    color: colors.white,
    fontSize: 63,
    marginBottom: 8,
  },
  tagline: {
    top: 16,
    fontSize: 12,
    letterSpacing: 1,
    fontFamily: 'Urbanist_400Regular',
    color: colors.white,
  },
  title: {
    fontFamily: 'Urbanist_400Regular',
    fontSize: 16,
    top: 110,
    marginBottom: 130, 
    letterSpacing: 1,
    lineHeight: 16 * 1.32,
    color: colors.white,
  },
  form: {
    flex: 1,
    marginTop: 20,
  },
  error: {
    color: colors.primary,
    ...typography.body,
    marginBottom: 16,
    textAlign: 'center',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: colors.white,
    ...typography.body,
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
  otpButton: {
    marginTop: 12,
  },
});
