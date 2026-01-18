import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext';
import { TradeoffOption } from '../../types/tradeoff';
import { formatCurrency, formatMonthlyCurrency } from '../../utils/formatters';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface TradeoffCardProps {
  title: string;
  optionA: TradeoffOption;
  optionB: TradeoffOption;
}

export function TradeoffCard({ title, optionA, optionB }: TradeoffCardProps) {
  const { currentColors } = useTheme();

  const renderOption = (option: TradeoffOption, isOptionA: boolean) => (
    <View
      style={[
        {
          padding: spacing.md,
          borderRadius: 8,
          backgroundColor: isOptionA ? currentColors.tradeoffOptionA : currentColors.tradeoffOptionB,
        },
      ]}
    >
      <Text
        style={{
          ...typography.h4,
          color: currentColors.text,
          marginBottom: spacing.xs,
        }}
      >
        {option.title}
      </Text>
      {option.description && (
        <Text
          style={{
            ...typography.bodySmall,
            color: currentColors.textSecondary,
            marginBottom: spacing.sm,
            fontStyle: 'italic',
          }}
        >
          {option.description}
        </Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.md,
          paddingVertical: spacing.sm,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: currentColors.borderLight,
        }}
      >
        <Text
          style={{
            ...typography.bodySmall,
            color: currentColors.textSecondary,
            fontWeight: '500',
          }}
        >
          Monthly Impact:
        </Text>
        <Text
          style={[
            {
              ...typography.h4,
              fontWeight: '700',
            },
            option.monthlyImpact >= 0
              ? { color: currentColors.success }
              : { color: currentColors.error },
          ]}
        >
          {option.monthlyImpact >= 0 ? '+' : ''}
          {formatMonthlyCurrency(option.monthlyImpact)}
        </Text>
      </View>
      <View style={{ gap: spacing.sm }}>
        <View style={{ marginBottom: spacing.sm }}>
          <Text
            style={{
              ...typography.bodySmall,
              color: currentColors.text,
              fontWeight: '600',
              marginBottom: spacing.xs,
            }}
          >
            Pros:
          </Text>
          {option.pros.map((pro, index) => (
            <Text
              key={index}
              style={{
                ...typography.bodySmall,
                color: currentColors.textSecondary,
                marginLeft: spacing.sm,
                marginBottom: spacing.xs,
              }}
            >
              • {pro}
            </Text>
          ))}
        </View>
        <View>
          <Text
            style={{
              ...typography.bodySmall,
              color: currentColors.text,
              fontWeight: '600',
              marginBottom: spacing.xs,
            }}
          >
            Cons:
          </Text>
          {option.cons.map((con, index) => (
            <Text
              key={index}
              style={{
                ...typography.bodySmall,
                color: currentColors.textSecondary,
                marginLeft: spacing.sm,
                marginBottom: spacing.xs,
              }}
            >
              • {con}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <Card style={{ marginBottom: spacing.lg, backgroundColor: currentColors.surface }}>
      <Card.Content>
        <Text
          style={{
            ...typography.h3,
            color: currentColors.text,
            marginBottom: spacing.md,
            textAlign: 'center',
          }}
        >
          {title}
        </Text>
        <View style={{ gap: spacing.md }}>
          {renderOption(optionA, true)}
          <View
            style={{
              height: 1,
              backgroundColor: currentColors.border,
              marginVertical: spacing.sm,
            }}
          />
          {renderOption(optionB, false)}
        </View>
      </Card.Content>
    </Card>
  );
}
