import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTheme } from '../constants/ThemeContext';

import AuthNavigator from './AuthNavigator';
import MainAppNavigator from './MainAppNavigator';
import { useAuth } from '../redux/AuthContext';
import { useData } from '../redux/DataContext';
import SplashScreenNative from 'react-native-splash-screen';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { preloadData } = useData();
  const { theme, isDark, isThemeLoading } = useTheme();
  const [splashTimerDone, setSplashTimerDone] = useState(false);

  // Start splash timer immediately on mount
  useEffect(() => {
    // Ensure the splash screen is shown for at least 1.5 seconds (matches slider duration)
    const timer = setTimeout(() => {
      setSplashTimerDone(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Start data preloading after splash finishes to show shimmer effect
  useEffect(() => {
    if (splashTimerDone) {
      preloadData();
    }
  }, [splashTimerDone, preloadData]);

  // App is ready to be shown only when:
  // 1. The 1.5s splash timer has completed
  // 2. Fundamental systems (auth/theme) have finished loading
  const appReadyToShow = splashTimerDone && !authLoading && !isThemeLoading;

  useEffect(() => {
    if (appReadyToShow) {
      // Small delay ensures the first frame of the app is rendered 
      // before hiding the native splash to avoid a black flicker
      const timer = setTimeout(() => {
        SplashScreenNative.hide();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [appReadyToShow]);

  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: theme.colors.background,
      card: theme.colors.card,
      text: theme.colors.text,
      border: theme.colors.border,
      primary: theme.colors.primary,
    },
  };

  // Keep returning null while wait conditions aren't met to keep native splash visible
  if (!appReadyToShow) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator 
          screenOptions={{ 
            headerShown: false,
            animation: 'fade',
            contentStyle: { backgroundColor: theme.colors.background }
          }}
        >
          {isAuthenticated ? (
            <Stack.Screen name="Main" component={MainAppNavigator} />
          ) : (
            <Stack.Screen name="Auth" component={AuthNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default AppNavigation;
