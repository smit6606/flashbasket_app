import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../constants/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProductCard from '../components/ProductCard';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import { useCart } from '../redux/CartContext';
import DynamicCartBar from '../components/DynamicCartBar';
import { ProductCardSkeleton } from '../components/common/SkeletonComponents';
import { Animated } from 'react-native';
import { useRef } from 'react';

const FreshScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const { getCartCount, getCartTotal } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchFreshProducts();
  }, []);

  useEffect(() => {
    if (!loading) {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [loading]);

  const fetchFreshProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [productsRes, categoriesRes] = await Promise.all([
        productService.getAllProducts({ limit: 100 }),
        categoryService.getAllCategories()
      ]);

      const allItems = productsRes.data?.data || productsRes.data || [];
      const categoriesList = categoriesRes.data || [];
      
      // Target categories for Fresh 
      const freshCategoryNames = ['fruits', 'vegetables', 'dairy', 'bakery', 'fresh'];
      
      const freshCategoryIds = categoriesList
        .filter(c => freshCategoryNames.some(name => c.name.toLowerCase().includes(name)))
        .map(c => c.id);

      const freshItems = allItems
        .filter(item => freshCategoryIds.includes(item.categoryId))
        .map(item => ({ ...item, isFresh: true, lifespan: '2-3 Days' }));

      // Fallback if no fresh categories match
      if (freshItems.length === 0) {
        setProducts(allItems.slice(0, 10).map(item => ({ ...item, isFresh: true, lifespan: '2-3 Days' })));
      } else {
        setProducts(freshItems);
      }
    } catch (err) {
      console.error('Error fetching fresh products:', err);
      setError('Could not load fresh products.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Fresh Deliveries</Text>
        <View style={{ width: 24 }} />
      </View>



      <View style={[styles.banner, { backgroundColor: theme.colors.primaryLight }]}>
        <Icon name="leaf" size={20} color={theme.colors.primary} />
        <Text style={[styles.bannerText, { color: theme.colors.primary }]}>
          Short lifespan products (2-3 Days). Guaranteed fresh!
        </Text>
      </View>

      {loading ? (
        <View style={styles.listContent}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
             <View style={styles.productWrapper}><ProductCardSkeleton /></View>
             <View style={styles.productWrapper}><ProductCardSkeleton /></View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
             <View style={styles.productWrapper}><ProductCardSkeleton /></View>
             <View style={styles.productWrapper}><ProductCardSkeleton /></View>
          </View>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Icon name="alert-circle" size={48} color={theme.colors.error} />
          <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
          <TouchableOpacity 
            style={[styles.retryBtn, { backgroundColor: theme.colors.primary }]}
            onPress={fetchFreshProducts}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={fetchFreshProducts} />
            }
            renderItem={({ item }) => (
              <View style={styles.productWrapper}>
                <ProductCard product={item} />
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Icon name="leaf" size={60} color={theme.colors.textSecondary} />
                <Text style={[styles.emptyText, { color: theme.colors.text }]}>No fresh products available.</Text>
              </View>
            }
          />
        </Animated.View>
      )}
      <DynamicCartBar 
        visible={getCartCount() > 0} 
        cartCount={getCartCount()} 
        cartTotal={getCartTotal()} 
        onCartPress={() => navigation.navigate('CartScreen')} 
        onOfferPress={() => navigation.navigate('OfferScreen')}
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  backBtn: {
    padding: 4,
  },
  banner: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '600',
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
    padding: 10,
    paddingBottom: 40,
  },
  productWrapper: {
    flex: 1,
    maxWidth: '50%',
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
  },
});

export default FreshScreen;
