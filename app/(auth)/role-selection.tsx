import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '../../src/components/Button';
import { colors, typography } from '../../src/styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch } from '../../src/store/hooks';
import { setUserRole } from '../../src/store/slices/authSlice';

type Role = 'USER' | 'ORGANIZER';

const { width, height } = Dimensions.get('window');

export default function RoleSelectionScreen() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const dispatch = useAppDispatch();
  const { source } = useLocalSearchParams();

  const handleRoleSelection = (role: Role) => {
    setSelectedRole(role);
  };

  const handleContinue = async () => {
    if (selectedRole) {
      await AsyncStorage.setItem('userRole', selectedRole);
      dispatch(setUserRole(selectedRole));
      
      // Navigate based on source
      if (source === 'forgot-password') {
        router.replace('/(auth)/forgot-password');
      } else {
        router.replace('/(auth)/login');
      }
    }
  };

  return (
    <ImageBackground 
      source={require('src/assets/images/select-role.png')} 
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.content}>
        <Text style={styles.logo}>TiXLY</Text>
        <Text style={styles.tagline}>where events come to life!</Text>
        
        <Text style={styles.title}>
          {source === 'forgot-password' 
            ? 'Select your account type to\nreset password'
            : 'Join the fun or create the\nexperience, Your choice!'}
        </Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedRole === 'USER' && styles.selectedOption,
            ]}
            onPress={() => handleRoleSelection('USER')}
          >
            <View
              style={[
                styles.radioButton,
                selectedRole === 'USER' && styles.radioButtonSelected,
              ]}
            />
            <Text style={styles.optionText}>User</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedRole === 'ORGANIZER' && styles.selectedOption,
            ]}
            onPress={() => handleRoleSelection('ORGANIZER')}
          >
            <View
              style={[
                styles.radioButton,
                selectedRole === 'ORGANIZER' && styles.radioButtonSelected,
              ]}
            />
            <Text style={styles.optionText}>Event Organizer</Text>
          </TouchableOpacity>
        </View>

        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!selectedRole}
          style={styles.continueButton}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: width,
    height: height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    ...typography.h1,
    top: 191,
    color: colors.white,
    fontSize: 63,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 19,
    top: 160,
    color: colors.white,
    fontFamily: 'Urbanist_400Regular',
    letterSpacing: 1,
    marginTop: 8,
  },
  title: {
    fontSize: 20,
    top: 160,
    color: colors.white,
    fontFamily: 'Urbanist_400Regular',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 48,
    letterSpacing: 1,
   
  },
  optionsContainer: {
    width: '100%',
    top: 165,
    marginHorizontal: 40,
    marginTop: 48,
    gap: 16,
  },
  optionButton: {
    flexDirection: 'row',
    width: '100%',
    height: 60,
    
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    padding: 16,
    gap: 12,
  },
  selectedOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.white,
  },
  radioButtonSelected: {
    backgroundColor: colors.white,
  },
  optionText: {
    fontSize: 14,
    color: '#E1E1E1',
    lineHeight: 14 * 1,
    letterSpacing: 1,
    fontFamily: 'Urbanist_400Regular',
  },
  continueButton: {
    position: 'absolute',
    top: 611,
    width: 210,
    height: 51,
    borderRadius: 100,
  },
}); 