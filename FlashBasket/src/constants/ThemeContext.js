import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from './theme';

const THEME_STORAGE_KEY = '@flashbasket_theme_preference';

const ThemeContext = createContext({
  theme: theme.light,
  isDark: false,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredTheme();
  }, []);

  const loadStoredTheme = async () => {
    try {
      const storedPreference = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (storedPreference !== null) {
        setIsDark(storedPreference === 'dark');
      } else {
        // Fallback to light as requested (First time user = Light)
        setIsDark(false);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = async () => {
    try {
      const newIsDark = !isDark;
      setIsDark(newIsDark);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newIsDark ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const value = useMemo(() => {
    return {
      theme: isDark ? theme.dark : theme.light,
      isDark,
      toggleTheme,
    };
  }, [isDark]);

  // if (loading) return null; // Removed to prevent permanent black screen if storage hangs. Theme will default and then update.

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
