import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Image, Alert, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../constants/ThemeContext';
import AppHeader from '../components/AppHeader';
import SearchBar from '../components/SearchBar';
import CategoryFilterRow from '../components/CategoryFilterRow';
import BannerCarousel from '../components/BannerCarousel';
import ProductSection from '../components/ProductSection';
import BottomCartBar from '../components/BottomCartBar';
import Footer from '../components/Footer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useUser } from '../redux/UserContext';
import { useCart } from '../redux/CartContext';
import { useAuth } from '../redux/AuthContext';
import productService from '../services/productService';
import categoryService from '../services/categoryService';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const { selectedAddress } = useUser();
  const { getCartCount, getCartTotal } = useCart();
  
  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const bottomBarTranslateY = useRef(new Animated.Value(0)).current;

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AppHeader onLocationPress={() => navigation.navigate('MapScreen')} />
      
      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Setting up your store...</Text>
        </View>
      ) : (
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
          }
        >
          {/* Welcome Area */}
          <View style={styles.welcomeContainer}>
            <View>
              <Text style={[styles.welcomeText, { color: theme.colors.textSecondary }]}>Good morning,</Text>
              <Text style={[styles.userName, { color: theme.colors.text }]}>
                {user?.name?.split(' ')[0] || 'Flash User'} 👋
              </Text>
            </View>
            <TouchableOpacity style={[styles.couponBadge, { backgroundColor: theme.colors.primaryLight }]}>
              <Icon name="ticket-percent" size={18} color={theme.colors.primary} />
              <Text style={[styles.couponText, { color: theme.colors.primary }]}>3 OFFERS</Text>
            </TouchableOpacity>
          </View>

          <SearchBar />
          
          <View style={styles.bannerContainer}>
            <BannerCarousel />
          </View>

          {/* Quick Category Row - Upgraded Circular Look */}
          <CategoryFilterRow onCategorySelect={(catId) => {
            if (catId) navigation.navigate('CategoryProducts', { categoryId: catId });
          }} />
          
          <View style={styles.divider} />

          {/* Dynamic Sections */}
          {sections.length > 0 ? (
            sections.map((section, index) => (
              <ProductSection 
                key={section.id} 
                title={section.title} 
                data={section.data} 
                onViewAll={() => navigation.navigate('CategoryProducts', { categoryId: section.id, categoryName: section.title })} 
              />
            ))
          ) : (
            <View style={styles.noDataContainer}>
              <Icon name="basket-off-outline" size={80} color={theme.colors.textTertiary} />
              <Text style={[styles.noDataTitle, { color: theme.colors.text }]}>No Products Stocked</Text>
              <Text style={[styles.noDataSubtitle, { color: theme.colors.textSecondary }]}>
                Wait for the admin to add fresh stock.
              </Text>
            </View>
          )}

          <Footer theme={theme} />
          <View style={{ height: 140 }} />
        </Animated.ScrollView>
      )}
      
      <Animated.View style={[styles.bottomBar, { transform: [{ translateY: bottomBarTranslateY }] }]}>
        <BottomCartBar 
          visible={cartCount > 0} 
          count={cartCount} 
          amount={getCartTotal()} 
          onPress={() => navigation.navigate('CartScreen')} 
        />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14, fontWeight: '700', letterSpacing: 1 },
  welcomeContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: { fontSize: 13, fontWeight: '600' },
  userName: { fontSize: 24, fontWeight: '900', letterSpacing: -0.5 },
  couponBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  couponText: { fontSize: 11, fontWeight: '800' },
  bannerContainer: { marginTop: 8 },
  divider: { height: 8, backgroundColor: '#f5f6fa', marginVertical: 8 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  noDataContainer: { padding: 60, alignItems: 'center', justifyContent: 'center' },
  noDataTitle: { fontSize: 20, fontWeight: '900', marginTop: 16, marginBottom: 8 },
  noDataSubtitle: { fontSize: 14, textAlign: 'center', maxWidth: '80%', lineHeight: 20 },
});

export default HomeScreen;
