import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../constants/ThemeContext';
import ProductCard from '../components/ProductCard';
import productService from '../services/productService';
import DynamicCartBar from '../components/DynamicCartBar';
import { useCart } from '../redux/CartContext';

const { width } = Dimensions.get('window');

const SearchScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const { getCartCount, getCartTotal } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    'Milk', 'Bread', 'Organic Eggs', 'Chips', 'Soft Drinks'
  ]);

  const searchProducts = useCallback(async (query) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const response = await productService.getAllProducts({ query: query.trim(), limit: 50 });
      setResults(response.data?.data || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        searchProducts(searchQuery);
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, searchProducts]);

  const handleRecentClick = (item) => {
    setSearchQuery(item);
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />
      {/* Search Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        
        <View style={[styles.searchBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Icon name="search-outline" size={20} color={theme.colors.primary} />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            placeholder="Search for groceries, snacks..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close-circle" size={20} color={theme.colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Searching...</Text>
          </View>
        ) : searchQuery.length === 0 ? (
          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent Searches</Text>
              <TouchableOpacity onPress={() => setRecentSearches([])}>
                <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>Clear</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.recentList}>
              {recentSearches.map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.recentItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                  onPress={() => handleRecentClick(item)}
                >
                  <Icon name="time-outline" size={16} color={theme.colors.textSecondary} />
                  <Text style={[styles.recentText, { color: theme.colors.text }]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : results.length > 0 ? (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            columnWrapperStyle={styles.columnWrapper}
            renderItem={({ item }) => (
              <View style={styles.productWrapper}>
                <ProductCard 
                  product={item} 
                  width="100%" 
                  variant="modern"
                  style={{ marginHorizontal: 0, marginBottom: 12 }} 
                />
              </View>
            )}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="search-outline" size={80} color={theme.colors.textTertiary} />
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No results found</Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
              We couldn't find anything for "{searchQuery}"
            </Text>
          </View>
        )}
      </View>

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
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: { marginRight: 12 },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  content: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontWeight: '700' },
  recentSection: { padding: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800' },
  recentList: { flexDirection: 'row', flexWrap: 'wrap' },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
    marginBottom: 10,
  },
  recentText: { marginLeft: 6, fontWeight: '600' },
  listContainer: { padding: 12, paddingBottom: 100 },
  columnWrapper: { justifyContent: 'space-between' },
  productWrapper: { width: '48.5%' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '900', marginTop: 16 },
  emptySubtitle: { fontSize: 14, textAlign: 'center', marginTop: 8 },
});

export default SearchScreen;
