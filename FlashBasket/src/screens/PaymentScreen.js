import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../constants/ThemeContext';
import { useUser } from '../redux/UserContext';
import { useCart } from '../redux/CartContext';
import BillSummary from '../components/BillSummary';
import orderService from '../services/orderService';
import paymentService from '../services/paymentService';
import QRCode from 'react-native-qrcode-svg';
import { useStripe } from '@stripe/stripe-react-native';

import NavHeader from '../components/NavHeader';

const PaymentScreen = ({ navigation, route }) => {
  const { orderSummary = {}, couponCode } = route.params || {};
  const { theme, isDark } = useTheme();
  const { selectedAddress, loadWalletBalance, user } = useUser();
  const { clearCart } = useCart();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  
  const [selectedMethod, setSelectedMethod] = useState('online');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const itemsTotal = orderSummary.itemsTotal || 0;
  const discount = orderSummary.discount || 0;
  const deliveryFee = orderSummary.deliveryFee || 0;
  const handlingFee = orderSummary.handlingFee || 0;
  const walletDeduction = orderSummary.walletUsed || 0;
  const finalAmount = parseFloat(orderSummary.grandTotal || 0);
  
  const isFullyPaidByWallet = finalAmount === 0;
  
  const handlePlaceOrder = async (isInstant = false) => {
    if (!selectedAddress) {
      Alert.alert('Error', 'Please select a delivery address');
      return;
    }

    setLoading(true);
    let stripePaymentIntentId = null;

    try {
      const method = isFullyPaidByWallet ? 'wallet' : (isInstant ? 'cod' : selectedMethod);

      if (method === 'online') {
        const response = await paymentService.createPaymentIntent({ 
          couponCode, 
          useWallet: walletDeduction > 0 
        });
        
        if (!response || !response.data || !response.data.clientSecret) {
          throw new Error('Failed to initiate payment. Please try again.');
        }

        const { clientSecret } = response.data;
        stripePaymentIntentId = clientSecret.split('_secret')[0];

        const { error: initError } = await initPaymentSheet({
          paymentIntentClientSecret: clientSecret,
          merchantDisplayName: 'FlashBasket',
          appearance: {
            colors: {
              primary: theme.colors.primary,
            },
          },
        });

        if (initError) {
          throw new Error(initError.message);
        }

        const { error: presentError } = await presentPaymentSheet();

        if (presentError) {
          if (presentError.code === 'Canceled') {
            throw new Error('CANCELLED');
          }
          throw new Error(presentError.message);
        }
      }

      const orderData = {
        addressId: selectedAddress.id,
        paymentMethod: method === 'online' ? 'online' : method,
        couponCode: couponCode || null,
        useWallet: walletDeduction > 0,
        stripePaymentIntentId: method === 'online' ? stripePaymentIntentId : null,
      };

      const response = await orderService.createOrder(orderData);
      
      if (response && response.data) {
        await loadWalletBalance();
        clearCart();
        navigation.navigate('OrderSuccessScreen', { 
          order: response.data, 
          address: selectedAddress 
        });
      }
    } catch (error) {
      if (error.message === 'CANCELLED') {
        Alert.alert('Payment Cancelled', 'You cancelled the payment process.');
      } else {
        Alert.alert('Payment Failed', error.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const PaymentMethod = ({ id, name, icon, description }) => (
    <TouchableOpacity
      style={[
        styles.methodItem,
        { 
          backgroundColor: theme.colors.surface,
          borderColor: selectedMethod === id ? theme.colors.primary : theme.colors.border 
        }
      ]}
      onPress={() => setSelectedMethod(id)}
    >
      <View style={[styles.methodIcon, { backgroundColor: theme.colors.primary + '10' }]}>
        <Icon name={icon} size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.methodInfo}>
        <Text style={[styles.methodName, { color: theme.colors.text }]}>{name}</Text>
        <Text style={[styles.methodDesc, { color: theme.colors.textSecondary }]}>{description}</Text>
      </View>
      <View style={[styles.radioCircle, { borderColor: theme.colors.border }]}>
        {selectedMethod === id && <View style={[styles.radioDot, { backgroundColor: theme.colors.primary }]} />}
      </View>
    </TouchableOpacity>
  );

  const upiString = `upi://pay?pa=flashbasket@paytm&pn=FlashBasket&am=${finalAmount}&cu=INR`;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <NavHeader title="Payment" />


      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Delivery Address</Text>
          <View style={[styles.addressCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={styles.addressHeader}>
              <Icon name="location" size={20} color={theme.colors.primary} />
              <Text style={[styles.addressLabel, { color: theme.colors.text }]}>{selectedAddress?.name || 'Home'}</Text>
            </View>
            <Text style={[styles.addressText, { color: theme.colors.textSecondary }]}>
              {selectedAddress?.fullAddress}, {selectedAddress?.city} - {selectedAddress?.pincode}
            </Text>
          </View>
        </View>

        {/* Bill Summary */}
        <View style={styles.section}>
          <BillSummary 
            subtotal={itemsTotal} 
            discount={discount} 
            deliveryFee={deliveryFee} 
            handlingFee={handlingFee}
            walletUsed={walletDeduction}
            total={finalAmount} 
          />
        </View>

        {/* Payment Methods Section */}
        {!isFullyPaidByWallet ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Payment Methods</Text>
            <PaymentMethod 
              id="online"
              name="Online Payment"
              icon="card"
              description="Pay securely using Stripe (Cards, UPI, etc.)"
            />
            <PaymentMethod 
              id="cod"
              name="Cash on Delivery"
              icon="wallet"
              description="Pay cash when item is delivered"
            />
            <PaymentMethod 
              id="upi"
              name="Flash QR (Scan & Pay)"
              icon="qr-code"
              description="Scan and pay using our merchant QR"
            />

            {selectedMethod === 'upi' && (
              <View style={[styles.upiCard, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.upiTitle, { color: theme.colors.text }]}>Scan & Pay</Text>
                <View style={styles.qrContainer}>
                  <QRCode value={upiString} size={150} />
                </View>
                <Text style={[styles.qrTotal, { color: theme.colors.primary }]}>Total Amount: ₹{finalAmount}</Text>
                
                <TouchableOpacity 
                  style={styles.checkboxContainer} 
                  onPress={() => setPaymentConfirmed(!paymentConfirmed)}
                >
                  <View style={[styles.checkbox, paymentConfirmed && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }]}>
                    {paymentConfirmed && <Icon name="checkmark" size={14} color="#FFF" />}
                  </View>
                  <Text style={[styles.checkboxLabel, { color: theme.colors.text }]}>I have completed the payment</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[
                    styles.payConfirmBtn, 
                    { backgroundColor: paymentConfirmed ? theme.colors.primary : theme.colors.textTertiary }
                  ]}
                  onPress={() => handlePlaceOrder()}
                  disabled={!paymentConfirmed || loading}
                >
                  <Text style={styles.payConfirmText}>{loading ? 'Placing Order...' : 'Verify & Place Order'}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <View style={[styles.walletPaidCard, { backgroundColor: theme.colors.primary + '10', borderColor: theme.colors.primary }]}>
             <Icon name="checkmark-circle" size={40} color={theme.colors.primary} />
             <Text style={[styles.walletPaidTitle, { color: theme.colors.text }]}>Order Fully Paid by Wallet</Text>
             <Text style={[styles.walletPaidDesc, { color: theme.colors.textSecondary }]}>
               No further payment is required. You can proceed to place your order.
             </Text>
          </View>
        )}
      </ScrollView>

      {/* Footer Actions */}
      <View style={[styles.footer, { backgroundColor: theme.colors.background, borderTopColor: theme.colors.border }]}>
        <View style={styles.priceRow}>
          <Text style={[styles.totalLabel, { color: theme.colors.textSecondary }]}>Total Amount</Text>
          <Text style={[styles.totalAmount, { color: theme.colors.text }]}>₹{finalAmount}</Text>
        </View>
        
        <View style={styles.buttonRow}>
          {!isFullyPaidByWallet && (
            <TouchableOpacity 
              style={[styles.instantBtn, { borderColor: theme.colors.primary }]}
              onPress={() => handlePlaceOrder(true)}
              disabled={loading}
            >
              <Text style={[styles.instantBtnText, { color: theme.colors.primary }]}>Instant Order</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[
              styles.placeBtn, 
              { 
                backgroundColor: (isFullyPaidByWallet || selectedMethod === 'cod' || selectedMethod === 'online' || paymentConfirmed) ? theme.colors.primary : theme.colors.textTertiary,
                flex: 1 
              }
            ]}
            onPress={() => {
              if (!isFullyPaidByWallet && selectedMethod === 'upi' && !paymentConfirmed) {
                Alert.alert('Payment Required', 'Please complete UPI payment and check the confirmation box');
              } else {
                handlePlaceOrder();
              }
            }}
            disabled={loading || (!isFullyPaidByWallet && selectedMethod === 'upi' && !paymentConfirmed)}
          >
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color="#FFF" size="small" />
                <Text style={[styles.placeBtnText, { marginLeft: 10 }]}>Processing...</Text>
              </View>
            ) : (
              <Text style={styles.placeBtnText}>
                {isFullyPaidByWallet ? 'Place Wallet Order' : 'Place Order'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: 16 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  addressCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  addressHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  addressLabel: { fontWeight: '700', fontSize: 15, marginLeft: 8 },
  addressText: { fontSize: 13, lineHeight: 20 },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 12,
  },
  methodIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  methodInfo: { flex: 1, marginLeft: 12 },
  methodName: { fontSize: 15, fontWeight: '700' },
  methodDesc: { fontSize: 12, marginTop: 2 },
  radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  upiCard: { 
    padding: 20, 
    borderRadius: 20, 
    alignItems: 'center', 
    marginTop: 8, 
    marginBottom: 24, 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#eee'
  },
  upiTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 16 },
  qrContainer: { padding: 10, backgroundColor: '#fff', borderRadius: 12 },
  qrTotal: { marginTop: 12, fontWeight: 'bold', fontSize: 16 },
  payConfirmBtn: { marginTop: 20, paddingHorizontal: 30, paddingVertical: 14, borderRadius: 25, width: '100%', alignItems: 'center' },
  payConfirmText: { color: '#fff', fontWeight: 'bold' },
  checkboxLabel: { fontSize: 14, fontWeight: '600', marginLeft: 10 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 20, paddingHorizontal: 4 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#CCC', justifyContent: 'center', alignItems: 'center' },
  footer: { padding: 16, borderTopWidth: 1 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  totalLabel: { fontSize: 14 },
  totalAmount: { fontSize: 20, fontWeight: '900' },
  buttonRow: { flexDirection: 'row', gap: 12 },
  instantBtn: { flex: 1, height: 54, borderRadius: 12, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
  instantBtnText: { fontWeight: '800', fontSize: 15 },
  placeBtn: { flex: 1, height: 54, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  placeBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  loadingRow: { flexDirection: 'row', alignItems: 'center' },
  walletPaidCard: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    marginBottom: 24,
  },
  walletPaidTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 8,
  },
  walletPaidDesc: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  }
});

export default PaymentScreen;
