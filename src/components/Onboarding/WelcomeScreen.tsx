import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Animated, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface WelcomeScreenProps {
  onNext: () => void;
  onSignUp?: () => void;
  onLogIn?: () => void;
}

export function WelcomeScreen({ onNext, onSignUp, onLogIn }: WelcomeScreenProps) {
  const { currentColors, isDark } = useTheme();
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create a continuous floating/bobbing animation with sinusoidal motion
    // Using easing to approximate smooth sine wave movement
    const createFloatAnimation = () => {
      return Animated.loop(
        Animated.sequence([
          // Move up smoothly (approximates sine wave from 0 to π/2)
          Animated.timing(translateY, {
            toValue: -12, // Move up 12 pixels
            duration: 1600, // 1.6 seconds for smooth upward motion
            useNativeDriver: true,
          }),
          // Move back down smoothly (approximates sine wave from π/2 to π)
          Animated.timing(translateY, {
            toValue: 0, // Move back to center
            duration: 1600, // 1.6 seconds for smooth downward motion
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animation = createFloatAnimation();
    animation.start();

    return () => {
      animation.stop();
    };
  }, [translateY]);

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
    logoContainer: {
      marginBottom: spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      width: '100%',
    },
    logoWrapper: {
      width: 150,
      height: 150,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      width: 150,
      height: 150,
      alignSelf: 'center',
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
      marginBottom: spacing.lg,
      paddingHorizontal: spacing.md,
      lineHeight: 26,
    },
    description: {
      ...typography.body,
      color: currentColors.textSecondary,
      textAlign: 'center',
      paddingHorizontal: spacing.md,
      marginTop: spacing.lg,
    },
    buttonContainer: {
      paddingVertical: spacing.lg,
    },
    button: {
      width: '100%',
    },
    buttonContent: {
      paddingVertical: spacing.sm,
    },
    buttonLabel: {
      ...typography.button,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [{ translateY }],
              },
            ]}
          >
            <View style={styles.logoWrapper}>
              <Image
                source={
                  isDark
                    ? require('../../../assets/finsh_logo_inverted.png')
                    : require('../../../assets/finsh_logo.png')
                }
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </Animated.View>
          <Text style={styles.title}>Welcome to Finsh</Text>
          <Text style={styles.subtitle}>
            Understand your paycheck, see where your money goes, and make smarter financial decisions from day one.
          </Text>
          <Text style={styles.description}>
            Let's get started by learning a bit about your situation.
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          {onSignUp && onLogIn ? (
            <>
              <Button 
                mode="contained" 
                onPress={onSignUp}
                buttonColor={currentColors.primary}
                textColor={currentColors.surface}
                style={styles.button}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
              >
                Sign Up
              </Button>
              <Button 
                mode="outlined" 
                onPress={onLogIn}
                buttonColor={currentColors.surface}
                textColor={currentColors.primary}
                style={styles.button}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
              >
                Log In
              </Button>
            </>
          ) : (
            <Button 
              mode="contained" 
              onPress={onNext}
              buttonColor={currentColors.primary}
              textColor={currentColors.surface}
              style={styles.button}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              Let's get started
            </Button>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
