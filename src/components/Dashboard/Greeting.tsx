import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface GreetingProps {
  name?: string;
}

export function Greeting({ name }: GreetingProps) {
  const greeting = name ? `Hi ${name}` : 'Hi there';
  
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>{greeting}, here's your first paycheck snapshot</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  greeting: {
    ...typography.h2,
    color: colors.text,
  },
});
