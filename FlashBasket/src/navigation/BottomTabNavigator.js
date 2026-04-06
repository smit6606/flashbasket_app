import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../constants/ThemeContext';

import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import BuyAgainScreen from '../screens/BuyAgainScreen';
import FreshScreen from '../screens/FreshScreen';


const Tab = createBottomTabNavigator();

// Extracted Icon components to avoid unstable nested component warning
const TabIcon = ({ name, color, size }) => (
  <Icon name={name} color={color} size={size} />
);

const BottomTabNavigator = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 8,
          display: ['Fresh', 'BuyAgain'].includes(route.name) ? 'none' : 'flex',

        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: (props) => <TabIcon name="home-outline" {...props} />,
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          tabBarIcon: (props) => <TabIcon name="view-dashboard-outline" {...props} />,
        }}
      />
      <Tab.Screen
        name="BuyAgain"
        component={BuyAgainScreen}
        options={{
          tabBarIcon: (props) => <TabIcon name="history" {...props} />,
        }}
      />
      <Tab.Screen
        name="Fresh"
        component={FreshScreen}
        options={{
          tabBarIcon: (props) => <TabIcon name="leaf" {...props} />,
        }}
      />

    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
