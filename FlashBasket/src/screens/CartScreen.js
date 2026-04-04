import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../constants/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import CartItem from '../components/CartItem';
import OfferProgressBar from '../components/OfferProgressBar';
import CouponSection from '../components/CouponSection';
import BillSummary from '../components/BillSummary';
import AddressSelector from '../components/AddressSelector';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';

import { useCart } from '../redux/CartContext';
import { useUser } from '../redux/UserContext';
import Skeleton from '../components/common/Skeleton';

const CartScreenSnapshot = () => {
  const { theme } = useTheme();
  return (
    <View style={{ padding: 16 }}>
      <Skeleton width="100%" height={80} style={{ marginBottom: 16 }} />
      <Skeleton width="100%" height={100} style={{ marginBottom: 16 }} />
      <Skeleton width="100%" height={100} style={{ marginBottom: 16 }} />
      <Skeleton width="100%" height={150} />
    </View>
  );
};

const CartScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const { cart, loading, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { selectedAddress } = useUser();

  const cartItems = cart?.items || [];
  const subtotal = getCartTotal();
  const discount = 0; 
  const deliveryCharge = subtotal > 500 || subtotal === 0 ? 0 : 25;
  const grandTotal = subtotal - discount + deliveryCharge;

  const handleIncrease = (id) => {
    const item = cartItems.find(i => i.id === id);
    if (item) updateQuantity(id, item.quantity + 1);
  };

  const handleDecrease = (id) => {
    const item = cartItems.find(i => i.id === id);
    if (item) updateQuantity(id, item.quantity - 1);
  };

  const handleApplyCoupon = () => {
    alert('Coupons can be applied at checkout.');
  };

  const handleCheckout = () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }
    navigation.navigate('PaymentScreen', { amount: grandTotal });
  };

  const handleInstantOrder = () => {
    navigation.navigate('OrderSuccessScreen');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <Icon name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Checkout</Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
              {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('FavoritesScreen')}
        >
          <Icon name="heart-outline" size={24} color={theme.colors.secondary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <CartScreenSnapshot />
      ) : cartItems.length === 0 ? (
        <Animated.View 
          entering={FadeIn}
          style={styles.emptyContainer}
        >
          <Icon name="cart-outline" size={80} color={theme.colors.border} />
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>Your cart is empty</Text>
          <TouchableOpacity 
            style={[styles.shopNowBtn, { backgroundColor: theme.colors.primary }]} 
            onPress={() => navigation.navigate('Main')}
          >
            <Text style={styles.shopNowText}>Shop Now</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Offer Progress */}
          <Animated.View layout={Layout.springify()} style={styles.section}>
            <OfferProgressBar 
              currentAmount={subtotal} 
              targetAmount={500} 
              offerText="FREE gift" 
            />
          </Animated.View>
  
          {/* Cart Items */}
          <View style={[styles.itemsContainer, { backgroundColor: theme.colors.background }]}>
            {cartItems.map((item, index) => (
              <Animated.View 
                key={item.id} 
                layout={Layout.springify()}
                entering={FadeIn.delay(index * 100)}
                exiting={FadeOut}
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
  
          {/* Coupon Section */}
          <Animated.View layout={Layout.springify()} style={styles.section}>
            <CouponSection onApplyCoupon={handleApplyCoupon} />
          </Animated.View>
  
          {/* Bill Summary */}
          <Animated.View layout={Layout.springify()} style={styles.section}>
            <BillSummary 
              subtotal={subtotal} 
              discount={discount} 
              deliveryCharge={deliveryCharge} 
            />
          </Animated.View>
  
          {/* Extra Space for Bottom Bar */}
          <View style={{ height: 120 }} />
        </ScrollView>
      )}
  
      {!loading && cartItems.length > 0 && (
        <Animated.View entering={FadeIn.duration(400)} style={styles.bottomBarWrapper}>
          <AddressSelector 
            isAddressSelected={!!selectedAddress}
            address={selectedAddress ? `${selectedAddress.title}: ${selectedAddress.full_address}` : 'Select delivery address'}
            amount={grandTotal}
            onPress={handleCheckout}
            onInstantOrder={handleInstantOrder}
          />
        </Animated.View>
      )}
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginLeft: 12,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 12,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  itemsContainer: {
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
  },
  shopNowBtn: {
    marginTop: 24,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 16,
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
  }
});

export default CartScreen;
