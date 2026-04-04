import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../constants/ThemeContext';

const BillSummary = ({ subtotal, discount, deliveryCharge }) => {
  const { theme } = useTheme();
  const total = subtotal - discount + deliveryCharge;
  const savings = discount;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Bill Summary</Text>
      
      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Item total</Text>
        <Text style={[styles.value, { color: theme.colors.text }]}>₹{subtotal}</Text>
      </View>
      
      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.colors.primary }]}>Discount</Text>
        <Text style={[styles.value, { color: theme.colors.primary }]}>-₹{discount}</Text>
      </View>
      
      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Delivery charge</Text>
        <Text style={[styles.value, { color: theme.colors.text }]}>
          {deliveryCharge > 0 ? `₹${deliveryCharge}` : 'FREE'}
        </Text>
      </View>
      
      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
      
      <View style={styles.row}>
        <Text style={[styles.totalLabel, { color: theme.colors.text }]}>Grand Total</Text>
        <Text style={[styles.totalValue, { color: theme.colors.text }]}>₹{total}</Text>
      </View>
      
      {savings > 0 && (
        <View style={[styles.savingsContainer, { backgroundColor: theme.colors.primaryLight }]}>
          <Text style={[styles.savingsText, { color: theme.colors.primary }]}>
            Your total savings ₹{savings}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 12,
    borderWidth: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  savingsContainer: {
    marginTop: 16,
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  savingsText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default BillSummary;
