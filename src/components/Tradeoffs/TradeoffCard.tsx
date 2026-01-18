import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../shared/Card';
import { TradeoffOption } from '../../types/tradeoff';
import { formatCurrency, formatMonthlyCurrency } from '../../utils/formatters';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface TradeoffCardProps {
  title: string;
  optionA: TradeoffOption;
  optionB: TradeoffOption;
}

export function TradeoffCard({ title, optionA, optionB }: TradeoffCardProps) {
  const renderOption = (option: TradeoffOption, isOptionA: boolean) => (
    <View
      style={[
        styles.optionContainer,
        isOptionA ? styles.optionAContainer : styles.optionBContainer,
      ]}
    >
      <Text style={styles.optionTitle}>{option.title}</Text>
      {option.description && (
        <Text style={styles.optionDescription}>{option.description}</Text>
      )}
      <View style={styles.impactContainer}>
        <Text style={styles.impactLabel}>Monthly Impact:</Text>
        <Text
          style={[
            styles.impactValue,
            option.monthlyImpact >= 0 ? styles.impactPositive : styles.impactNegative,
          ]}
        >
          {option.monthlyImpact >= 0 ? '+' : ''}
          {formatMonthlyCurrency(option.monthlyImpact)}
        </Text>
      </View>
      <View style={styles.prosConsContainer}>
        <View style={styles.prosContainer}>
          <Text style={styles.prosConsTitle}>Pros:</Text>
          {option.pros.map((pro, index) => (
            <Text key={index} style={styles.prosConsItem}>
              • {pro}
            </Text>
          ))}
        </View>
        <View style={styles.consContainer}>
          <Text style={styles.prosConsTitle}>Cons:</Text>
          {option.cons.map((con, index) => (
            <Text key={index} style={styles.prosConsItem}>
              • {con}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <Card style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.optionsContainer}>
        {renderOption(optionA, true)}
        <View style={styles.divider} />
        {renderOption(optionB, false)}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: spacing.md,
  },
  optionContainer: {
    padding: spacing.md,
    borderRadius: 8,
  },
  optionAContainer: {
    backgroundColor: colors.tradeoffOptionA,
  },
  optionBContainer: {
    backgroundColor: colors.tradeoffOptionB,
  },
  optionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  optionDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    fontStyle: 'italic',
  },
  impactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.borderLight,
  },
  impactLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  impactValue: {
    ...typography.h4,
    fontWeight: '700',
  },
  impactPositive: {
    color: colors.success,
  },
  impactNegative: {
    color: colors.error,
  },
  prosConsContainer: {
    gap: spacing.sm,
  },
  prosContainer: {
    marginBottom: spacing.sm,
  },
  consContainer: {},
  prosConsTitle: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  prosConsItem: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    marginBottom: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
});
