import { Platform } from 'react-native';

export const typography = {
  // Heading styles - Larger and more fun
  h1: {
    fontSize: 34,
    fontWeight: '700' as const,
    lineHeight: 42,
    letterSpacing: -0.8,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  
  // Body styles - Larger for better readability
  body: {
    fontSize: 17,
    fontWeight: '400' as const,
    lineHeight: 26,
  },
  bodyLarge: {
    fontSize: 19,
    fontWeight: '400' as const,
    lineHeight: 28,
  },
  bodySmall: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  
  // Special styles - More playful
  caption: {
    fontSize: 13,
    fontWeight: '500' as const,
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  button: {
    fontSize: 17,
    fontWeight: '600' as const,
    lineHeight: 26,
    letterSpacing: 0.3,
  },
  
  // Font family - Using rounded fonts for a friendlier feel
  fontFamily: Platform.select({
    ios: 'System', // Uses SF Pro Rounded on iOS when available
    android: 'Roboto',
    default: 'System',
  }),
};
