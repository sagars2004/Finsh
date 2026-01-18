import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '../shared/Button';
import { spacing } from '../../theme/spacing';

interface ActionButtonsProps {
  onViewTradeoffs: () => void;
  onViewBreakdown: () => void;
}

export function ActionButtons({ onViewTradeoffs, onViewBreakdown }: ActionButtonsProps) {
  return (
    <View style={styles.container}>
      <Button
        title="View Tradeoff Cards"
        onPress={onViewTradeoffs}
        style={styles.button}
      />
      <Button
        title="View Paycheck Breakdown"
        onPress={onViewBreakdown}
        variant="secondary"
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  button: {
    width: '100%',
  },
});
