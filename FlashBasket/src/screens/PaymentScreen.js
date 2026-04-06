import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../constants/ThemeContext';
import { useUser } from '../redux/UserContext';
import { useCart } from '../redux/CartContext';
import BillSummary from '../components/BillSummary';
import orderService from '../services/orderService';
import QRCode from 'react-native-qrcode-svg';

const PaymentScreen = ({ navigation, route }) => {
  const { amount, couponCode } = route.params;
  const { theme, isDark } = useTheme();
  const { selectedAddress, wallet } = useUser();
  const { clearCart } = useCart();
  
  const [selectedMethod, setSelectedMethod] = useState('cod');
  const [showUPIQR, setShowUPIQR] = useState(false);
  const [loading, setLoading] = useState(false);
  const [useWalletBalance, setUseWalletBalance] = useState(false);

  const baseAmount = parseFloat(amount);
  const availableWallet = wallet?.balance || 0;
  const walletDeduction = useWalletBalance ? Math.min(availableWallet, baseAmount) : 0;
  const finalAmount = Math.max(0, baseAmount - walletDeduction);

  const upiString = `upi://pay?pa=flashbasket@paytm&pn=FlashBasket&am=${finalAmount}&cu=INR`;

  const handlePlaceOrder = async (isInstant = false) => {
    if (!selectedAddress) {
      Alert.alert('Error', 'Please select a delivery address');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        addressId: selectedAddress.id,
        paymentMethod: (finalAmount === 0 || isInstant) ? 'cod' : selectedMethod,
        couponCode: couponCode || null,
        useWallet: useWalletBalance,
      };

      const response = await orderService.createOrder(orderData);
      
      if (response && response.data) {
        // Success
        clearCart();
        navigation.navigate('OrderSuccessScreen', { 
          order: response.data, 
          address: selectedAddress 
        });
      }
    } catch (error) {
      Alert.alert('Order Failed', error.message || 'Something went wrong');
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Payment</Text>
        <View style={{ width: 24 }} />
      </View>

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
            subtotal={route.params.subtotal} 
            discount={route.params.discount} 
            deliveryCharge={route.params.deliveryCharge} 
          />
        </View>

        {/* Wallet Use Checkbox */}
        {availableWallet > 0 && (
          <TouchableOpacity 
            style={[styles.walletToggleCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            onPress={() => setUseWalletBalance(!useWalletBalance)}
            activeOpacity={0.7}
          >
            <View style={styles.walletToggleInfo}>
              <Icon name="wallet" size={24} color={theme.colors.primary} />
              <View style={{ marginLeft: 12 }}>
                <Text style={[styles.walletToggleTitle, { color: theme.colors.text }]}>Use Flash Wallet</Text>
                <Text style={{ color: theme.colors.textSecondary, fontSize: 13 }}>Available Balance: ₹{availableWallet}</Text>
              </View>
            </View>
            
            <View style={[styles.checkbox, useWalletBalance && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }]}>
               {useWalletBalance && <Icon name="checkmark" size={16} color="#FFF" />}
            </View>
          </TouchableOpacity>
        )}

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Payment Methods</Text>
          <PaymentMethod 
            id="cod"
            name="Cash on Delivery"
            icon="wallet"
            description="Pay cash when item is delivered"
          />
          <PaymentMethod 
            id="upi"
            name="UPI Payment"
            icon="qr-code"
            description="Scan and pay using any UPI app"
          />
        </View>

        {selectedMethod === 'upi' && (
          <View style={[styles.upiCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.upiTitle, { color: theme.colors.text }]}>Scan & Pay</Text>
            <View style={styles.qrContainer}>
              <QRCode value={upiString} size={150} />
            </View>
            <Text style={[styles.qrTotal, { color: theme.colors.primary }]}>Total Amount: ₹{finalAmount}</Text>
            <TouchableOpacity 
              style={[styles.payConfirmBtn, { backgroundColor: theme.colors.primary }]}
              onPress={() => handlePlaceOrder()}
            >
              <Text style={styles.payConfirmText}>I have paid</Text>
            </TouchableOpacity>
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
          <TouchableOpacity 
            style={[styles.instantBtn, { borderColor: theme.colors.primary }]}
            onPress={() => handlePlaceOrder(true)}
            disabled={loading}
          >
            <Text style={[styles.instantBtnText, { color: theme.colors.primary }]}>Instant Order</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.placeBtn, { backgroundColor: theme.colors.primary }]}
            onPress={() => selectedMethod === 'cod' ? handlePlaceOrder() : Alert.alert('Payment Required', 'Please complete UPI payment first')}
            disabled={loading || selectedMethod === 'upi'}
          >
            <Text style={styles.placeBtnText}>Place Order</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 18, fontWeight: '800' },
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
    borderWidth: 1,
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
    borderRadius: 16, 
    alignItems: 'center', 
    marginTop: -8, 
    marginBottom: 24, 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 10 
  },
  upiTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 16 },
  qrContainer: { padding: 10, backgroundColor: '#fff', borderRadius: 12 },
  qrTotal: { marginTop: 12, fontWeight: 'bold', fontSize: 16 },
  payConfirmBtn: { marginTop: 20, paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
  payConfirmText: { color: '#fff', fontWeight: 'bold' },
  footer: { padding: 16, borderTopWidth: 1 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  totalLabel: { fontSize: 14 },
  totalAmount: { fontSize: 20, fontWeight: '900' },
  buttonRow: { flexDirection: 'row', gap: 12 },
  instantBtn: { flex: 1, height: 54, borderRadius: 12, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
  instantBtnText: { fontWeight: '800', fontSize: 15 },
  placeBtn: { flex: 1, height: 54, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  placeBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  walletToggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  walletToggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletToggleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CCC',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default PaymentScreen;
