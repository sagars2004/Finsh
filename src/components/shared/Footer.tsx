import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { useOnboarding } from '../../context/OnboardingContext';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface FooterProps {
  onHomePress?: () => void;
  onProfilePress?: () => void;
  onSettingsPress?: () => void;
  navigation?: any; // For navigation to settings
}

export function Footer({ onHomePress, onProfilePress, onSettingsPress, navigation }: FooterProps) {
  const { currentColors } = useTheme();
  const { clearUserData } = useUser();
  const { resetOnboarding } = useOnboarding();

  const handleSettingsPress = () => {
    if (navigation) {
      navigation.navigate('Settings');
    } else if (onSettingsPress) {
      onSettingsPress();
    }
  };

  const handleHomePress = async () => {
    // Check if we're already on Welcome screen
    const currentRoute = navigation?.getState()?.routes[navigation?.getState()?.index || 0]?.name;
    
    if (currentRoute === 'Welcome') {
      // Already on Welcome screen, no action needed
      return;
    }

    // Show confirmation dialog
    Alert.alert(
      'Return to Homepage?',
      'Do you want to return to the homepage? Your progress will not be saved.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Continue',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear all user data
              await clearUserData();
              // Reset onboarding data (clears all input fields)
              resetOnboarding();
              // Navigate to Welcome screen
              if (navigation) {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Welcome' }],
                });
              } else if (onHomePress) {
                onHomePress();
              }
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'Failed to clear data. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    }
    // TODO: Navigate to profile when created
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: currentColors.borderLight,
      backgroundColor: currentColors.surface,
      minHeight: spacing.touchTarget + spacing.md,
    },
    iconButton: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      minWidth: 60,
    },
    icon: {
      fontSize: 24,
      marginBottom: spacing.xs,
    },
    label: {
      ...typography.caption,
      color: currentColors.textSecondary,
      fontSize: 11,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={handleHomePress}
        activeOpacity={0.7}
      >
        <Text style={styles.icon}>🏠</Text>
        <Text style={styles.label}>Home</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.iconButton}
        onPress={handleProfilePress}
        activeOpacity={0.7}
      >
        <Text style={styles.icon}>👤</Text>
        <Text style={styles.label}>Profile</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.iconButton}
        onPress={handleSettingsPress}
        activeOpacity={0.7}
      >
        <Text style={styles.icon}>⚙️</Text>
        <Text style={styles.label}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}
