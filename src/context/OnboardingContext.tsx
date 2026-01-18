import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SalaryInput, ExpenseContext } from '../types/user';

interface OnboardingData {
  name?: string;
  salary: Partial<SalaryInput>;
  expenses: Partial<ExpenseContext>;
  currentStep: number;
}

interface OnboardingContextType {
  onboardingData: OnboardingData;
  updateName: (name: string) => void;
  updateSalary: (salary: Partial<SalaryInput>) => void;
  updateExpenses: (expenses: Partial<ExpenseContext>) => void;
  setCurrentStep: (step: number) => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const initialData: OnboardingData = {
  name: undefined,
  salary: {},
  expenses: {},
  currentStep: 1,
};

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(initialData);

  const updateName = (name: string) => {
    setOnboardingData((prev) => ({ ...prev, name: name.trim() || undefined }));
  };

  const updateSalary = (salary: Partial<SalaryInput>) => {
    setOnboardingData((prev) => ({
      ...prev,
      salary: { ...prev.salary, ...salary },
    }));
  };

  const updateExpenses = (expenses: Partial<ExpenseContext>) => {
    setOnboardingData((prev) => ({
      ...prev,
      expenses: { ...prev.expenses, ...expenses },
    }));
  };

  const setCurrentStep = (step: number) => {
    setOnboardingData((prev) => ({ ...prev, currentStep: step }));
  };

  const resetOnboarding = () => {
    setOnboardingData(initialData);
  };

  return (
    <OnboardingContext.Provider
      value={{
        onboardingData,
        updateName,
        updateSalary,
        updateExpenses,
        setCurrentStep,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
