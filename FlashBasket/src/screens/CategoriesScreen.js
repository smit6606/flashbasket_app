import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../constants/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import CategorySidebar from '../components/CategorySidebar';
import ProductCard from '../components/ProductCard';
import FilterModal from '../components/FilterModal';
import SortModal from '../components/SortModal';

import productService from '../services/productService';
import categoryService from '../services/categoryService';

const CategoriesScreen = () => {
  const { theme } = useTheme();
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

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (activeCategoryId) {
      fetchProducts(activeCategoryId);
    }
  }, [activeCategoryId]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      const catList = response.data || [];
      setCategories(catList);
      if (catList.length > 0) {
        setActiveCategoryId(catList[0].id);
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
      const response = await productService.getProductsByCategory(catId);
      // Correct mapping based on standardized API response { success, message, data: { data: [...] } }
      setProducts(response.data?.data || []);
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

    // Sort
    if (currentSort === 'low-high') result.sort((a, b) => a.price - b.price);
    else if (currentSort === 'high-low') result.sort((a, b) => b.price - a.price);
    else if (currentSort === 'discount') result.sort((a, b) => (b.discount || 0) - (a.discount || 0));

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.topBar, { backgroundColor: theme.colors.white }]}>
        <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
          <Icon name="search-outline" size={20} color={theme.colors.textSecondary} />
          <TextInput
            placeholder={`Search in ${activeCategoryName}...`}
            style={[styles.searchInput, { color: theme.colors.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>
      </View>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ flex: 1 }} />
        ) : (
          <>
            <CategorySidebar
              categories={categories}
              activeCategory={activeCategoryId}
              onCategoryChange={setActiveCategoryId}
            />
    
            <View style={styles.mainContent}>
              <View style={[styles.filterSortRow, { borderBottomColor: theme.colors.border }]}>
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
                <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
                <TouchableOpacity style={styles.actionBtn} onPress={() => setSortVisible(true)}>
                  <Icon name="swap-vertical-outline" size={18} color={theme.colors.primary} />
                  <Text style={[styles.actionText, { color: theme.colors.text }]}>Sort</Text>
                </TouchableOpacity>
              </View>
    
              {productsLoading ? (
                <View style={[styles.emptyContainer, { flex: 1 }]}>
                  <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
              ) : (
                <FlatList
                  data={filteredProducts}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={2}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.listContainer}
                  renderItem={({ item }) => (
                    <View style={styles.productWrapper}>
                      <ProductCard product={item} />
                    </View>
                  )}
                  ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                      <Icon name="basket-outline" size={60} color={theme.colors.textSecondary} />
                      <Text style={[styles.emptyText, { color: theme.colors.textSecondary, marginTop: 12 }]}>
                        No Products Available in this Category
                      </Text>
                      <Text style={[styles.emptySubtitle, { color: theme.colors.textTertiary }]}>
                        Everything you see here is added by the admin.
                      </Text>
                    </View>
                  }
                />
              )}
            </View>
          </>
        )}
      </View>

      <FilterModal visible={filterVisible} onClose={() => setFilterVisible(false)} filters={filters} onApply={setFilters} />
      <SortModal visible={sortVisible} onClose={() => setSortVisible(false)} currentSort={currentSort} onSortSelect={(val) => { setCurrentSort(val); setSortVisible(false); }} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { paddingHorizontal: 16, paddingVertical: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, zIndex: 10 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 45, borderRadius: 12 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, fontWeight: '500' },
  content: { flex: 1, flexDirection: 'row' },
  mainContent: { flex: 1, backgroundColor: '#fff' },
  filterSortRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  iconBadgeWrapper: { position: 'relative' },
  filterBadge: { position: 'absolute', top: -8, right: -8, width: 14, height: 14, borderRadius: 7, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#fff', fontSize: 8, fontWeight: 'bold' },
  actionText: { fontSize: 14, fontWeight: '600', marginLeft: 8 },
  divider: { width: 1, height: 20 },
  listContainer: { padding: 12, paddingBottom: 100 },
  productWrapper: { flex: 1, padding: 4 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100, paddingHorizontal: 20 },
  emptyText: { fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  emptySubtitle: { fontSize: 13, textAlign: 'center', marginTop: 4 },
});

export default CategoriesScreen;
