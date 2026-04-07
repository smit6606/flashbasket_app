import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Image, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../constants/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import APP_CONFIG from '../config';
import orderService from '../services/orderService';
import Animated, { FadeInUp, SlideInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const OrderDetailsScreen = ({ route, navigation }) => {
  const { theme, isDark } = useTheme();
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    try {
      const response = await orderService.getOrderDetails(orderId);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusSteps = (currentStatus) => {
    const steps = [
      { id: 'Pending', label: 'Order Placed', time: order?.pendingAt },
      { id: 'Packed', label: 'Packed', time: order?.packedAt },
      { id: 'Out for Delivery', label: 'Out for Delivery', time: order?.outForDeliveryAt },
      { id: 'Delivered', label: 'Delivered', time: order?.deliveredAt }
    ];
    
    const statuses = ['Pending', 'Packed', 'Out for Delivery', 'Delivered'];
    const currentIdx = statuses.indexOf(currentStatus);
    
    return steps.map((step, idx) => ({
      ...step,
      completed: idx <= currentIdx,
      active: idx === currentIdx
    }));
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Icon name="alert-circle-outline" size={64} color={theme.colors.error} />
        <Text style={[styles.errorTitle, { color: theme.colors.text }]}>Order details not found</Text>
        <TouchableOpacity style={[styles.backBtnSmall, { backgroundColor: theme.colors.primary }]} onPress={() => navigation.goBack()}>
          <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const steps = getStatusSteps(order.status);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, { backgroundColor: isDark ? theme.colors.surface : '#F3F4F6' }]}>
          <Icon name="arrow-back" size={20} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Order Details</Text>
        <TouchableOpacity style={[styles.backButton, { backgroundColor: isDark ? theme.colors.surface : '#F3F4F6' }]}>
          <Icon name="help-buoy-outline" size={20} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <Animated.View entering={FadeInUp.duration(600)} style={[styles.card, { backgroundColor: isDark ? theme.colors.surface : '#FFF' }]}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={[styles.cardLabel, { color: theme.colors.textSecondary }]}>Order ID</Text>
              <Text style={[styles.cardValue, { color: theme.colors.text }]}>#{order.id}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: theme.colors.primary + '15' }]}>
               <Text style={[styles.statusBadgeText, { color: theme.colors.primary }]}>{order.status}</Text>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          
          <View style={styles.timeline}>
            {steps.map((step, index) => (
              <View key={step.id} style={styles.timelineStep}>
                <View style={styles.timelineIndicator}>
                  <View style={[
                    styles.timelineDot, 
                    { backgroundColor: step.completed ? theme.colors.primary : theme.colors.border }
                  ]}>
                    {step.completed && <Icon name="checkmark" size={10} color="#FFF" />}
                  </View>
                  {index !== steps.length - 1 && (
                    <View style={[
                      styles.timelineLine, 
                      { backgroundColor: step.completed && steps[index+1].completed ? theme.colors.primary : theme.colors.border }
                    ]} />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={[
                    styles.stepLabel, 
                    { color: step.completed ? theme.colors.text : theme.colors.textSecondary, fontWeight: step.active ? 'bold' : '500' }
                  ]}>
                    {step.label}
                  </Text>
                  {step.time && (
                    <Text style={[styles.stepTime, { color: theme.colors.textSecondary }]}>
                      {new Date(step.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Address Card */}
        <View style={[styles.card, { backgroundColor: isDark ? theme.colors.surface : '#FFF' }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Delivery Address</Text>
          <View style={styles.addressRow}>
            <MIcon name="map-marker-radius" size={24} color={theme.colors.primary} />
            <View style={styles.addressInfo}>
              <Text style={[styles.addressLabel, { color: theme.colors.text }]}>Primary/Saved</Text>
              <Text style={[styles.addressText, { color: theme.colors.textSecondary }]}>
                {order.fullAddress}
              </Text>
            </View>
          </View>
        </View>

        {/* Items Card */}
        <View style={[styles.card, { backgroundColor: isDark ? theme.colors.surface : '#FFF' }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {order.items?.length || 0} {order.items?.length === 1 ? 'Item' : 'Items'}
          </Text>
          {order.items?.map((item, index) => (
            <View key={index} style={[styles.itemRow, index !== 0 && { borderTopWidth: 1, borderTopColor: theme.colors.border + '30', paddingTop: 12 }]}>
              <View style={[styles.itemImageBg, { backgroundColor: isDark ? theme.colors.background : '#F9F9F9' }]}>
                <Image 
                  source={{ uri: (item.product?.image && item.product.image.trim() !== '') ? item.product.image : APP_CONFIG.DEFAULT_PLACEHOLDER }} 
                  style={styles.itemImage} 
                />
              </View>
              <View style={styles.itemMain}>
                <Text style={[styles.itemName, { color: theme.colors.text }]} numberOfLines={1}>{item.product?.name}</Text>
                <Text style={[styles.itemQty, { color: theme.colors.textSecondary }]}>{item.quantity} x ₹{item.price}</Text>
              </View>
              <Text style={[styles.itemTotal, { color: theme.colors.text }]}>₹{item.price * item.quantity}</Text>
            </View>
          ))}
        </View>

        {/* Bill Summary */}
        <View style={[styles.billCard, { backgroundColor: isDark ? theme.colors.surface : '#FFF' }]}>
          <View style={styles.billRow}>
            <Text style={[styles.billLabel, { color: theme.colors.textSecondary }]}>Subtotal</Text>
            <Text style={[styles.billValue, { color: theme.colors.text }]}>₹{order.subtotal}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={[styles.billLabel, { color: theme.colors.textSecondary }]}>Delivery & Handling</Text>
            <Text style={[styles.billValue, { color: theme.colors.text }]}>₹{order.deliveryCharge}</Text>
          </View>
          <View style={styles.billRow}>
             <Text style={[styles.billLabel, { color: '#27AE60' }]}>Promo Discount</Text>
             <Text style={[styles.billValue, { color: '#27AE60' }]}>- ₹{order.discount || 0}</Text>
          </View>
          {order.walletUsed > 0 && (
            <View style={styles.billRow}>
              <Text style={[styles.billLabel, { color: theme.colors.primary }]}>Wallet Deduction</Text>
              <Text style={[styles.billValue, { color: theme.colors.primary }]}>- ₹{order.walletUsed}</Text>
            </View>
          )}
          <View style={[styles.finalDivider, { backgroundColor: theme.colors.border }]} />
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: theme.colors.text }]}>Total Bill</Text>
            <Text style={[styles.totalValue, { color: theme.colors.text }]}>₹{order.totalAmount}</Text>
          </View>
        </View>

        <View style={styles.paymentInfo}>
           <MIcon name="shield-check" size={16} color={theme.colors.textSecondary} />
           <Text style={[styles.paymentText, { color: theme.colors.textSecondary }]}>
             Payment handled securely via {order.paymentMethod?.toUpperCase()}
           </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Bar */}
      {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
        <Animated.View entering={SlideInDown.duration(600)} style={styles.bottomBar}>
          <TouchableOpacity 
            style={[styles.mainBtn, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.navigate('OrderTrackingScreen', { orderId: order.id })}
          >
            <Icon name="navigate" size={20} color="#FFF" />
            <Text style={styles.mainBtnText}>Live Order Tracking</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '900', letterSpacing: -0.5 },
  scrollContent: { padding: 20 },
  card: { borderRadius: 24, padding: 20, marginBottom: 16, elevation: 2, shadowOpacity: 0.05, shadowRadius: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  cardLabel: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  cardValue: { fontSize: 16, fontWeight: 'bold' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  statusBadgeText: { fontSize: 12, fontWeight: '900' },
  divider: { height: 1, marginBottom: 20 },
  timeline: { paddingLeft: 8 },
  timelineStep: { flexDirection: 'row', minHeight: 45 },
  timelineIndicator: { alignItems: 'center', width: 24, marginRight: 16 },
  timelineDot: { width: 14, height: 14, borderRadius: 7, zIndex: 1, justifyContent: 'center', alignItems: 'center' },
  timelineLine: { width: 2, flex: 1, marginTop: -2, marginBottom: -2 },
  timelineContent: { flex: 1, paddingTop: -2 },
  stepLabel: { fontSize: 14, marginBottom: 2 },
  stepTime: { fontSize: 11, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '900', marginBottom: 20 },
  addressRow: { flexDirection: 'row', alignItems: 'center' },
  addressInfo: { flex: 1, marginLeft: 16 },
  addressLabel: { fontSize: 14, fontWeight: '800', marginBottom: 4 },
  addressText: { fontSize: 13, lineHeight: 18 },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  itemImageBg: { width: 54, height: 54, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  itemImage: { width: '70%', height: '70%', resizeMode: 'contain' },
  itemMain: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '700', marginBottom: 4 },
  itemQty: { fontSize: 12, fontWeight: '600' },
  itemTotal: { fontSize: 14, fontWeight: '900' },
  billCard: { borderRadius: 24, padding: 20, marginBottom: 16 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  billLabel: { fontSize: 14, fontWeight: '600' },
  billValue: { fontSize: 14, fontWeight: '800' },
  finalDivider: { height: 1, marginVertical: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 18, fontWeight: '900' },
  totalValue: { fontSize: 20, fontWeight: '900' },
  paymentInfo: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  paymentText: { fontSize: 11, fontWeight: '600' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: 'transparent' },
  mainBtn: { height: 60, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, elevation: 8, shadowOpacity: 0.3, shadowRadius: 15 },
  mainBtnText: { color: '#FFF', fontSize: 16, fontWeight: '900' },
  backBtnSmall: { marginTop: 20, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  errorTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
});

export default OrderDetailsScreen;
