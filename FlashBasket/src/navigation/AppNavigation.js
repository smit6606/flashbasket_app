import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import AuthNavigator from './AuthNavigator';
import MainAppNavigator from './MainAppNavigator';
import { useAuth } from '../redux/AuthContext';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  const { isAuthenticated, loading } = useAuth();

  console.log('[AppNavigation] State:', { isAuthenticated, loading });


  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ headerShown: false }}
      >
        {loading ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : !isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <Stack.Screen name="Main" component={MainAppNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
