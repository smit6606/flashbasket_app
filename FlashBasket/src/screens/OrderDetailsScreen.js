import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../constants/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import orderService from '../services/orderService';

const OrderDetailsScreen = ({ route, navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    try {
      const data = await orderService.getOrderDetails(orderId);
      setOrder(data.order);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatus = (status) => {
    const statuses = [
      { label: 'Order Placed', completed: true },
      { label: 'Order Packed', completed: ['PACKED', 'SHIPPED', 'DELIVERED'].includes(status) },
      { label: 'Out for Delivery', completed: ['SHIPPED', 'DELIVERED'].includes(status) },
      { label: 'Delivered', completed: status === 'DELIVERED' }
    ];
    return statuses;
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
        <Text style={{ color: theme.colors.text }}>Order not found</Text>
      </SafeAreaView>
    );
  }

  const orderStatusTimeline = getOrderStatus(order.status);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Order Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status Timeline */}
        <View style={[styles.section, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Order Status</Text>
          <View style={styles.timeline}>
            {orderStatusTimeline.map((status, index) => (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[
                    styles.timelineDot, 
                    { backgroundColor: status.completed ? theme.colors.primary : theme.colors.border }
                  ]} />
                  {index !== orderStatusTimeline.length - 1 && (
                    <View style={[
                      styles.timelineLine, 
                      { backgroundColor: status.completed ? theme.colors.primary : theme.colors.border }
                    ]} />
                  )}
                </View>
                <View style={styles.timelineRight}>
                  <Text style={[
                    styles.timelineLabel, 
                    { color: status.completed ? theme.colors.text : theme.colors.textSecondary, fontWeight: status.completed ? 'bold' : 'normal' }
                  ]}>
                    {status.label}
                  </Text>
                  <Text style={[styles.timelineTime, { color: theme.colors.textSecondary }]}>
                    {status.completed && index === 0 ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Order Info */}
        <View style={[styles.section, { backgroundColor: theme.colors.background }]}>
          <View style={styles.sectionRow}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Order ID</Text>
            <Text style={[styles.value, { color: theme.colors.text }]}>#{order.id}</Text>
          </View>
          <View style={styles.sectionRow}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Placed On</Text>
            <Text style={[styles.value, { color: theme.colors.text }]}>{new Date(order.createdAt).toLocaleString()}</Text>
          </View>
          <View style={styles.sectionRow}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Payment Method</Text>
            <Text style={[styles.value, { color: theme.colors.text }]}>Online Payment</Text>
          </View>
        </View>

        {/* Deliver to Section */}
        <View style={[styles.section, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text, marginBottom: 12 }]}>Delivered to</Text>
          <View style={styles.addressContainer}>
            <Icon name="location" size={20} color={theme.colors.primary} />
            <View style={styles.addressTextContainer}>
              <Text style={[styles.addressLabel, { color: theme.colors.text }]}>{order.address_title || 'Address'}</Text>
              <Text style={[styles.addressText, { color: theme.colors.textSecondary }]}>
                {order.full_address}
              </Text>
            </View>
          </View>
        </View>

        {/* Items List */}
        <View style={[styles.section, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text, marginBottom: 16 }]}>
            {order.items?.length || 0} {order.items?.length === 1 ? 'Item' : 'Items'}
          </Text>
          {order.items?.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={[styles.itemImageContainer, { backgroundColor: theme.colors.surface }]}>
                <Image source={{ uri: item.product?.image }} style={styles.itemImage} resizeMode="contain" />
              </View>
              <View style={styles.itemInfo}>
                <Text style={[styles.itemName, { color: theme.colors.text }]} numberOfLines={1}>
                  {item.product?.name}
                </Text>
                <Text style={[styles.itemWeight, { color: theme.colors.textSecondary }]}>
                  {item.quantity} x ₹{item.price}
                </Text>
              </View>
              <Text style={[styles.itemPrice, { color: theme.colors.text }]}>₹{item.price * item.quantity}</Text>
            </View>
          ))}
        </View>

        {/* Bill Summary */}
        <View style={[styles.section, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text, marginBottom: 16 }]}>Bill Details</Text>
          <View style={styles.billRow}>
            <Text style={[styles.billLabel, { color: theme.colors.textSecondary }]}>Item Total</Text>
            <Text style={[styles.billValue, { color: theme.colors.text }]}>₹{order.total_amount - (order.delivery_fee || 0)}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={[styles.billLabel, { color: theme.colors.textSecondary }]}>Delivery Partner Fee</Text>
            <Text style={[styles.billValue, { color: theme.colors.text }]}>₹{order.delivery_fee || 0}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: theme.colors.text }]}>Bill Total</Text>
            <Text style={[styles.totalValue, { color: theme.colors.text }]}>₹{order.total_amount}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.reorderButton, { borderColor: theme.colors.primary, borderWidth: 1 }]}
          onPress={() => alert('Order items added back to cart!')}
        >
          <Text style={[styles.reorderButtonText, { color: theme.colors.primary }]}>Reorder</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  timeline: {
    paddingLeft: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    height: 60,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    zIndex: 1,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: -2,
    marginBottom: -2,
  },
  timelineRight: {
    flex: 1,
  },
  timelineLabel: {
    fontSize: 14,
  },
  timelineTime: {
    fontSize: 12,
    marginTop: 2,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
  addressContainer: {
    flexDirection: 'row',
  },
  addressTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  addressText: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
    padding: 4,
  },
  itemImage: {
    width: '100%',
    height: '100%',
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
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  billLabel: {
    fontSize: 14,
  },
  billValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reorderButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  reorderButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderDetailsScreen;
