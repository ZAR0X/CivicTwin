import React, { useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import LoginScreen from '@/components/LoginScreen';
import { AppProvider } from '@/context/AppContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AppProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        {isLoggedIn ? (
          <AppTabs />
        ) : (
          <LoginScreen onLoginSuccess={() => setIsLoggedIn(true)} />
        )}
      </ThemeProvider>
    </AppProvider>
  );
}
