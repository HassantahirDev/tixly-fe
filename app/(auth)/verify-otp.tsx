import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { router } from 'expo-router';
import { Button } from '../../src/components/Button';
import { Toast } from '../../src/components/Toast';
import { colors, typography } from '../../src/styles/theme';
import { useAppDispatch, useAppSelector } from '../../src/store/hooks';
import { verifyOtp, sendOtp } from '../../src/store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function VerifyOtpScreen() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [toastConfig, setToastConfig] = useState({
    visible: false,
    message: '',
    type: 'error' as 'error' | 'success' | 'info',
  });
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  const showToast = (message: string, type: 'error' | 'success' | 'info' = 'error') => {
    setToastConfig({ visible: true, message, type });
  };

  const handleOtpChange = (text: string, index: number) => {
    if (text.length > 1) {
      text = text[0];
    }

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const otpValue = otp.join('');
      if (otpValue.length !== 4) {
        showToast('Please enter the complete OTP');
        return;
      }

      const email = await AsyncStorage.getItem('email');
      const role = await AsyncStorage.getItem('userRole') as 'ORGANIZER' | 'USER';
      const navigationSource = await AsyncStorage.getItem('navigationSource');

      if (!email || !role) {
        showToast('Missing required information');
        return;
      }

      await dispatch(verifyOtp({ email, code: otpValue, role })).unwrap();
      showToast('OTP verified successfully!', 'success');

      // Clear the navigation source
      await AsyncStorage.removeItem('navigationSource');
      
      // Navigate based on the source
      if (navigationSource === 'forgot-password') {
        setTimeout(() => {
          router.replace('/reset-password');
        }, 2000);
      } else {
        setTimeout(() => {
          router.replace('/login');
        }, 2000);
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to verify OTP');
    }
  };

  const handleResendOtp = async () => {
    try {
      const email = await AsyncStorage.getItem('email');
      const role = await AsyncStorage.getItem('userRole') as 'ORGANIZER' | 'USER';

      if (!email || !role) {
        showToast('Missing required information');
        return;
      }

      await dispatch(sendOtp({ email, role })).unwrap();
      showToast('OTP sent successfully!', 'success');
      
    } catch (err: any) {
      showToast(err?.message || 'Failed to send OTP');
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
        <Text style={styles.title}>Enter OTP to Verify Your Identity</Text>
        <Text style={styles.subtitle}>
          We've sent a verification code to your email address
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <React.Fragment key={index}>
              <TextInput
                style={styles.otpInput}
                value={digit}
                onChangeText={text => handleOtpChange(text, index)}
                onKeyPress={e => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                ref={el => inputRefs.current[index] = el}
              />
            </React.Fragment>
          ))}
        </View>

        <Button
          title="Verify"
          onPress={handleVerifyOtp}
          loading={isLoading}
          style={styles.verifyButton}
        />

        <TouchableOpacity 
          style={styles.resendContainer}
          onPress={handleResendOtp}
          disabled={isLoading}
        >
          <Text style={styles.resendText}>Didn't receive yet? </Text>
          <Text style={styles.resendLink}>Resend</Text>
        </TouchableOpacity>
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
    marginBottom: 8,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  form: {
    flex: 1,
    marginTop: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 16,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: colors.inputBg,
    textAlign: 'center',
    fontSize: 24,
    color: colors.white,
    fontFamily: 'Urbanist_600SemiBold',
  },
  verifyButton: {
    width: 210,
    height: 51,
    alignSelf: 'center',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  resendText: {
    color: colors.text.secondary,
    ...typography.body,
  },
  resendLink: {
    color: colors.primary,
    ...typography.body,
    fontFamily: 'Urbanist_600SemiBold',
  },
});