import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { WelcomeScreen } from '../components/Onboarding/WelcomeScreen';
import { SalaryInfoScreen } from '../components/Onboarding/SalaryInfoScreen';
import { ContextScreen } from '../components/Onboarding/ContextScreen';
import { ConfirmationScreen } from '../components/Onboarding/ConfirmationScreen';
import { DashboardScreen } from '../components/Dashboard/DashboardScreen';
import { TradeoffCardsScreen } from '../components/Tradeoffs/TradeoffCardsScreen';
import { BreakdownScreen } from '../components/PaycheckBreakdown/BreakdownScreen';
import { SettingsScreen } from '../components/Settings/SettingsScreen';
import { AuthScreen } from '../components/Auth/AuthScreen';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';

export type RootStackParamList = {
  Welcome: undefined;
  Auth: undefined;
  SalaryInfo: undefined;
  Context: undefined;
  Confirmation: undefined;
  Dashboard: undefined;
  Tradeoffs: undefined;
  Breakdown: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { userData, isLoading } = useUser();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Determine initial route based on auth and onboarding status
  // Start with Welcome - userData loads asynchronously
  // Navigation will handle routing to Dashboard if user has completed onboarding
  // Ensure onboardingComplete is properly converted to boolean
  const onboardingComplete = userData?.onboardingComplete === true;
  
  // Note: Enable auth flow by checking isAuthenticated
  // For now, keep it disabled to maintain current behavior
  const enableAuth = false; // Set to true when ready to enable auth
  
  const initialRoute: keyof RootStackParamList = 
    enableAuth && !isAuthenticated ? 'Auth' :
    onboardingComplete ? 'Dashboard' : 
    'Welcome';

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#F8F9FA' },
        }}
      >
        <Stack.Screen name="Welcome">
          {(props) => (
            <WelcomeScreen
              {...props}
              onNext={() => props.navigation.navigate('SalaryInfo')}
              onSignUp={() => props.navigation.navigate('Auth')}
              onLogIn={() => props.navigation.navigate('Auth')}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Auth">
          {(props) => (
            <AuthScreen
              {...props}
              onSuccess={() => {
                // After successful auth, go to onboarding or dashboard
                props.navigation.navigate('SalaryInfo');
              }}
              onCancel={() => props.navigation.goBack()}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="SalaryInfo">
          {(props) => (
            <SalaryInfoScreen
              {...props}
              navigation={props.navigation}
              onNext={() => props.navigation.navigate('Context')}
              onBack={() => props.navigation.goBack()}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Context">
          {(props) => (
            <ContextScreen
              {...props}
              navigation={props.navigation}
              onNext={() => props.navigation.navigate('Confirmation')}
              onBack={() => props.navigation.goBack()}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Confirmation">
          {(props) => (
            <ConfirmationScreen
              {...props}
              navigation={props.navigation}
              onComplete={() => props.navigation.reset({
                index: 0,
                routes: [{ name: 'Dashboard' }],
              })}
              onBack={() => props.navigation.goBack()}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Dashboard">
          {(props) => (
            <DashboardScreen
              {...props}
              navigation={props.navigation}
              onViewTradeoffs={() => props.navigation.navigate('Tradeoffs')}
              onViewBreakdown={() => props.navigation.navigate('Breakdown')}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Tradeoffs">
          {(props) => (
            <TradeoffCardsScreen
              {...props}
              navigation={props.navigation}
              onBack={() => props.navigation.goBack()}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Breakdown">
          {(props) => (
            <BreakdownScreen
              {...props}
              navigation={props.navigation}
              onBack={() => props.navigation.goBack()}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Settings">
          {(props) => (
            <SettingsScreen
              {...props}
              navigation={props.navigation}
              onBack={() => props.navigation.goBack()}
              onNavigateToHome={() => {
                props.navigation.reset({
                  index: 0,
                  routes: [{ name: 'Dashboard' }],
                });
              }}
              onNavigateToProfile={() => {
                // TODO: Navigate to profile screen when created
                props.navigation.goBack();
              }}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
