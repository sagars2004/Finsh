import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card } from 'react-native-paper';
import { Footer } from '../shared/Footer';
import { ProgressIndicator } from './ProgressIndicator';
import { useOnboarding } from '../../context/OnboardingContext';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency } from '../../utils/formatters';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface ConfirmationScreenProps {
  onComplete: () => void;
  onBack: () => void;
  navigation?: any;
}

export function ConfirmationScreen({ onComplete, onBack, navigation }: ConfirmationScreenProps) {
  const { onboardingData } = useOnboarding();
  const { setUserData } = useUser();
  const { currentColors } = useTheme();

  const handleComplete = async () => {
    // Combine onboarding data into UserData
    if (
      onboardingData.salary.annualSalary &&
      onboardingData.salary.payFrequency &&
      onboardingData.salary.state &&
      onboardingData.expenses.livingSituation
    ) {
      await setUserData({
        name: onboardingData.name,
        salary: {
          annualSalary: onboardingData.salary.annualSalary,
          payFrequency: onboardingData.salary.payFrequency,
          state: onboardingData.salary.state,
        },
        expenses: {
          livingSituation: onboardingData.expenses.livingSituation,
          majorExpenses: onboardingData.expenses.majorExpenses,
          goals: onboardingData.expenses.goals,
        },
        onboardingComplete: true,
      });

      onComplete();
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
    },
    iconContainer: {
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    icon: {
      fontSize: 64,
    },
    title: {
      ...typography.h2,
      color: currentColors.text,
      textAlign: 'center',
      marginBottom: spacing.sm,
    },
    subtitle: {
      ...typography.body,
      color: currentColors.textSecondary,
      textAlign: 'center',
      marginBottom: spacing.xl,
    },
    summaryCard: {
      marginBottom: spacing.xl,
      backgroundColor: currentColors.surface,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: currentColors.borderLight,
    },
    summaryLabel: {
      ...typography.body,
      color: currentColors.textSecondary,
    },
    summaryValue: {
      ...typography.body,
      color: currentColors.text,
      fontWeight: '600',
    },
    message: {
      ...typography.body,
      color: currentColors.textSecondary,
      textAlign: 'center',
      fontStyle: 'italic',
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: spacing.md,
      paddingVertical: spacing.lg,
    },
    backButton: {
      flex: 1,
    },
    button: {
      flex: 1,
    },
    buttonContent: {
      paddingVertical: spacing.sm,
    },
    footerContainer: {
      backgroundColor: currentColors.surface,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ProgressIndicator currentStep={4} totalSteps={4} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>✅</Text>
          </View>
          <Text style={styles.title}>You're all set!</Text>
          <Text style={styles.subtitle}>
            Here's a summary of what you've shared:
          </Text>

          <Card style={styles.summaryCard}>
            <Card.Content>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Annual Salary:</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(onboardingData.salary.annualSalary || 0)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Pay Frequency:</Text>
                <Text style={styles.summaryValue}>
                  {onboardingData.salary.payFrequency
                    ? onboardingData.salary.payFrequency.charAt(0).toUpperCase() +
                      onboardingData.salary.payFrequency.slice(1).replace(/([A-Z])/g, ' $1')
                    : 'Not set'}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>State:</Text>
                <Text style={styles.summaryValue}>{onboardingData.salary.state || 'Not set'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Living Situation:</Text>
                <Text style={styles.summaryValue}>
                  {onboardingData.expenses.livingSituation
                    ? onboardingData.expenses.livingSituation.charAt(0).toUpperCase() +
                      onboardingData.expenses.livingSituation.slice(1)
                    : 'Not set'}
                </Text>
              </View>
            </Card.Content>
          </Card>

          <Text style={styles.message}>
            Ready to see your first paycheck breakdown? Let's go!
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={onBack}
            buttonColor={currentColors.surface}
            textColor={currentColors.primary}
            style={[styles.backButton, styles.button]}
            contentStyle={styles.buttonContent}
          >
            Back
          </Button>
          <Button
            mode="contained"
            onPress={handleComplete}
            buttonColor={currentColors.primary}
            textColor={currentColors.surface}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Go to Dashboard
          </Button>
        </View>
      </ScrollView>
      <SafeAreaView edges={['bottom']} style={styles.footerContainer}>
        <Footer navigation={navigation} />
      </SafeAreaView>
    </SafeAreaView>
  );
}
