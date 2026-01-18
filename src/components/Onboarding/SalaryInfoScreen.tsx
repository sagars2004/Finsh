import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, TextInput } from 'react-native-paper';
import { Picker } from '../shared/Picker';
import { Footer } from '../shared/Footer';
import { ProgressIndicator } from './ProgressIndicator';
import { useOnboarding } from '../../context/OnboardingContext';
import { PayFrequency } from '../../types/user';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface SalaryInfoScreenProps {
  onNext: () => void;
  onBack: () => void;
  navigation?: any;
}

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming',
];

const INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Consulting',
  'Marketing',
  'Retail',
  'Manufacturing',
  'Non-profit',
  'Government',
  'Other',
];

const EXPERIENCE_LEVELS = [
  { label: 'Entry Level (0-1 years)', value: '0-1' },
  { label: 'Early Career (2-3 years)', value: '2-3' },
  { label: 'Mid-Level (4-6 years)', value: '4-6' },
  { label: 'Senior (7+ years)', value: '7+' },
];

export function SalaryInfoScreen({ onNext, onBack, navigation }: SalaryInfoScreenProps) {
  const { onboardingData, updateSalary } = useOnboarding();
  const { currentColors } = useTheme();
  const [hourlyRate, setHourlyRate] = useState(
    onboardingData.salary.annualSalary ? (onboardingData.salary.annualSalary / 2080).toFixed(2) : ''
  );
  const [hoursPerWeek, setHoursPerWeek] = useState('40');
  const [payFrequency, setPayFrequency] = useState<PayFrequency>(
    onboardingData.salary.payFrequency || 'monthly'
  );
  const [state, setState] = useState(onboardingData.salary.state || '');
  const [city, setCity] = useState('');
  const [industry, setIndustry] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [error, setError] = useState('');

  // Reset local state when onboarding context is cleared
  useEffect(() => {
    if (!onboardingData.salary.annualSalary && !onboardingData.salary.state) {
      setHourlyRate('');
      setHoursPerWeek('40');
      setPayFrequency('monthly');
      setState('');
      setCity('');
      setIndustry('');
      setExperienceLevel('');
      setError('');
    }
  }, [onboardingData.salary]);

  const handleNext = () => {
    const hourlyNum = parseFloat(hourlyRate.replace(/[^0-9.]/g, ''));
    const hoursNum = parseFloat(hoursPerWeek.replace(/[^0-9.]/g, '')) || 40;
    
    if (!hourlyRate || isNaN(hourlyNum) || hourlyNum <= 0) {
      setError('Please enter a valid hourly rate');
      return;
    }

    if (!state) {
      setError('Please select your state');
      return;
    }

    // Calculate annual salary from hourly rate
    const annualSalary = hourlyNum * hoursNum * 52; // hourly rate * hours/week * 52 weeks

    updateSalary({
      annualSalary,
      payFrequency,
      state,
    });

    onNext();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentColors.background,
    },
    scrollContent: {
      flexGrow: 1,
      padding: spacing.lg,
    },
    content: {
      flex: 1,
    },
    title: {
      ...typography.h2,
      color: currentColors.text,
      marginBottom: spacing.sm,
    },
    subtitle: {
      ...typography.body,
      color: currentColors.textSecondary,
      marginBottom: spacing.xl,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: spacing.md,
      paddingVertical: spacing.lg,
    },
    backButton: {
      flex: 1,
    },
    button: {
      flex: 1,
    },
    buttonContent: {
      paddingVertical: spacing.sm,
    },
    input: {
      marginBottom: spacing.md,
    },
    errorText: {
      ...typography.caption,
      color: currentColors.error,
      marginTop: spacing.xs * -1,
      marginBottom: spacing.md,
      marginLeft: spacing.sm,
    },
    footerContainer: {
      backgroundColor: currentColors.surface,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ProgressIndicator currentStep={2} totalSteps={4} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Tell us about your work</Text>
          <Text style={styles.subtitle}>
            We'll use this to calculate your take-home pay and show you personalized insights.
          </Text>

          <TextInput
            label="Hourly Rate"
            placeholder="$25.00"
            mode="outlined"
            keyboardType="numeric"
            value={hourlyRate}
            onChangeText={(text) => {
              setHourlyRate(text);
              setError('');
            }}
            error={!!error && !hourlyRate}
            style={styles.input}
          />

          <TextInput
            label="Hours Per Week (optional)"
            placeholder="40"
            mode="outlined"
            keyboardType="numeric"
            value={hoursPerWeek}
            onChangeText={setHoursPerWeek}
            style={styles.input}
          />

          <Picker
            label="Industry"
            selectedValue={industry}
            onValueChange={setIndustry}
            items={[
              { label: 'Select your industry', value: '' },
              ...INDUSTRIES.map((ind) => ({ label: ind, value: ind })),
            ]}
            placeholder="Select your industry"
          />

          <Picker
            label="Years of Experience"
            selectedValue={experienceLevel}
            onValueChange={setExperienceLevel}
            items={[
              { label: 'Select experience level', value: '' },
              ...EXPERIENCE_LEVELS.map((exp) => ({ label: exp.label, value: exp.value })),
            ]}
            placeholder="Select experience level"
          />

          <TextInput
            label="City (optional)"
            placeholder="San Francisco"
            mode="outlined"
            value={city}
            onChangeText={setCity}
            style={styles.input}
            autoCapitalize="words"
          />

          <Picker
            label="State"
            selectedValue={state}
            onValueChange={(value) => {
              setState(value);
              setError('');
            }}
            items={[
              { label: 'Select your state', value: '' },
              ...US_STATES.map((s) => ({ label: s, value: s })),
            ]}
            placeholder="Select your state"
            error={error && !state ? error : undefined}
          />

          <Picker
            label="Pay Frequency"
            selectedValue={payFrequency}
            onValueChange={(value) => setPayFrequency(value as PayFrequency)}
            items={[
              { label: 'Monthly', value: 'monthly' },
              { label: 'Semi-Monthly', value: 'semimonthly' },
              { label: 'Bi-Weekly', value: 'biweekly' },
              { label: 'Weekly', value: 'weekly' },
            ]}
            placeholder="Select pay frequency"
          />

          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={onBack}
            buttonColor={currentColors.surface}
            textColor={currentColors.primary}
            style={[styles.backButton, styles.button]}
            contentStyle={styles.buttonContent}
          >
            Back
          </Button>
          <Button
            mode="contained"
            onPress={handleNext}
            buttonColor={currentColors.primary}
            textColor={currentColors.surface}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Next
          </Button>
        </View>
      </ScrollView>
      <SafeAreaView edges={['bottom']} style={styles.footerContainer}>
        <Footer navigation={navigation} />
      </SafeAreaView>
    </SafeAreaView>
  );
}
