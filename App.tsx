import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserProvider } from './src/context/UserContext';
import { OnboardingProvider } from './src/context/OnboardingContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <OnboardingProvider>
          <StatusBar style="auto" />
          <AppNavigator />
        </OnboardingProvider>
      </UserProvider>
    </GestureHandlerRootView>
  );
}
