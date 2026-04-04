import React from 'react';
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

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
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
