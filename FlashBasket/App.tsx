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
import { DataProvider } from './src/redux/DataContext';
import AppNavigation from './src/navigation/AppNavigation';

import { StripeProvider } from '@stripe/stripe-react-native';
import APP_CONFIG from './src/config';

const App = () => {
  // The native splash screen is kept visible until AppNavigation determines 
  // the auth state and mounts the first real screen for a 'one-screen' experience.
  useEffect(() => {
    // Global initialization logic if any
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
                      <DataProvider>
                        <AppNavigation />
                      </DataProvider>
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
