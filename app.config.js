/**
 * Expo Configuration
 * 
 * This file reads environment variables from .env file
 * Make sure you have a .env file with:
 * - WORKOS_CLIENT_ID=client_xxxxx
 * - EXPO_PUBLIC_API_URL=https://your-api.com
 */

require('dotenv').config();

module.exports = {
  expo: {
    name: 'Finsh',
    slug: 'finsh',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#F8F9FA',
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: 'com.finsh.app',
      buildNumber: '1',
      infoPlist: {
        UIRequiresFullScreen: true,
        NSLocationWhenInUseUsageDescription: 'Finsh uses your location to automatically fill in your city and state for accurate tax calculations.',
        NSLocationAlwaysUsageDescription: 'Finsh uses your location to automatically fill in your city and state for accurate tax calculations.',
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#F8F9FA',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: 'com.finsh.app',
      permissions: [
        'ACCESS_COARSE_LOCATION',
        'ACCESS_FINE_LOCATION',
      ],
    },
    web: {
      favicon: './assets/favicon.png',
    },
    scheme: 'finsh',
    extra: {
      // Read from .env file or use defaults
      workosClientId: process.env.WORKOS_CLIENT_ID || '',
      apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
    },
  },
};
