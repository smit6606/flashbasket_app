import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar,
  LayoutAnimation,
  Platform,
  UIManager
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../constants/ThemeContext';
import { useFavorites } from '../constants/FavoritesContext';
import { useRecentlyViewed } from '../constants/RecentlyViewedContext';
import { useCart } from '../redux/CartContext';
import Icon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageSlider from '../components/ImageSlider';
import ProductInfo from '../components/ProductInfo';
import FAQAccordion from '../components/FAQAccordion';
import HighlightsSection from '../components/HighlightsSection';
import StickyActionBar from '../components/StickyActionBar';

// LayoutAnimation support for Android handled via Reanimated or native defaults in new architecture

const DUMMY_PRODUCT = {
  id: '1',
  name: 'Organic Hass Avocados (2 units)',
  quantity: 'approx. 300g - 400g',
  price: 249,
  mrp: 350,
  discount: 29,
  rating: 4.8,
  images: [
    'https://cdn.shopify.com/s/files/1/0258/4307/3153/products/Avocado_1_1024x1024.jpg?v=1588667623',
    'https://m.media-amazon.com/images/I/71f65K7f6PL._AC_UF1000,1000_QL80_.jpg',
    'https://www.naturefresh.ca/wp-content/uploads/Nature-Fresh-Farms-Hass-Avocados-e1654110309990.jpg',
    'https://m.media-amazon.com/images/I/41-qfR157rL._SX300_SY300_QL70_FMwebp_.jpg',
    'https://produceoasis.com/wp-content/uploads/2021/04/Avocado.jpg'
  ],
  highlights: [
    'Rich in healthy monounsaturated fats',
    'High in fiber and potassium',
    'Perfect for salads, sandwiches, and guacamole',
    'Freshly picked and naturally ripened'
  ],
  faqs: [
    {
      question: 'How do I know if the avocado is ripe?',
      answer: 'A ripe avocado will yield to gentle pressure in your palm. If it feels firm, it needs more time.'
    },
    {
      question: 'How should I store them?',
      answer: 'Store unripe avocados on the counter. Once ripe, you can refrigerate them to make them last longer.'
    }
  ],
  moreInfo: 'Avocados are a stone fruit with a creamy texture that grow in warm climates. Their potential health benefits include improving digestion, decreasing risk of depression, and protection against cancer. Also known as an alligator pear or butter fruit, the versatile avocado is the only fruit that provides a substantial amount of healthy monounsaturated fatty acids (MUFA).'
};

const ProductDetailsScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const { cart, addToCart, updateQuantity, getCartCount } = useCart();
  const [isMoreInfoExpanded, setIsMoreInfoExpanded] = useState(false);

  const product = route.params?.product || DUMMY_PRODUCT;
  const liked = isFavorite(product.id);

  useEffect(() => { // eslint-disable-next-line react-hooks/exhaustive-deps
    if (product) {
      addToRecentlyViewed(product);
    }
  }, [product]);

  const cartItem = cart?.items?.find(item => item.productId == product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const toggleMoreInfo = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsMoreInfoExpanded(!isMoreInfoExpanded);
  };

  const handleIncrease = () => {
    if (cartItem) {
      updateQuantity(cartItem.id, quantity + 1, product.id);
    }
  };

  const handleDecrease = () => {
    if (cartItem) {
      updateQuantity(cartItem.id, quantity - 1, product.id);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: '#fff' }]}>
        <TouchableOpacity 
          style={styles.headerBtn} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.headerBtn}
            onPress={() => toggleFavorite(product)}
          >
            <MIcon 
              name={liked ? "heart" : "heart-outline"} 
              size={24} 
              color={liked ? theme.colors.secondary : theme.colors.text} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Icon name="share-social-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ImageSlider images={product.images || [product.image]} />
        
        <ProductInfo 
          name={product.name}
          quantity={product.weight || product.quantity}
          price={product.price}
          mrp={product.oldPrice || product.mrp}
          discount={product.discount}
          rating={product.rating || 4.5}
        />

        <HighlightsSection highlights={product.highlights || DUMMY_PRODUCT.highlights} />

        <FAQAccordion faqs={product.faqs || DUMMY_PRODUCT.faqs} />

        {/* More Information Section */}
        <View style={styles.moreInfoContainer}>
          <TouchableOpacity 
            style={styles.moreInfoHeader} 
            onPress={toggleMoreInfo}
            activeOpacity={0.7}
          >
            <Text style={[styles.moreInfoTitle, { color: theme.colors.text }]}>More Information</Text>
            <Icon 
              name={isMoreInfoExpanded ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color={theme.colors.textSecondary} 
            />
          </TouchableOpacity>
          
          {isMoreInfoExpanded && (
            <View style={styles.moreInfoContent}>
              <Text style={[styles.moreInfoText, { color: theme.colors.textSecondary }]}>
                {product.description || DUMMY_PRODUCT.moreInfo}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      {/* Sticky Action Bar */}
      <StickyActionBar 
        onGoToCart={() => navigation.navigate('CartScreen')}
        onAddToCart={() => addToCart(product.id, 1, product)}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
        cartCount={getCartCount()}
        quantity={quantity}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 16,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  moreInfoContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  moreInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moreInfoTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  moreInfoContent: {
    marginTop: 12,
  },
  moreInfoText: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
  },
  spacer: {
    height: 20,
  }
});

export default ProductDetailsScreen;
