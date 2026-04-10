import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../constants/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import CategorySidebar from '../components/CategorySidebar';
import ProductCard from '../components/ProductCard';
import FilterModal from '../components/FilterModal';
import SortModal from '../components/SortModal';
import DynamicCartBar from '../components/DynamicCartBar';
import { CategoriesPageSkeleton, ProductCardSkeleton } from '../components/common/SkeletonComponents';
import { Animated } from 'react-native';

import productService from '../services/productService';
import categoryService from '../services/categoryService';
import { useCart } from '../redux/CartContext';

const CategoriesScreen = ({ route, navigation }) => {
  const { theme, isDark } = useTheme();
  const { getCartCount, getCartTotal } = useCart();
  const initialCategoryId = route?.params?.categoryId;

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  const [currentSort, setCurrentSort] = useState('popular');
  const [filters, setFilters] = useState({
    priceRange: 'All',
    categories: [],
    rating: null,
    discount: null,
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const productsFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!loading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [loading]);

  useEffect(() => {
    if (!productsLoading) {
      productsFadeAnim.setValue(0);
      Animated.timing(productsFadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [productsLoading]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Sync active category when navigating with params
  useEffect(() => {
    if (route?.params?.categoryId) {
      setActiveCategoryId(route.params.categoryId);
      // Clear params so they don't persist if navigated to via bottom tab later
      navigation.setParams({ categoryId: undefined, categoryName: undefined });
    }
  }, [route?.params?.categoryId, navigation]);

  useEffect(() => {
    if (activeCategoryId) {
      fetchProducts(activeCategoryId);
    }
  }, [activeCategoryId]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      const catList = response.data || [];
      const finalCats = [{ id: 'all', name: 'All', image: 'https://cdn-icons-png.flaticon.com/512/3081/3081986.png' }, ...catList];
      setCategories(finalCats);
      
      // Priority: route param > previously active > 'all'
      if (initialCategoryId) {
        setActiveCategoryId(initialCategoryId);
      } else if (!activeCategoryId && finalCats.length > 0) {
        setActiveCategoryId('all');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (catId) => {
    setProductsLoading(true);
    try {
      let response;
      if (catId === 'all') {
        response = await productService.getAllProducts({ limit: 100 });
      } else {
        response = await productService.getProductsByCategory(catId);
      }
      
      setProducts(response.data?.data || response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  const activeCategoryName = useMemo(() => {
    return categories.find(c => c.id === activeCategoryId)?.name || 'Products';
  }, [activeCategoryId, categories]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery) {
      result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Modal filters
    if (filters.priceRange !== 'All') {
      if (filters.priceRange === 'Under ₹100') result = result.filter(p => p.price < 100);
      else if (filters.priceRange === '₹100 - ₹500') result = result.filter(p => p.price >= 100 && p.price <= 500);
      else if (filters.priceRange === '₹500+') result = result.filter(p => p.price > 500);
    }

    if (filters.rating) {
      result = result.filter(p => p.rating >= filters.rating);
    }

    if (filters.discount) {
      result = result.filter(p => (p.discount || 0) >= filters.discount);
    }

    if (filters.categories.length > 0) {
      result = result.filter(p => filters.categories.includes(p.subcategory) || filters.categories.includes(p.type));
    }

    // Sort
    if (currentSort === 'low-high') result.sort((a, b) => a.price - b.price);
    else if (currentSort === 'high-low') result.sort((a, b) => b.price - a.price);
    else if (currentSort === 'discount') result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    else if (currentSort === 'popular') result.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    return result;
  }, [products, searchQuery, filters, currentSort]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.priceRange !== 'All') count++;
    if (filters.rating) count++;
    if (filters.discount) count++;
    if (filters.categories.length > 0) count++;
    return count;
  }, [filters]);

  const renderProductItem = useCallback(({ item }) => (
    <View style={styles.productWrapper}>
      <ProductCard 
        product={item} 
        width="100%" 
        variant="modern"
        style={{ marginHorizontal: 0, marginBottom: 12 }} 
      />
    </View>
  ), []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />
      {/* Top Search Area - Zepto Style */}
      <View style={[styles.topBar, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <View style={[styles.searchContainer, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
          <Icon name="search-outline" size={20} color={theme.colors.textSecondary} />
          <TextInput
            placeholder={`Search for products in ${activeCategoryName}...`}
            style={[styles.searchInput, { color: theme.colors.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>
      </View>

      <View style={{ flex: 1 }}>
        {loading ? (
          <CategoriesPageSkeleton />
        ) : (
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <CategorySidebar
              categories={categories}
              activeCategory={activeCategoryId}
              onCategoryChange={setActiveCategoryId}
            />
    
            <View style={[styles.mainContent, { backgroundColor: theme.colors.background }]}>
              {/* Category Sub-Header */}
              <View style={[styles.categoryHeader, { borderBottomColor: theme.colors.border }]}>
                <Text style={[styles.categoryTitle, { color: theme.colors.text }]}>{activeCategoryName}</Text>
                <Text style={[styles.productCount, { color: theme.colors.textSecondary }]}>
                  {filteredProducts.length} Products
                </Text>
              </View>
 
              {/* Advanced Filter Row */}
              <View style={[styles.filterSortRow, { borderBottomColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => setFilterVisible(true)}>
                  <View style={styles.iconBadgeWrapper}>
                    <Icon name="options-outline" size={18} color={theme.colors.primary} />
                    {activeFilterCount > 0 && (
                      <View style={[styles.filterBadge, { backgroundColor: theme.colors.primary }]}>
                        <Text style={styles.badgeText}>{activeFilterCount}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.actionText, { color: theme.colors.text }]}>Filters</Text>
                </TouchableOpacity>
                <View style={[styles.filterDivider, { backgroundColor: theme.colors.border }]} />
                <TouchableOpacity style={styles.actionBtn} onPress={() => setSortVisible(true)}>
                  <Icon name="swap-vertical-outline" size={18} color={theme.colors.primary} />
                  <Text style={[styles.actionText, { color: theme.colors.text }]}>Sort</Text>
                </TouchableOpacity>
              </View>
    
              {productsLoading ? (
                <View style={styles.listContainer}>
                  <View style={styles.columnWrapper}>
                    <View style={styles.productWrapper}><ProductCardSkeleton variant="modern" /></View>
                    <View style={styles.productWrapper}><ProductCardSkeleton variant="modern" /></View>
                  </View>
                  <View style={styles.columnWrapper}>
                    <View style={styles.productWrapper}><ProductCardSkeleton variant="modern" /></View>
                    <View style={styles.productWrapper}><ProductCardSkeleton variant="modern" /></View>
                  </View>
                </View>
              ) : (
                <Animated.View style={{ flex: 1, opacity: productsFadeAnim }}>
                  <FlatList
                    data={filteredProducts}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                    columnWrapperStyle={styles.columnWrapper}
                    renderItem={renderProductItem}
                    initialNumToRender={6}
                    maxToRenderPerBatch={10}
                    windowSize={5}
                    removeClippedSubviews={true}

                    ListEmptyComponent={
                      <View style={styles.emptyContainer}>
                        <Icon name="basket-outline" size={60} color={theme.colors.textTertiary} />
                        <Text style={[styles.emptyText, { color: theme.colors.text }]}>
                          No Products Found
                        </Text>
                        <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                          Try adjusting your filters or search query.
                        </Text>
                      </View>
                    }
                  />
                </Animated.View>
              )}
            </View>
          </Animated.View>
        )}
        
        <DynamicCartBar 
          visible={getCartCount() > 0} 
          cartCount={getCartCount()} 
          cartTotal={getCartTotal()} 
          onCartPress={() => navigation.navigate('CartScreen')} 
        />
      </View>

      <FilterModal visible={filterVisible} onClose={() => setFilterVisible(false)} filters={filters} onApply={setFilters} />
      <SortModal visible={sortVisible} onClose={() => setSortVisible(false)} currentSort={currentSort} onSortSelect={(val) => { setCurrentSort(val); setSortVisible(false); }} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    borderBottomWidth: 1,
    zIndex: 10,
  },
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 14, 
    height: 48, 
    borderRadius: 14,
    borderWidth: 1,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, fontWeight: '600' },
  content: { flex: 1, flexDirection: 'row' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mainContent: { flex: 1 },
  filterSortRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 12, 
    borderBottomWidth: 1,
  },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  iconBadgeWrapper: { position: 'relative' },
  filterBadge: { 
    position: 'absolute', 
    top: -6, 
    right: -6, 
    width: 15, 
    height: 15, 
    borderRadius: 7.5, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  badgeText: { color: '#fff', fontSize: 8, fontWeight: '900' },
  actionText: { fontSize: 13, fontWeight: '700', marginLeft: 8 },
  filterDivider: { width: 1, height: 24, opacity: 0.5 },
  listContainer: { paddingVertical: 8, paddingHorizontal: 8, paddingBottom: 150 },
  columnWrapper: { justifyContent: 'space-between' },
  productWrapper: { width: '49%', marginBottom: 6 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100, paddingHorizontal: 40 },
  emptyText: { fontSize: 17, fontWeight: '800', marginTop: 16, textAlign: 'center' },
  emptySubtitle: { fontSize: 13, textAlign: 'center', marginTop: 6, lineHeight: 18 },

  categoryHeader: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTitle: { 
    fontSize: 16, 
    fontWeight: '900', 
    letterSpacing: -0.5,
    textTransform: 'uppercase',
  },
  productCount: { 
    fontSize: 11, 
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
});

export default CategoriesScreen;
