import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

const AddressSelector = ({ isAddressSelected, address, amount, onPress }) => {
  const { theme, isDarkMode } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <TouchableOpacity 
        style={[styles.mainBtn, { backgroundColor: theme.colors.primary }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.btnContent}>
          <View style={styles.amountContainer}>
            <Text style={styles.amount}>₹{amount}</Text>
            <Text style={styles.totalLabel}>TOTAL</Text>
          </View>
          
          <View style={styles.actionContainer}>
            <Text style={styles.actionText}>
              {isAddressSelected ? 'PROCEED TO PAYMENT' : 'SELECT ADDRESS'}
            </Text>
            <Icon name="chevron-forward" size={20} color="#FFF" />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 0.5,
    borderTopColor: '#eee',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  mainBtn: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    height: 60,
    justifyContent: 'center',
  },
  btnContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountContainer: {
    alignItems: 'flex-start',
  },
  amount: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
  },
  totalLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
    marginRight: 4,
  },
});

export default AddressSelector;

