import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../constants/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../redux/UserContext';
import { useAuth } from '../redux/AuthContext';



const AppHeader = ({ onLocationPress }) => {
  const { theme } = useTheme();
  const { selectedAddress, wallet } = useUser();
  const { user } = useAuth();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TouchableOpacity 
        style={styles.leftSection}
        onPress={onLocationPress}
      >
        <Text style={[styles.deliveryTitle, { color: theme.colors.textSecondary }]}>Delivery in 10 mins</Text>
        <View style={styles.locationContainer}>
          <Text style={[styles.locationText, { color: theme.colors.text }]} numberOfLines={1}>
            {selectedAddress ? `${selectedAddress.title || selectedAddress.name} - ${selectedAddress.city}` : 'Select Location'}
          </Text>
          <Icon name="chevron-down" size={20} color={theme.colors.text} />
        </View>
      </TouchableOpacity>

      <View style={styles.rightSection}>
        <TouchableOpacity 
          style={styles.iconOnlyButton}
          onPress={() => navigation.navigate('FavoritesScreen')}
        >
          <Icon name="heart-outline" size={26} color={theme.colors.text} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.iconButton, { backgroundColor: theme.colors.surface }]}
          onPress={() => navigation.navigate('WalletScreen')}
        >
          <Icon name="wallet-outline" size={22} color={theme.colors.text} />
          <Text style={[styles.walletAmount, { color: theme.colors.text }]}>₹{wallet.balance.toFixed(0)}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Icon name="account-circle-outline" size={32} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  leftSection: {
    flex: 1,
    marginRight: 10,
  },
  deliveryTitle: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 2,
    maxWidth: '85%',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconOnlyButton: {
    padding: 8,
    marginRight: 4,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  walletAmount: {
    marginLeft: 4,
    fontWeight: 'bold',
    fontSize: 13,
  },
  profileButton: {
    padding: 2,
  },
});

export default AppHeader;
