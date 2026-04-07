import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../constants/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import CartItem from '../components/CartItem';
import CouponSection from '../components/CouponSection';
import BillSummary from '../components/BillSummary';
import AddressSelector from '../components/AddressSelector';
import AddressModal from '../components/AddressModal';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';

import { useCart } from '../redux/CartContext';
import { useUser } from '../redux/UserContext';
import Skeleton from '../components/common/Skeleton';

// Moved Snapshot outside or will inline it to be safer
const CartScreenSnapshot = ({ theme }) => {
  return (
    <View style={{ padding: 16 }}>
      <Skeleton width="100%" height={80} style={{ marginBottom: 16, borderRadius: 16 }} />
      <Skeleton width="100%" height={100} style={{ marginBottom: 16, borderRadius: 16 }} />
      <Skeleton width="100%" height={200} style={{ marginBottom: 16, borderRadius: 16 }} />
      <Skeleton width="100%" height={150} style={{ borderRadius: 16 }} />
    </View>
  );
};

const CartScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const { cart, loading, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { addresses, selectedAddress, setSelectedAddress, deleteAddress, wallet } = useUser();
  
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [useWalletBalance, setUseWalletBalance] = useState(false);

  const cartItems = cart?.items || [];
  const subtotal = getCartTotal();
  const discount = appliedOffer ? appliedOffer.discountAmount : 0; 
  
  // SINGLE SOURCE OF TRUTH: Delivery Charging Logic
  const deliveryFee = subtotal > 500 || subtotal === 0 ? 0 : 25;
  const handlingFee = subtotal > 0 ? 5 : 0;
  
  const baseAmount = subtotal - discount + deliveryFee + handlingFee;
  const walletUsed = useWalletBalance ? Math.min(wallet?.balance || 0, baseAmount) : 0;
  const grandTotal = Math.max(0, baseAmount - walletUsed);
  
  const orderSummary = {
    itemsTotal: subtotal,
    discount: discount,
    deliveryFee: deliveryFee,
    handlingFee: handlingFee,
    walletUsed: walletUsed, 
    grandTotal: grandTotal
  };

  const handleIncrease = (id) => {
    const item = cartItems.find(i => i.id === id);
    if (item) updateQuantity(id, item.quantity + 1, item.productId);
  };

  const handleDecrease = (id) => {
    const item = cartItems.find(i => i.id === id);
    if (item && item.quantity > 1) {
      updateQuantity(id, item.quantity - 1, item.productId);
    } else if (item) {
      removeFromCart(id);
    }
  };

  const handleApplyOffer = (offer) => {
    setAppliedOffer(offer);
    if (offer) {
      Alert.alert('Success', `₹${offer.discountAmount} OFF Applied!`);
    }
  };

  const handleCheckoutPress = () => {
    if (!selectedAddress) {
      setShowAddressModal(true);
      return;
    }
    navigation.navigate('PaymentScreen', { 
      orderSummary: orderSummary,
      couponCode: appliedOffer?.code
    });
  };

  const handleSelectAddress = (addr) => {
    setSelectedAddress(addr);
    setShowAddressModal(false);
  };

  const handleAddAddress = () => {
    setShowAddressModal(false);
    navigation.navigate('AddAddressScreen');
  };

  const handleEditAddress = (addr) => {
    setShowAddressModal(false);
    navigation.navigate('AddAddressScreen', { address: addr, isEdit: true });
  };

  const handleDeleteAddress = (id) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteAddress(id) },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <CartScreenSnapshot theme={theme} />
      ) : cartItems.length === 0 ? (
        <Animated.View entering={FadeIn} style={styles.emptyContainer}>
          <Icon name="cart-outline" size={100} color={theme.colors.border} />
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>Your cart is empty</Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>Add items to continue</Text>
          <TouchableOpacity 
            style={[styles.shopNowBtn, { backgroundColor: theme.colors.primary }]} 
            onPress={() => navigation.navigate('BottomTabs', { screen: 'Home' })}
          >
            <Text style={styles.shopNowText}>Shop Now</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Savings Banner */}
            <Animated.View entering={FadeIn.duration(800)} style={[styles.savingsBanner, { backgroundColor: '#E1F8F0' }]}>
              <Icon name="sparkles" size={16} color="#10B981" />
              <Text style={styles.savingsBannerText}>
                Yay! You saved <Text style={{ fontWeight: '800' }}>₹{discount + (subtotal > 500 ? 25 : 0)}</Text> on this order
              </Text>
            </Animated.View>

            {/* Delivery Address Section */}
            <View style={styles.sectionPx}>
              <View style={[styles.addressContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <View style={styles.addressHeaderRow}>
                  <View style={styles.addressLabelContainer}>
                    <Icon name="location-outline" size={18} color={theme.colors.primary} />
                    <Text style={[styles.addressLabel, { color: theme.colors.textSecondary }]}>Delivery Address</Text>
                  </View>
                  <TouchableOpacity onPress={() => setShowAddressModal(true)}>
                    <Text style={[styles.changeBtnText, { color: theme.colors.primary }]}>
                      {selectedAddress ? 'Change' : 'Select'}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                {selectedAddress ? (
                  <View style={styles.selectedAddressInfo}>
                    <Text style={[styles.selectedAddressFullHead, { color: theme.colors.text }]} numberOfLines={1}>
                      {selectedAddress.fullAddress}
                    </Text>
                    <View style={styles.addressBadge}>
                       <Icon name={selectedAddress.type?.toLowerCase() === 'home' ? 'home' : 'business'} size={12} color={theme.colors.textSecondary} />
                       <Text style={[styles.selectedAddressType, { color: theme.colors.textSecondary }]}>
                         {selectedAddress.type}
                       </Text>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity 
                    onPress={() => setShowAddressModal(true)} 
                    style={[styles.selectAddressBtn, { backgroundColor: theme.colors.primary + '15', borderColor: theme.colors.primary }]}
                  >
                    <Icon name="add-circle-outline" size={20} color={theme.colors.primary} />
                    <Text style={[styles.selectAddressBtnText, { color: theme.colors.primary }]}>Select Delivery Address</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.section}>
              {cartItems.map((item, index) => (
                <Animated.View 
                  key={item.id} 
                  layout={Layout.springify()}
                  entering={FadeIn.delay(index * 100)}
                >
                  <CartItem 
                    item={{
                      id: item.id,
                      name: item.product?.name,
                      price: item.product?.discount_price || item.product?.price,
                      oldPrice: item.product?.discount_price ? item.product?.price : null,
                      quantity: item.quantity,
                      image: item.product?.image,
                      weight: item.product?.weight
                    }} 
                    onIncrease={() => handleIncrease(item.id)}
                    onDecrease={() => handleDecrease(item.id)}
                  />
                </Animated.View>
              ))}
            </View>

            {/* Offers Section */}
            <View style={styles.sectionPx}>
              <CouponSection 
                cartTotal={subtotal} 
                appliedOffer={appliedOffer}
                onApplyOffer={handleApplyOffer}
              />
            </View>

            {/* Wallet Section */}
            {wallet?.balance > 0 && (
              <View style={styles.sectionPx}>
                 <TouchableOpacity 
                   style={[styles.walletCard, { backgroundColor: theme.colors.surface, borderColor: useWalletBalance ? theme.colors.primary : theme.colors.border }]}
                   onPress={() => setUseWalletBalance(!useWalletBalance)}
                   activeOpacity={0.7}
                 >
                    <View style={styles.walletInfo}>
                       <View style={[styles.walletIconContainer, { backgroundColor: theme.colors.primary + '15' }]}>
                          <Icon name="wallet" size={20} color={theme.colors.primary} />
                       </View>
                       <View>
                          <Text style={[styles.walletLabel, { color: theme.colors.text }]}>Use ₹{walletUsed} from wallet</Text>
                          <Text style={[styles.walletSubLabel, { color: theme.colors.textSecondary }]}>You have ₹{wallet.balance} in your wallet</Text>
                       </View>
                    </View>
                    <View style={[styles.checkbox, useWalletBalance && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }]}>
                       {useWalletBalance && <Icon name="checkmark" size={16} color="#FFF" />}
                    </View>
                 </TouchableOpacity>
              </View>
            )}

            {/* Bill Summary */}
            <View style={styles.sectionPx}>
              <BillSummary 
                subtotal={orderSummary.itemsTotal} 
                discount={orderSummary.discount} 
                deliveryFee={orderSummary.deliveryFee} 
                handlingFee={orderSummary.handlingFee}
                walletUsed={orderSummary.walletUsed}
                total={orderSummary.grandTotal}
              />
            </View>

            <View style={{ height: 100 }} />
          </ScrollView>

          {/* Bottom CTA */}
          <View style={styles.bottomBarWrapper}>
            <AddressSelector 
              isAddressSelected={!!selectedAddress}
              amount={orderSummary.grandTotal}
              onPress={handleCheckoutPress}
            />
          </View>
        </>
      )}

      <AddressModal 
        visible={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        addresses={addresses}
        onSelect={handleSelectAddress}
        onAdd={handleAddAddress}
        onEdit={handleEditAddress}
        onDelete={handleDeleteAddress}
      />
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
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  scrollContent: {
    paddingTop: 12,
  },
  savingsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    justifyContent: 'center',
  },
  savingsBannerText: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    paddingHorizontal: 16,
  },
  sectionPx: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  addressContainer: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  addressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addressLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  changeBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
  selectedAddressInfo: {
    marginTop: 4,
    gap: 4,
  },
  selectedAddressFullHead: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  addressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  selectedAddressType: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  selectAddressBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginTop: 8,
    gap: 8,
  },
  selectAddressBtnText: {
    fontSize: 15,
    fontWeight: '800',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    opacity: 0.8,
  },
  shopNowBtn: {
    marginTop: 30,
    paddingHorizontal: 50,
    paddingVertical: 16,
    borderRadius: 20,
    elevation: 4,
  },
  shopNowText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  bottomBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  walletCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  walletInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  walletIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  walletLabel: {
    fontSize: 14,
    fontWeight: '800',
  },
  walletSubLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CartScreen;

