import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BillSummary = ({ subtotal, discount, deliveryCharge }) => {
  const { theme, isDark } = useTheme();
  
  const handlingFee = subtotal > 0 ? 5 : 0;
  const total = subtotal - discount + deliveryCharge + handlingFee;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.header}>
        <Icon name="file-document-outline" size={20} color={theme.colors.text} />
        <Text style={[styles.title, { color: theme.colors.text }]}>Bill Summary</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Item Total</Text>
          <View style={styles.priceRow}>
            {discount > 0 && (
              <Text style={[styles.strikeText, { color: theme.colors.textSecondary }]}>₹{subtotal + discount}</Text>
            )}
            <Text style={[styles.value, { color: theme.colors.text }]}>₹{subtotal}</Text>
          </View>
        </View>
        
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Delivery Fee</Text>
          <Text style={[styles.value, { color: deliveryCharge === 0 ? '#10B981' : theme.colors.text }]}>
            {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Handling Fee</Text>
          <Text style={[styles.value, { color: handlingFee === 0 ? '#10B981' : theme.colors.text }]}>
             {handlingFee === 0 ? 'FREE' : `₹${handlingFee}`}
          </Text>
        </View>

        {discount > 0 && (
          <View style={styles.row}>
            <Text style={[styles.label, { color: '#10B981', fontWeight: '600' }]}>Discount</Text>
            <Text style={[styles.value, { color: '#10B981', fontWeight: '600' }]}>-₹{discount}</Text>
          </View>
        )}
        
        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
        
        <View style={styles.row}>
          <Text style={[styles.totalLabel, { color: theme.colors.text }]}>To Pay</Text>
          <Text style={[styles.totalValue, { color: theme.colors.text }]}>₹{total}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
  content: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  strikeText: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    marginRight: 8,
    opacity: 0.6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 12,
    opacity: 0.5,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: '800',
  },
  totalValue: {
    fontSize: 17,
    fontWeight: '800',
  },
});

export default BillSummary;

