import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../constants/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProductCard from '../components/ProductCard';
import orderService from '../services/orderService';
import categoryService from '../services/categoryService';
import { useCart } from '../redux/CartContext';
import DynamicCartBar from '../components/DynamicCartBar';
import { BuyAgainSkeleton } from '../components/common/SkeletonComponents';

const BuyAgainScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const { getCartCount, getCartTotal } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([{ id: 'all', name: 'All Items', icon: 'heart' }]);
  const [selectedTab, setSelectedTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchCategories(), fetchFrequentItems()]);
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAllCategories();
      const cats = res.data || [];
      setCategories([{ id: 'all', name: 'All Items', icon: 'heart' }, ...cats]);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchFrequentItems = async () => {
    try {
      setError(null);
      const res = await orderService.getBuyAgainProducts();
      setProducts(res.data || []);
    } catch (err) {
      console.error('Error fetching frequent items:', err);
      setError('Could not load frequent items.');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const filteredProducts = selectedTab === 'all' 
    ? products 
    : products.filter(p => p.categoryId === selectedTab);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Buy Again</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.tabContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.tabScroll}
        >
          {categories.map((cat) => {
            const isActive = selectedTab === cat.id;
            return (
              <TouchableOpacity 
                key={cat.id}
                onPress={() => setSelectedTab(cat.id)}
                style={[
                  styles.tabItem, 
                  { 
                    backgroundColor: isActive ? theme.colors.secondary + '20' : theme.colors.surface,
                    borderColor: isActive ? theme.colors.secondary : theme.colors.border
                  }
                ]}
              >
                {cat.id === 'all' ? (
                  <Icon name="heart" size={16} color={isActive ? theme.colors.secondary : theme.colors.textSecondary} />
                ) : (
                  <MIcon name="shopping-outline" size={16} color={isActive ? theme.colors.secondary : theme.colors.textSecondary} />
                )}
                <Text style={[
                  styles.tabText, 
                  { color: isActive ? theme.colors.secondary : theme.colors.textSecondary }
                ]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {loading ? (
        <BuyAgainSkeleton />
      ) : error ? (
        <View style={styles.center}>
          <Icon name="alert-circle-outline" size={48} color={theme.colors.error} />
          <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
          <TouchableOpacity 
            style={[styles.retryBtn, { backgroundColor: theme.colors.primary }]}
            onPress={fetchData}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
          }
          renderItem={({ item, index }) => (
            <View 
              style={styles.productWrapper}
            >
              <ProductCard product={item} />
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="basket-outline" size={80} color={theme.colors.textTertiary} />
              <Text style={[styles.emptyText, { color: theme.colors.text }]}>No items found in this category.</Text>
            </View>
          }
        />
      )}
      <DynamicCartBar 
        visible={getCartCount() > 0} 
        cartCount={getCartCount()} 
        cartTotal={getCartTotal()} 
        onCartPress={() => navigation.navigate('CartScreen')} 
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
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
  },
  backBtn: {
    padding: 4,
  },
  tabContainer: {
    paddingVertical: 12,
  },
  tabScroll: {
    paddingHorizontal: 16,
    gap: 10,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginTop: 12,
    fontSize: 14,
  },
  retryBtn: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 8,
    paddingBottom: 40,
  },
  productWrapper: {
    flex: 0.5,
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    width: '80%',
  },
});

export default BuyAgainScreen;
