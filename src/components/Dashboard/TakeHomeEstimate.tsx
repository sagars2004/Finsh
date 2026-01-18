import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { formatCurrency } from '../../utils/formatters';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface TakeHomeEstimateProps {
  takeHomePay: number;
  payFrequency: string;
}

export function TakeHomeEstimate({ takeHomePay, payFrequency }: TakeHomeEstimateProps) {
  const { currentColors } = useTheme();

  const styles = StyleSheet.create({
    card: {
      marginBottom: spacing.lg,
      backgroundColor: currentColors.surface,
      borderRadius: 12,
    },
    cardContent: {
      padding: spacing.lg,
    },
    label: {
      ...typography.bodySmall,
      color: currentColors.textSecondary,
      marginBottom: spacing.xs,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      fontWeight: '600',
    },
    amount: {
      ...typography.h1,
      color: currentColors.primary,
      marginBottom: spacing.xs,
      fontWeight: '700',
    },
    frequency: {
      ...typography.body,
      color: currentColors.textSecondary,
      marginBottom: spacing.md,
    },
    noteContainer: {
      marginTop: spacing.sm,
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: currentColors.borderLight,
    },
    note: {
      ...typography.caption,
      color: currentColors.textTertiary,
      fontStyle: 'italic',
      lineHeight: 18,
    },
  });

  return (
    <Card style={styles.card} elevation={2}>
      <Card.Content style={styles.cardContent}>
        <Text style={styles.label}>Take-Home Pay</Text>
        <Text style={styles.amount}>{formatCurrency(takeHomePay)}</Text>
        <Text style={styles.frequency}>Per {payFrequency.toLowerCase()}</Text>
        <View style={styles.noteContainer}>
          <Text style={styles.note}>
            💡 This is an estimate. Your actual take-home may vary based on your specific deductions.
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}
