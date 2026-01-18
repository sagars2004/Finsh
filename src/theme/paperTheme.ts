import { MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { colors } from './colors';

/**
 * React Native Paper theme configured for iOS-native PocketPrism styling
 * This gives you beautiful iOS-looking components out of the box
 */
export const paperTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary, // #4A90E2
    primaryContainer: colors.primaryLight,
    secondary: colors.accent,
    secondaryContainer: colors.tradeoffOptionB,
    tertiary: colors.info,
    surface: colors.surface, // #FFFFFF
    surfaceVariant: colors.surfaceSecondary, // #F1F3F5
    background: colors.background, // #F8F9FA
    error: colors.error,
    errorContainer: colors.accentNegative,
    onPrimary: colors.surface, // White text on primary
    onSecondary: colors.surface,
    onSurface: colors.text, // #1A1A1A
    onSurfaceVariant: colors.textSecondary, // #6C757D
    onBackground: colors.text,
    onError: colors.surface,
    outline: colors.border, // #DEE2E6
    outlineVariant: colors.borderLight, // #E9ECEF
  },
  // iOS-style rounded corners
  roundness: 8,
};
