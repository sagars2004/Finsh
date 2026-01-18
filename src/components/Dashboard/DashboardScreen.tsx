import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Greeting } from './Greeting';
import { TakeHomeEstimate } from './TakeHomeEstimate';
import { ActionButtons } from './ActionButtons';
import { useUser } from '../../context/UserContext';
import { estimateTakeHome, annualizeTakeHome } from '../../services/calculations/paycheck';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface DashboardScreenProps {
  onViewTradeoffs: () => void;
  onViewBreakdown: () => void;
}

export function DashboardScreen({ onViewTradeoffs, onViewBreakdown }: DashboardScreenProps) {
  const { userData } = useUser();

  const paycheckData = useMemo(() => {
    if (!userData?.salary) return null;
    return estimateTakeHome(userData.salary);
  }, [userData]);

  const payFrequencyLabel = userData?.salary?.payFrequency
    ? userData.salary.payFrequency.charAt(0).toUpperCase() +
      userData.salary.payFrequency.slice(1).replace(/([A-Z])/g, ' $1')
    : 'paycheck';

  if (!userData || !paycheckData) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Please complete onboarding first</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Greeting name={userData.name} />
        <TakeHomeEstimate
          takeHomePay={paycheckData.takeHomePay}
          payFrequency={payFrequencyLabel}
        />
        <ActionButtons
          onViewTradeoffs={onViewTradeoffs}
          onViewBreakdown={onViewBreakdown}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  errorText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
