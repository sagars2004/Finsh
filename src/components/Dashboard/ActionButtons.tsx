import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface ActionButtonsProps {
  onViewTradeoffs: () => void;
  onViewBreakdown: () => void;
}

export function ActionButtons({ onViewTradeoffs, onViewBreakdown }: ActionButtonsProps) {
  const { currentColors, isDark } = useTheme();

  const styles = StyleSheet.create({
    container: {
      gap: spacing.md,
    },
    button: {
      width: '100%',
      borderRadius: 8,
    },
    buttonContent: {
      paddingVertical: spacing.md,
      minHeight: spacing.touchTarget,
    },
    buttonLabel: {
      ...typography.button,
    },
  });

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={onViewTradeoffs}
        buttonColor={isDark ? '#E5E5E5' : '#000000'}
        textColor={isDark ? '#000000' : '#FFFFFF'}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
        icon="swap-horizontal"
      >
        View Tradeoff Cards
      </Button>
      <Button
        mode="outlined"
        onPress={onViewBreakdown}
        buttonColor={currentColors.surfaceSecondary}
        textColor={currentColors.text}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
        icon="calculator"
      >
        View Paycheck Breakdown
      </Button>
    </View>
  );
}
