import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { UserProvider } from './src/context/UserContext';
import { OnboardingProvider } from './src/context/OnboardingContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { paperTheme } from './src/theme/paperTheme';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={paperTheme}>
        <UserProvider>
          <OnboardingProvider>
            <StatusBar style="auto" />
            <AppNavigator />
          </OnboardingProvider>
        </UserProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
