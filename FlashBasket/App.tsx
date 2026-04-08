import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, initialWindowMetrics as initialMetrics } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/constants/ThemeContext';
import { AuthProvider } from './src/redux/AuthContext';
import { UserProvider } from './src/redux/UserContext';
import { CartProvider } from './src/redux/CartContext';
import { FavoritesProvider } from './src/constants/FavoritesContext';
import { RecentlyViewedProvider } from './src/constants/RecentlyViewedContext';
import AppNavigation from './src/navigation/AppNavigation';
import SplashScreen from 'react-native-splash-screen';

import { StripeProvider } from '@stripe/stripe-react-native';
import APP_CONFIG from './src/config';

const App = () => {
  useEffect(() => {
    console.log('[App] Initializing...');
    
    // Hide native splash screen after a small delay to ensure JS is ready
    const timer = setTimeout(() => {
      try {
        console.log('[App] Hiding native splash screen...');
        SplashScreen.hide();
      } catch (e) {
        console.warn('[App] Failed to hide splash screen:', e);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);


  return (

    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StripeProvider publishableKey={APP_CONFIG.STRIPE_PUBLISHABLE_KEY}>
          <ThemeProvider>
            <AuthProvider>
              <UserProvider>
                <CartProvider>
                  <FavoritesProvider>
                    <RecentlyViewedProvider>
                      <AppNavigation />
                    </RecentlyViewedProvider>
                  </FavoritesProvider>
                </CartProvider>
              </UserProvider>
            </AuthProvider>
          </ThemeProvider>
        </StripeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
