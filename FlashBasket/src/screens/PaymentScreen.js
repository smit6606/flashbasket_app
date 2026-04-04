import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../constants/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import PaymentOption from '../components/PaymentOption';
import OrderSummary from '../components/OrderSummary';

import { useCart } from '../redux/CartContext';
import { useUser } from '../redux/UserContext';
import orderService from '../services/orderService';
import { ActivityIndicator } from 'react-native';

const PaymentScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const [selectedMethod, setSelectedMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  const { cartItems, getCartTotal, clearCart } = useCart();
  const { selectedAddress, wallet } = useUser();

  const subtotal = getCartTotal();
  const discount = Math.round(subtotal * 0.1); // Keep random discount for now
  const deliveryCharge = subtotal > 500 ? 0 : 25;
  const grandTotal = subtotal - discount + deliveryCharge;

  const paymentMethods = [
    { id: 'cod', title: 'Cash on Delivery', icon: 'cash-outline', subtitle: 'Pay when your order arrives' },
    { id: 'upi', title: 'UPI', icon: 'card-outline', subtitle: 'Pay via GPay, PhonePe, Paytm' },
    { id: 'card', title: 'Debit/Credit Card', icon: 'card-outline', subtitle: 'Visa, Mastercard, RuPay' },
    { id: 'wallet', title: 'FlashBasket Wallet', icon: 'wallet-outline', subtitle: `₹${wallet?.balance || 0}` },
  ];

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }

    setLoading(true);
    try {
      await orderService.createOrder({
        addressId: selectedAddress.id,
        paymentMethod: selectedMethod,
        discount: discount,
        deliveryFee: deliveryCharge,
      });
      // Optionally await clearCart(); if backed does it we might just need to refresh
      navigation.navigate('OrderSuccessScreen');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Payment</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Address Confirmation */}
        <View style={[styles.section, { backgroundColor: theme.colors.background }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Delivering to</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AddressScreen')}>
              <Text style={[styles.editButton, { color: theme.colors.primary }]}>Change</Text>
            </TouchableOpacity>
          </View>
          {selectedAddress ? (
            <View style={styles.addressContainer}>
              <View style={[styles.addressIcon, { backgroundColor: theme.colors.surface }]}>
                <Icon name="location" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.addressTextContainer}>
                <Text style={[styles.addressLabel, { color: theme.colors.text }]}>{selectedAddress.address_title || 'Address'}</Text>
                <Text style={[styles.addressText, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                  {selectedAddress.full_address}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={{ color: theme.colors.textSecondary }}>No address selected</Text>
          )}
        </View>

        {/* Payment Options */}
        <View style={[styles.section, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text, marginBottom: 16 }]}>Choose Payment Method</Text>
          {paymentMethods.map((method) => (
            <PaymentOption 
              key={method.id}
              selected={selectedMethod === method.id}
              onSelect={() => setSelectedMethod(method.id)}
              {...method}
            />
          ))}
        </View>

        {/* Order Summary */}
        <OrderSummary 
          items={cartItems.map(item => ({
            ...item.product,
            quantity: item.quantity,
          }))}
          subtotal={subtotal}
          discount={discount}
          deliveryCharge={deliveryCharge}
          total={grandTotal}
        />

        {/* Extra Padding for Sticky Button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Place Order Button */}
      <View style={[styles.footer, { backgroundColor: theme.colors.background, borderTopColor: theme.colors.border }]}>
        <View style={styles.footerLeft}>
          <Text style={[styles.totalAmount, { color: theme.colors.text }]}>₹{grandTotal}</Text>
          <Text style={[styles.footerSubText, { color: theme.colors.textSecondary }]}>View Details</Text>
        </View>
        <TouchableOpacity 
          style={[styles.placeOrderButton, { backgroundColor: theme.colors.primary }]}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <>
              <Text style={styles.placeOrderButtonText}>Place Order</Text>
              <Icon name="chevron-forward" size={20} color="white" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconButton: {
    padding: 4,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButton: {
    fontSize: 14,
    fontWeight: '600',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addressTextContainer: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  addressText: {
    fontSize: 12,
    marginTop: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    paddingBottom: 32, // More for home indicator
  },
  footerLeft: {
    flex: 1,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '900',
  },
  footerSubText: {
    fontSize: 12,
    fontWeight: '500',
  },
  placeOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 180,
    justifyContent: 'center',
  },
  placeOrderButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default PaymentScreen;
