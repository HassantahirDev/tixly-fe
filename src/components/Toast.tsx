import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { colors, typography } from '../styles/theme';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  visible: boolean;
  onHide: () => void;
}

const { height } = Dimensions.get('window');

export function Toast({ message, type = 'error', visible, onHide }: ToastProps) {
  const translateY = new Animated.Value(-100);

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: 50,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => onHide());
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        styles[`${type}Container`],
        { transform: [{ translateY }] },
      ]}
    >
      <Text style={[styles.message, styles[`${type}Text`]]}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
  errorContainer: {
    backgroundColor: 'rgba(237, 29, 32, 0.95)',
  },
  successContainer: {
    backgroundColor: 'rgba(75, 181, 67, 0.95)',
  },
  infoContainer: {
    backgroundColor: 'rgba(59, 130, 246, 0.95)',
  },
  message: {
    ...typography.body,
    textAlign: 'center',
  },
  errorText: {
    color: colors.white,
  },
  successText: {
    color: colors.white,
  },
  infoText: {
    color: colors.white,
  },
}); 