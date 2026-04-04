import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

const AddressSelector = ({ isAddressSelected, address, amount, onPress, onInstantOrder }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, borderTopColor: theme.colors.border }]}>
      <View style={styles.topRow}>
        <View style={styles.addressInfo}>
          <Icon name="location" size={20} color={theme.colors.primary} />
          <View style={styles.textContainer}>
            <Text style={[styles.deliverTo, { color: theme.colors.textSecondary }]}>
              Deliver to {isAddressSelected ? 'Home' : 'Select Address'}
            </Text>
            {isAddressSelected && address && (
              <Text style={[styles.address, { color: theme.colors.text }]} numberOfLines={1}>
                {address}
              </Text>
            )}
          </View>
        </View>
        
        {!isAddressSelected && (
          <TouchableOpacity onPress={onPress}>
            <Text style={[styles.changeBtn, { color: theme.colors.primary }]}>Select Address</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={[styles.instantBtn, { borderColor: theme.colors.primary }]}
          onPress={onInstantOrder}
        >
          <Text style={[styles.instantText, { color: theme.colors.primary }]}>Instant Order</Text>
          <Text style={styles.codText}>(COD)</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.payBtn, { backgroundColor: theme.colors.primary }]}
          onPress={onPress}
        >
          <View style={styles.amountContainer}>
            <Text style={styles.amount}>₹{amount}</Text>
            <Text style={styles.totalLabel}>TOTAL</Text>
          </View>
          <View style={styles.payContainer}>
            <Text style={styles.payText}>{isAddressSelected ? 'PAY NOW' : 'SELECT ADDRESS'}</Text>
            <Icon name="chevron-forward" size={20} color="#FFF" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    marginLeft: 8,
    flex: 1,
  },
  deliverTo: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  address: {
    fontSize: 14,
    fontWeight: '600',
  },
  changeBtn: {
    fontSize: 13,
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  instantBtn: {
    flex: 0.4,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 12,
  },
  instantText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  codText: {
    fontSize: 8,
    color: '#666',
  },
  payBtn: {
    flex: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  amountContainer: {
    alignItems: 'flex-start',
  },
  amount: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: 'bold',
  },
  payContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  payText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
});

export default AddressSelector;
