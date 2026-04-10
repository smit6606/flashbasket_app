import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../constants/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../redux/UserContext';

const AppHeader = memo(({ onLocationPress }) => {
  const { theme, isDark } = useTheme();
  const { selectedAddress, wallet } = useUser();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { backgroundColor: isDark ? theme.colors.background : theme.colors.background }]}>
      <TouchableOpacity 
        style={styles.leftSection}
        onPress={onLocationPress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        activeOpacity={0.6}
      >
        <View style={styles.deliveryRow}>
          <MIcon name="lightning-bolt" size={24} color={isDark ? theme.colors.primary : "#000"} />
          <Text style={[styles.deliveryTimeText, { color: theme.colors.text }]}>5 minutes</Text>
        </View>
        <View style={styles.locationRow}>
          <Text style={[styles.locationText, { color: theme.colors.textSecondary }]} numberOfLines={1}>
            {selectedAddress ? `${selectedAddress.name || 'Home'} - ${selectedAddress.fullAddress || ''}` : 'Select Location'}
          </Text>
          <MIcon name="chevron-down" size={18} color={theme.colors.textSecondary} />
        </View>
      </TouchableOpacity>

      <View style={styles.rightSection}>
        <TouchableOpacity 
          style={[styles.walletButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: isDark ? 1 : 0 }]}
          onPress={() => navigation.navigate('WalletScreen')}
          activeOpacity={0.7}
        >
          <View style={styles.walletIconContainer}>
            <MIcon name="wallet" size={18} color="#fff" />
          </View>
          <Text style={[styles.walletAmount, { color: theme.colors.text }]}>₹{wallet.balance.toFixed(0)}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.7}
        >
          <MIcon name="account-circle" size={32} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

AppHeader.displayName = 'AppHeader';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  leftSection: {
    flex: 1,
    marginRight: 10,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deliveryTimeText: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: -2,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '600',
    maxWidth: '85%',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  walletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  walletIconContainer: {
    backgroundColor: '#6c5ce7',
    padding: 4,
    borderRadius: 6,
    marginRight: 6,
  },
  walletAmount: {
    fontWeight: '900',
    fontSize: 15,
  },
  profileButton: {
    padding: 2,
  },
});

export default AppHeader;
