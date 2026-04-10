import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../constants/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import OrderCard from '../components/OrderCard';
import orderService from '../services/orderService';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

import NavHeader from '../components/NavHeader';

const OrderHistoryScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Active', 'Past'];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getOrderHistory();
      setOrders(response.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Error in fetching orders');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    if (activeTab === 'All') return orders;
    if (activeTab === 'Active') {
      return orders.filter(o => ['pending', 'placed', 'packed', 'out for delivery'].includes(o.status?.toLowerCase()));
    }
    if (activeTab === 'Past') {
      return orders.filter(o => ['delivered', 'cancelled'].includes(o.status?.toLowerCase()));
    }
    return orders;
  }, [orders, activeTab]);

  const renderOrder = useCallback(({ item, index }) => (
    <Animated.View entering={FadeInUp.delay(index * 100).duration(400)}>
      <OrderCard 
        order={{
          id: item.id,
          date: new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          amount: item.totalAmount,
          status: item.status,
          items: item.items?.map(subItem => ({
              name: subItem.product?.name,
              quantity: subItem.quantity,
              image: subItem.product?.image,
              price: subItem.price
          }))
        }} 
        onPress={() => navigation.navigate('OrderDetailsScreen', { orderId: item.id })} 
      />
    </Animated.View>
  ), [navigation]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <NavHeader 
        title="My Orders" 
        subtitle={`${orders.length} orders placed so far`}
        rightComponent={
          <TouchableOpacity 
            onPress={fetchOrders}
            style={[styles.backButton, { backgroundColor: isDark ? theme.colors.surface : '#F3F4F6' }]}
          >
            <Icon name="search" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        }
      />


      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map(tab => (
          <TouchableOpacity 
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tab,
              activeTab === tab && { backgroundColor: theme.colors.primary }
            ]}
          >
            <Text style={[
              styles.tabText,
              { color: activeTab === tab ? '#FFF' : theme.colors.textSecondary }
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Fetching your orders...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Icon name="alert-circle-outline" size={64} color={theme.colors.error} />
          <Text style={[styles.errorTitle, { color: theme.colors.text }]}>Oops!</Text>
          <Text style={[styles.errorSubtitle, { color: theme.colors.textSecondary }]}>{error}</Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
            onPress={fetchOrders}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOrder}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={6}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={[styles.emptyIconContainer, { backgroundColor: isDark ? theme.colors.surface : '#F3F4F6' }]}>
                <Icon name="receipt-outline" size={48} color={theme.colors.primary} />
              </View>
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No {activeTab.toLowerCase()} orders</Text>
              <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                {activeTab === 'All' 
                  ? "You haven't placed any orders yet. Start shopping to fill this space!"
                  : `You don't have any ${activeTab.toLowerCase()} orders at the moment.`}
              </Text>
              <TouchableOpacity 
                style={[styles.shopButton, { backgroundColor: theme.colors.primary }]}
                 onPress={() => navigation.navigate('BottomTabs', { screen: 'Home' })}
              >
                <Text style={styles.shopButtonText}>Start Shopping</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '800',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 14,
    fontWeight: '600',
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginTop: 20,
  },
  errorSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 30,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 16,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 60,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginHorizontal: 20,
    marginBottom: 35,
  },
  shopButton: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 18,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  shopButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
  },
});

export default OrderHistoryScreen;
