import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#E53935',
  background: '#1A0B2E',
  white: '#FFFFFF',
  inputBg: 'rgba(255, 255, 255, 0.1)',
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.7)',
  },
};

export const typography = {
  h1: {
    fontSize: 32,
    fontFamily: 'Urbanist_700Bold',
  },
  h2: {
    fontSize: 24,
    fontFamily: 'Urbanist_600SemiBold',
  },
  body: {
    fontSize: 16,
    fontFamily: 'Urbanist_400Regular',
  },
  caption: {
    fontSize: 14,
    fontFamily: 'Urbanist_400Regular',
  },
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    padding: 16,
    color: colors.white,
    fontFamily: 'Urbanist_400Regular',
    marginBottom: 16,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: 'Urbanist_600SemiBold',
  },
  link: {
    color: colors.primary,
    fontFamily: 'Urbanist_600SemiBold',
  },
});