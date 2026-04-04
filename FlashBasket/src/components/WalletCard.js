import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const WalletCard = ({ balance, theme }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.balanceSection, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.balanceInfo}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Available Balance</Text>
          <Text style={[styles.balance, { color: theme.colors.text }]}>₹{balance.toFixed(2)}</Text>
        </View>
        <View style={[styles.iconWrapper, { backgroundColor: theme.colors.primaryLight }]}>
           <Icon name="wallet" size={32} color={theme.colors.primary} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  balanceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    borderRadius: 24,
  },
  balanceInfo: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balance: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WalletCard;
