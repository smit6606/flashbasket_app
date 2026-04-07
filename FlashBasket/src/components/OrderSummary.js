import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import APP_CONFIG from '../config';

const OrderSummary = ({ items = [], subtotal, discount, deliveryCharge, total }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Order Summary</Text>
      
      {/* Items List */}
      <View style={styles.itemsContainer}>
        {items.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <View style={styles.itemLeft}>
              <View style={[styles.imageContainer, { backgroundColor: theme.colors.surface }]}>
                <Image source={{ uri: (item.image && item.image.trim() !== '') ? item.image : APP_CONFIG.DEFAULT_PLACEHOLDER }} style={styles.image} />
              </View>
              <View style={styles.itemInfo}>
                <Text style={[styles.itemName, { color: theme.colors.text }]} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={[styles.itemWeight, { color: theme.colors.textSecondary }]}>
                  {item.weight} x {item.quantity}
                </Text>
              </View>
            </View>
            <Text style={[styles.itemPrice, { color: theme.colors.text }]}>
              ₹{item.price * item.quantity}
            </Text>
          </View>
        ))}
      </View>

      {/* Bill Breakdown */}
      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
      
      <View style={styles.billRow}>
        <Text style={[styles.billLabel, { color: theme.colors.textSecondary }]}>Subtotal</Text>
        <Text style={[styles.billValue, { color: theme.colors.text }]}>₹{subtotal}</Text>
      </View>
      
      <View style={styles.billRow}>
        <Text style={[styles.billLabel, { color: theme.colors.textSecondary }]}>Discount</Text>
        <Text style={[styles.billValue, { color: theme.colors.success }]}>-₹{discount}</Text>
      </View>
      
      <View style={styles.billRow}>
        <Text style={[styles.billLabel, { color: theme.colors.textSecondary }]}>Delivery Partner Fee</Text>
        <Text style={[styles.billValue, { color: theme.colors.text }]}>
          {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
        </Text>
      </View>
      
      <View style={[styles.divider, { backgroundColor: theme.colors.border, borderStyle: 'dashed' }]} />
      
      <View style={styles.totalRow}>
        <Text style={[styles.totalLabel, { color: theme.colors.text }]}>Grand Total</Text>
        <Text style={[styles.totalValue, { color: theme.colors.text }]}>₹{total}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemsContainer: {
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  imageContainer: {
    width: 40,
    height: 40,
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
  },
  itemWeight: {
    fontSize: 12,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billLabel: {
    fontSize: 14,
  },
  billValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderSummary;
