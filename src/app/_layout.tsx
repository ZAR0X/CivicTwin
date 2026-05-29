import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import LoginScreen from '@/components/LoginScreen';
import { AppProvider, useApp } from '@/context/AppContext';

function AppContent() {
  const colorScheme = useColorScheme();
  const { isLoggedIn, login } = useApp();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      {isLoggedIn ? (
        <AppTabs />
      ) : (
        <LoginScreen onLoginSuccess={login} />
      )}
    </ThemeProvider>
  );
}

export default function TabLayout() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
