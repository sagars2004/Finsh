import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Card } from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency } from '../../utils/formatters';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface BreakdownSectionProps {
  label: string;
  amount: number;
  description?: string;
  variant?: 'default' | 'primary' | 'emphasis';
}

export function BreakdownSection({
  label,
  amount,
  description,
  variant = 'default',
}: BreakdownSectionProps) {
  const { currentColors } = useTheme();

  const getVariantStyles = (): { container?: ViewStyle; amount?: TextStyle } => {
    switch (variant) {
      case 'primary':
        return {
          container: {
            backgroundColor: currentColors.primaryLight + '10',
            borderWidth: 2,
            borderColor: currentColors.primary,
          },
          amount: {
            color: currentColors.primary,
          },
        };
      case 'emphasis':
        return {
          container: {
            backgroundColor: currentColors.surfaceSecondary,
          },
          amount: {
            ...typography.h3,
            color: currentColors.text,
          },
        };
      default:
        return {};
    }
  };

  const variantStyles = getVariantStyles();

  const cardStyles: ViewStyle[] = [
    {
      marginBottom: spacing.md,
      backgroundColor: currentColors.surface,
    },
  ];
  if (variantStyles.container) {
    cardStyles.push(variantStyles.container as ViewStyle);
  }

  const amountStyles: TextStyle[] = [
    {
      ...typography.h4,
      color: currentColors.text,
    },
  ];
  if (variantStyles.amount) {
    amountStyles.push(variantStyles.amount as TextStyle);
  }

  return (
    <Card style={cardStyles}>
      <Card.Content>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                ...typography.body,
                color: currentColors.text,
                fontWeight: '500',
                marginBottom: spacing.xs,
              }}
            >
              {label}
            </Text>
            {description && (
              <Text
                style={{
                  ...typography.caption,
                  color: currentColors.textSecondary,
                }}
              >
                {description}
              </Text>
            )}
          </View>
          <Text style={amountStyles}>{formatCurrency(amount)}</Text>
        </View>
      </Card.Content>
    </Card>
  );
}
