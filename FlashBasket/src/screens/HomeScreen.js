import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Image, Alert, ActivityIndicator, RefreshControl, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
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
import { HomeSkeleton } from '../components/common/SkeletonComponents';

import { useUser } from '../redux/UserContext';
import { useCart } from '../redux/CartContext';
import { useAuth } from '../redux/AuthContext';
import { useData } from '../redux/DataContext';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import orderService from '../services/orderService';
import AddressModal from '../components/AddressModal';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const { getCartCount, getCartTotal } = useCart();
  const { sections: preloadedSections, buyAgainProducts: preloadedBuyAgain, refreshData, isDataLoaded } = useData();
  
  const { addresses, selectedAddress, setSelectedAddress, deleteAddress } = useUser();
  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState(preloadedSections || []);
  const [buyAgainProducts, setBuyAgainProducts] = useState(preloadedBuyAgain || []);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Fade in animation when data is loaded
  useEffect(() => {
    if (isDataLoaded) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [isDataLoaded]);

  // Sync with preloaded data on mount
  useEffect(() => {
    if (preloadedSections?.length > 0) {
      setSections(preloadedSections);
    }
    if (preloadedBuyAgain?.length > 0) {
      setBuyAgainProducts(preloadedBuyAgain);
    }
  }, [preloadedSections, preloadedBuyAgain]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      setSelectedCategory("all");
    }, [])
  );

  const scrollY = useRef(new Animated.Value(0)).current;

  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  // Animation for the header background
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleLocationPress = useCallback(() => {
    setShowAddressModal(true);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />
      <AppHeader onLocationPress={handleLocationPress} />
      
      <View style={{ flex: 1 }}>
        {!isDataLoaded ? (
          <HomeSkeleton />
        ) : (
          <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
                scrollEventThrottle={16}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                }
              >
                {/* Search Bar directs to Global Search */}
                <View style={[styles.searchContainer, { backgroundColor: theme.colors.background }]}>
                  <SearchBar onPress={() => navigation.navigate('SearchScreen')} />
                </View>

                {/* Quick Category Grid */}
                <View style={styles.categoryHeader}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Shop by Category</Text>
                </View>
                <CategoryFilterRow 
                  activeCategory={selectedCategory}
                  onCategorySelect={(catId) => {
                    if (catId) {
                      setSelectedCategory(catId);
                      navigation.navigate('Categories', { categoryId: catId });
                    }
                  }} 
                />

                {/* Banners */}
                <BannerCarousel />

                {/* Buy Again Section */}
                {buyAgainProducts.length > 0 && (
                  <ProductSection 
                    title="Buy Again" 
                    data={buyAgainProducts.slice(0, 8)} 
                    onViewAll={() => navigation.navigate('BuyAgain')} 
                    isBuyAgain={true}
                  />
                )}

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
          </Animated.View>
        )}

          {/* Sticky Offer Bar and Cart Bar */}
          <DynamicCartBar 
            visible={cartCount > 0} 
            cartCount={cartCount} 
            cartTotal={cartTotal} 
            onCartPress={() => navigation.navigate('CartScreen')} 
            onOfferPress={() => navigation.navigate('OfferScreen')}
          />
        </View>

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
