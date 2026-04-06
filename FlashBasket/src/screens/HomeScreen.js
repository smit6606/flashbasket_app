import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Image, Alert, ActivityIndicator, RefreshControl, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../constants/ThemeContext';
import AppHeader from '../components/AppHeader';
import SearchBar from '../components/SearchBar';
import CategoryFilterRow from '../components/CategoryFilterRow';
import BannerCarousel from '../components/BannerCarousel';
import ProductSection from '../components/ProductSection';
import DynamicCartBar from '../components/DynamicCartBar';
import Footer from '../components/Footer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useUser } from '../redux/UserContext';
import { useCart } from '../redux/CartContext';
import { useAuth } from '../redux/AuthContext';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import AddressModal from '../components/AddressModal';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const { getCartCount, getCartTotal } = useCart();
  
  const { addresses, selectedAddress, setSelectedAddress, deleteAddress } = useUser();
  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  const fetchHomeData = useCallback(async () => {
    try {
      const categoryRes = await categoryService.getAllCategories();
      const catList = categoryRes.data || [];
      setCategories(catList);

      const productRes = await productService.getAllProducts({ limit: 100 });
      const allProducts = productRes.data?.data || productRes.data || [];

      const dynamicSections = catList.map(cat => ({
        id: cat.id,
        title: cat.name,
        data: allProducts.filter(p => p.categoryId === cat.id).slice(0, 8)
      })).filter(section => section.data.length > 0);

      const flashDeals = allProducts.filter(p => p.discount > 0).slice(0, 8);
      
      const finalSections = [];
      if (flashDeals.length > 0) {
        finalSections.push({ id: 'flash', title: 'Flash Deals 🔥', data: flashDeals });
      }
      finalSections.push(...dynamicSections);

      setSections(finalSections);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHomeData();
  };

  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  // Animation for the header background
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AppHeader onLocationPress={() => setShowAddressModal(true)} />
      
      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Setting up your store...</Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
            }
          >
            {/* Search Bar directs to Categories Search */}
            <View style={styles.searchContainer}>
              <SearchBar onPress={() => navigation.navigate('Categories')} />
            </View>

            {/* Quick Category Grid */}
            <View style={styles.categoryHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Shop by Category</Text>
            </View>
            <CategoryFilterRow onCategorySelect={(catId) => {
              if (catId) navigation.navigate('Categories', { categoryId: catId });
            }} />

            {/* Banners */}
            <BannerCarousel />

            {/* Dynamic Sections */}
            {sections.length > 0 ? (
              sections.map((section, index) => (
                <ProductSection 
                  key={section.id} 
                  title={section.title} 
                  data={section.data} 
                  onViewAll={() => navigation.navigate('Categories', { categoryId: section.id, categoryName: section.title })} 
                />
              ))
            ) : (
              <View style={styles.noDataContainer}>
                <Icon name="basket-off-outline" size={80} color={theme.colors.textTertiary} />
                <Text style={[styles.noDataTitle, { color: theme.colors.text }]}>No Products Stocked</Text>
              </View>
            )}

            <Footer theme={theme} />
            <View style={{ height: 160 }} />
          </Animated.ScrollView>

          {/* Sticky Offer Bar and Cart Bar */}
          <DynamicCartBar 
            visible={cartCount > 0} 
            cartCount={cartCount} 
            cartTotal={cartTotal} 
            onCartPress={() => navigation.navigate('CartScreen')} 
            onOfferPress={() => navigation.navigate('OfferScreen')}
          />
        </View>
      )}

      <AddressModal 
        visible={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        addresses={addresses}
        onSelect={(addr) => {
          setSelectedAddress(addr);
          setShowAddressModal(false);
        }}
        onAdd={() => {
          setShowAddressModal(false);
          navigation.navigate('AddAddressScreen');
        }}
        onEdit={(addr) => {
          setShowAddressModal(false);
          navigation.navigate('AddAddressScreen', { address: addr, isEdit: true });
        }}
        onDelete={(id) => {
          Alert.alert(
            'Delete Address',
            'Are you sure you want to delete this address?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => deleteAddress(id) },
            ]
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14, fontWeight: '700', letterSpacing: 1 },
  searchContainer: {
    paddingTop: 8,
    backgroundColor: '#fff', // Or theme based
  },
  categoryHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.5,
  },

  noDataContainer: { padding: 60, alignItems: 'center', justifyContent: 'center' },
  noDataTitle: { fontSize: 20, fontWeight: '900', marginTop: 16, marginBottom: 8 },
});

export default HomeScreen;
