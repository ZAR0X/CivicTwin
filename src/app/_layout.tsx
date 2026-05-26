import React, { useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme, Platform } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import LoginScreen from '@/components/LoginScreen';
import { AppProvider } from '@/context/AppContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (Platform.OS === 'web') {
      try {
        if (__DEV__) return true;
        return localStorage.getItem('civictwin_logged_in') === 'true';
      } catch (e) {
        return false;
      }
    }
    return false;
  });

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem('civictwin_logged_in', 'true');
      } catch (e) {}
    }
  };

  return (
    <AppProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        {isLoggedIn ? (
          <AppTabs />
        ) : (
          <LoginScreen onLoginSuccess={handleLoginSuccess} />
        )}
      </ThemeProvider>
    </AppProvider>
  );
}
