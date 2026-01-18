/**
 * Authentication Screen
 * 
 * Displays sign-in options using WorkOS AuthKit providers.
 * Supports Google, GitHub, Microsoft, and other OAuth providers.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface AuthScreenProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AuthScreen({ onSuccess, onCancel }: AuthScreenProps) {
  const { signIn, signUp, isLoading: authLoading } = useAuth();
  const { currentColors } = useTheme();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signIn();
      onSuccess?.();
    } catch (error) {
      console.error('Sign in error:', error);
      Alert.alert(
        'Sign In Failed',
        'Unable to sign in. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignUp = async () => {
    try {
      setIsSigningUp(true);
      await signUp();
      onSuccess?.();
    } catch (error) {
      console.error('Sign up error:', error);
      Alert.alert(
        'Sign Up Failed',
        'Unable to sign up. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSigningUp(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentColors.background,
    },
    scrollContent: {
      flexGrow: 1,
      padding: spacing.lg,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: spacing.xxl,
    },
    title: {
      ...typography.h1,
      color: currentColors.text,
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    subtitle: {
      ...typography.bodyLarge,
      color: currentColors.textSecondary,
      textAlign: 'center',
      marginBottom: spacing.xl,
      paddingHorizontal: spacing.md,
    },
    providersContainer: {
      width: '100%',
      marginTop: spacing.lg,
    },
    authButton: {
      width: '100%',
      marginBottom: spacing.md,
    },
    buttonContent: {
      paddingVertical: spacing.sm,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: spacing.lg,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: currentColors.borderLight,
    },
    dividerText: {
      ...typography.bodySmall,
      color: currentColors.textTertiary,
      marginHorizontal: spacing.md,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      ...typography.body,
      color: currentColors.textSecondary,
      marginLeft: spacing.sm,
    },
    cancelButton: {
      marginTop: spacing.lg,
    },
    footer: {
      marginTop: spacing.xl,
      paddingTop: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: currentColors.borderLight,
    },
    footerText: {
      ...typography.caption,
      color: currentColors.textTertiary,
      textAlign: 'center',
      marginTop: spacing.sm,
    },
    infoText: {
      ...typography.bodySmall,
      color: currentColors.textSecondary,
      textAlign: 'center',
      marginTop: spacing.lg,
      fontStyle: 'italic',
      paddingHorizontal: spacing.md,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to Finsh</Text>
          <Text style={styles.subtitle}>
            Sign in to save your data and access it across devices
          </Text>

          <View style={styles.providersContainer}>
            <Button
              mode="contained"
              onPress={handleSignIn}
              disabled={isSigningIn || isSigningUp || authLoading}
              loading={isSigningIn}
              buttonColor={currentColors.primary}
              textColor={currentColors.surface}
              style={styles.authButton}
              contentStyle={styles.buttonContent}
            >
              Sign In
            </Button>
            
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>
            
            <Button
              mode="outlined"
              onPress={handleSignUp}
              disabled={isSigningIn || isSigningUp || authLoading}
              loading={isSigningUp}
              buttonColor={currentColors.surface}
              textColor={currentColors.primary}
              style={styles.authButton}
              contentStyle={styles.buttonContent}
            >
              Sign Up
            </Button>
            
            <Text style={styles.infoText}>
              WorkOS AuthKit supports multiple sign-in options including Google, GitHub, Microsoft, and email/password.
            </Text>
          </View>

          {onCancel && (
            <Button
              mode="text"
              onPress={onCancel}
              textColor={currentColors.textSecondary}
              style={styles.cancelButton}
            >
              Cancel
            </Button>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to Finsh's Terms of Service and Privacy Policy
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
