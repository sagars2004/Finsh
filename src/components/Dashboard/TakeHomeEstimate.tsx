import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../shared/Card';
import { formatCurrency } from '../../utils/formatters';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface TakeHomeEstimateProps {
  takeHomePay: number;
  payFrequency: string;
}

export function TakeHomeEstimate({ takeHomePay, payFrequency }: TakeHomeEstimateProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.label}>Take-Home Pay</Text>
      <Text style={styles.amount}>{formatCurrency(takeHomePay)}</Text>
      <Text style={styles.frequency}>Per {payFrequency}</Text>
      <Text style={styles.note}>
        This is an estimate. Your actual take-home may vary based on your specific deductions.
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  amount: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  frequency: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  note: {
    ...typography.caption,
    color: colors.textTertiary,
    fontStyle: 'italic',
  },
});
