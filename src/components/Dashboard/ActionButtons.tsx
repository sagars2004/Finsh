import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
      gap: spacing.sm,
    },
    button: {
      width: '100%',
      borderRadius: 24,
      borderWidth: 3,
      borderColor: currentColors.borderLight,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    buttonContent: {
      paddingVertical: spacing.md,
      minHeight: spacing.touchTarget,
    },
    buttonLabel: {
      ...typography.button,
      fontSize: 19,
    },
  });

  const TradeoffIcon = ({ color }: { color: string }) => (
    <MaterialCommunityIcons name="scale-balance" size={24} color={color} />
  );

  const BreakdownIcon = ({ color }: { color: string }) => (
    <MaterialCommunityIcons name="calculator" size={24} color={color} />
  );

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={onViewBreakdown}
        buttonColor={currentColors.surface}
        textColor={isDark ? '#FFF' : '#000'}
        style={styles.button}
        contentStyle={styles.buttonContent}
        icon={({ color }) => <BreakdownIcon color={color} />}
      >
        <Text
          style={[styles.buttonLabel, { color: isDark ? '#FFF' : '#000' }]}
          adjustsFontSizeToFit
          numberOfLines={1}
        >
          View Paycheck Breakdown
        </Text>
      </Button>
      <Button
        mode="contained"
        onPress={onViewTradeoffs}
        buttonColor={currentColors.surface}
        textColor={isDark ? '#FFF' : '#000'}
        style={styles.button}
        contentStyle={styles.buttonContent}
        icon={({ color }) => <TradeoffIcon color={color} />}
      >
        <Text
          style={[styles.buttonLabel, { color: isDark ? '#FFF' : '#000' }]}
          adjustsFontSizeToFit
          numberOfLines={1}
        >
          View Tradeoff Cards
        </Text>
      </Button>
    </View>
  );
}
