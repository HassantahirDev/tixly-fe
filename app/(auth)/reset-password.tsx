import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { Toast } from '../../src/components/Toast';
import { colors, typography } from '../../src/styles/theme';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { updatePassword } from '@/src/store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    password: '',
    confirmPassword: '',
  });
  const [toastConfig, setToastConfig] = useState({
    visible: false,
    message: '',
    type: 'error' as 'error' | 'success' | 'info',
  });
  
  const dispatch = useAppDispatch();
  const { isLoading, error: reduxError } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (reduxError) {
      showToast(reduxError, 'error');
    }
  }, [reduxError]);

  const showToast = (message: string, type: 'error' | 'success' | 'info' = 'error') => {
    setToastConfig({ visible: true, message, type });
  };

  const validatePassword = (value: string) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters long';
    if (!PASSWORD_REGEX.test(value)) {
      return 'Password must include minimum 8 characters, uppercase letter, lowercase letter, number and a special character';
    }
    return '';
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const error = validatePassword(value);
    setValidationErrors(prev => ({ ...prev, password: error }));
    
    // Validate confirm password match if it exists
    if (confirmPassword) {
      setValidationErrors(prev => ({
        ...prev,
        confirmPassword: value !== confirmPassword ? 'Passwords do not match' : ''
      }));
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setValidationErrors(prev => ({
      ...prev,
      confirmPassword: value !== password ? 'Passwords do not match' : ''
    }));
  };

  const handleResetPassword = async () => {
    try {
      setError('');

      // Test Case 1: Empty fields validation
      if (!password || !confirmPassword) {
        const message = 'Please fill in all fields';
        setError(message);
        showToast(message, 'error');
        return;
      }

      // Test Case 2: Password strength validation
      const passwordError = validatePassword(password);
      if (passwordError) {
        setError(passwordError);
        showToast(passwordError, 'error');
        return;
      }

      // Test Case 3: Password match validation
      if (password !== confirmPassword) {
        const message = 'Passwords do not match';
        setError(message);
        showToast(message, 'error');
        return;
      }

      // Test Case 4: Required data validation
      const email = await AsyncStorage.getItem('email');
      const role = await AsyncStorage.getItem('userRole') as 'ORGANIZER' | 'USER';

      if (!email || !role) {
        const message = 'Missing required information. Please try again.';
        setError(message);
        showToast(message, 'error');
        return;
      }

      // Test Case 5: API call and response handling
      await dispatch(updatePassword({
        email,
        password,
        role,
      })).unwrap();

      // Show success toast and clear form
      showToast('Password updated successfully! Redirecting to login...', 'success');
      setPassword('');
      setConfirmPassword('');
      setValidationErrors({ password: '', confirmPassword: '' });
      
      // Navigate after showing success message
      setTimeout(() => {
        router.replace('/login');
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update password. Please try again.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    }
  };

  return (
    <View style={styles.container}>
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
        {error && <Text style={styles.error}>{error}</Text>}

        <Input
          label="Password"
          value={password}
          onChangeText={handlePasswordChange}
          placeholder="Enter a new password"
          secureTextEntry
          error={validationErrors.password}
        />

        <Input
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={handleConfirmPasswordChange}
          placeholder="Confirm your password"
          secureTextEntry
          error={validationErrors.confirmPassword}
        />

        <Text style={styles.passwordRequirements}>
          Password must include minimum 8 characters, uppercase letter, lowercase letter, number and a special character.
        </Text>

        <Button
          title="Reset Password"
          onPress={handleResetPassword}
          loading={isLoading}
        />
      </View>
    </View>
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
  error: {
    color: colors.primary,
    ...typography.body,
    marginBottom: 16,
    textAlign: 'center',
  },
  passwordRequirements: {
    color: colors.text.secondary,
    ...typography.caption,
    marginTop: -8,
    marginBottom: 24,
  },
});