import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable, Dimensions } from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import { useFavorites } from '../constants/FavoritesContext';
import { useCart } from '../redux/CartContext';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.44;

const ProductCard = ({ product, width, style, variant = 'previous' }) => {
  // Hooks MUST be at the very top
  const themeContext = useTheme();
  const navigation = useNavigation();
  const favoritesContext = useFavorites();
  const cartContext = useCart();
  
  const { theme } = themeContext;
  const { toggleFavorite, isFavorite } = favoritesContext;
  const { cart, addToCart, updateQuantity } = cartContext;

  // Find this product in the cart
  const cartItem = useMemo(() => {
    return cart?.items?.find(item => item.productId == product.id);
  }, [cart, product.id]);

  const quantity = cartItem ? cartItem.quantity : 0;
  const liked = isFavorite(product.id);
  
  const handleAdd = async () => {
    console.log('[DEBUG] Add to Cart Button Clicked for product:', product.id, product.name);
    try {
      // Pass the product object for optimistic UI update (to show info immediately)
      addToCart(product.id, 1, product);
    } catch (err) {
      console.error('[DEBUG] Error adding to cart:', err);
    }
  };

  const handleIncrease = async () => {
    console.log('[DEBUG] Increase Quantity Button Clicked for item:', cartItem.id);
    try {
      // Pass productId as the 3rd argument for better debouncing tracking
      updateQuantity(cartItem.id, quantity + 1, product.id);
    } catch (err) {
      console.error('[DEBUG] Error increasing quantity:', err);
    }
  };

  const handleDecrease = async () => {
    console.log('[DEBUG] Decrease Quantity Button Clicked for item:', cartItem.id);
    try {
      // Pass productId as the 3rd argument for better debouncing tracking
      updateQuantity(cartItem.id, quantity - 1, product.id);
    } catch (err) {
      console.error('[DEBUG] Error decreasing quantity:', err);
    }
  };
  
  // Calculate savings
  const discountAmount = product.oldPrice ? product.oldPrice - product.price : 0;

  if (!product) return null; // Defensive, but it's after hooks so it's safe

  // --- PREVIOUS DESIGN (for Home) ---
  if (variant === 'previous') {
    return (
      <Animated.View 
        layout={Layout.springify()}
        style={[
          styles.card, 
          { 
            backgroundColor: theme.colors.surface, 
            borderColor: theme.colors.border,
            padding: 8,
          },
          width && { width },
          style
        ]}
      >
        <Pressable onPress={() => navigation.navigate('ProductDetails', { product })}>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: (product.image && product.image.trim() !== '') ? product.image : 'https://via.placeholder.com/150?text=Product' }} 
              style={styles.image} 
              resizeMode="contain" 
            />
            {product.discount > 0 && (
              <View style={[styles.discountTag, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.discountTagText}>{product.discount}% OFF</Text>
              </View>
            )}
          </View>
          
          <View style={styles.content}>
            <Text numberOfLines={2} style={[styles.name, { color: theme.colors.text, fontSize: 12, minHeight: 32 }]}>
              {product.name}
            </Text>
            <Text style={[styles.weight, { color: theme.colors.textSecondary, fontSize: 11, marginBottom: 4 }]}>
              {product.weight || product.size || '1 unit'}
            </Text>
            
            <View style={styles.priceRow}>
              <Text style={[styles.priceText, { color: theme.colors.text, fontWeight: '800', fontSize: 14 }]}>₹{product.price}</Text>
              {product.oldPrice && (
                <Text style={[styles.oldPriceText, { color: theme.colors.textTertiary, fontSize: 11 }]}>
                  ₹{product.oldPrice}
                </Text>
              )}
            </View>
          </View>
        </Pressable>

        <View style={styles.prevAddContainer}>
          {quantity === 0 ? (
            <TouchableOpacity 
              style={[styles.prevAddBtn, { borderColor: theme.colors.primary }]}
              onPress={handleAdd}
            >
              <Text style={[styles.prevAddBtnText, { color: theme.colors.primary }]}>ADD</Text>
            </TouchableOpacity>
          ) : (
            <View style={[styles.prevQtyContainer, { backgroundColor: theme.colors.primary }]}>
              <TouchableOpacity onPress={handleDecrease} style={styles.prevQtyAction}>
                <Icon name="remove" size={14} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.prevQtyNum}>{quantity}</Text>
              <TouchableOpacity onPress={handleIncrease} style={styles.prevQtyAction}>
                <Icon name="add" size={14} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.View>
    );
  }

  // --- MODERN DESIGN (for Categories) ---
  return (
    <Animated.View 
      layout={Layout.springify()}
      style={[
        styles.card, 
        { 
          backgroundColor: theme.colors.surface, 
          borderColor: theme.colors.border,
          height: 240, // Fixed height for consistency in grid
        },
        width && { width },
        style
      ]}
    >
      <Pressable onPress={() => navigation.navigate('ProductDetails', { product })}>
        {/* Favorite Button */}
        <TouchableOpacity 
          style={[styles.favoriteButton, { backgroundColor: theme.colors.surface }]} 
          onPress={() => toggleFavorite(product)}
          activeOpacity={0.7}
        >
          <MIcon 
            name={liked ? "heart" : "heart-outline"} 
            size={16} 
            color={liked ? '#e91e63' : theme.colors.textSecondary} 
          />
        </TouchableOpacity>

        {/* Image Container */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: (product.image && product.image.trim() !== '') ? product.image : 'https://via.placeholder.com/150?text=Product' }} 
            style={styles.image} 
            resizeMode="contain" 
          />
          {product.discount > 0 && (
            <View style={[styles.discountTag, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.discountTagText}>{product.discount}% OFF</Text>
            </View>
          )}
        </View>
        
        {/* Content Area */}
        <View style={styles.content}>
          {/* Price Row */}
          <View style={styles.priceRow}>
            <View style={[styles.priceBadge, { backgroundColor: '#e2f5ea' }]}>
              <Text style={[styles.priceText, { color: '#1a8a4d' }]}>₹{product.price}</Text>
            </View>
            {product.oldPrice && (
              <Text style={[styles.oldPriceText, { color: theme.colors.textTertiary }]}>
                ₹{product.oldPrice}
              </Text>
            )}
          </View>

          {/* Discount Info */}
          {discountAmount > 0 && (
            <View style={styles.discountInfo}>
              <Text style={[styles.savingsText, { color: '#1a8a4d' }]}>
                Save ₹{discountAmount}
              </Text>
            </View>
          )}

          {/* Product Name */}
          <Text numberOfLines={2} style={[styles.name, { color: theme.colors.text }]}>
            {product.name}
          </Text>

          {/* Weight / Size */}
          <Text style={[styles.weight, { color: theme.colors.textSecondary }]}>
            {product.weight || product.size || '1 unit'}
          </Text>
        </View>
      </Pressable>
      
      {/* Add / Quantity Control - Absolute Position over image bottom-right */}
      <View style={styles.actionRowContainer}>
        {quantity === 0 ? (
          <TouchableOpacity 
            style={[styles.circularAddButton, { backgroundColor: theme.colors.white, borderColor: '#e0e0e0', borderWidth: 1 }]}
            onPress={handleAdd}
            activeOpacity={0.7}
          >
            <Text style={{ color: theme.colors.primary, fontWeight: '900', fontSize: 12 }}>ADD</Text>
          </TouchableOpacity>
        ) : (
          <Animated.View 
            entering={FadeIn.duration(200)}
            style={[styles.quantityContainer, { backgroundColor: theme.colors.primary }]}
          >
            <TouchableOpacity onPress={handleDecrease} style={styles.qtyBtn}>
              <Icon name="remove" size={14} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{quantity}</Text>
            <TouchableOpacity onPress={handleIncrease} style={styles.qtyBtn}>
              <Icon name="add" size={14} color="#FFF" />
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    width: CARD_WIDTH,
    borderWidth: 1,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    borderRadius: 15,
    padding: 5,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountTag: {
    position: 'absolute',
    top: 0,
    left: 0,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 4,
  },
  discountTagText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
  },
  content: {
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  priceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priceText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
  },
  oldPriceText: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    fontWeight: '600',
  },
  discountInfo: {
    marginBottom: 6,
  },
  savingsText: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
  },
  dashedLine: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    width: '100%',
    opacity: 0.5,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 17,
    marginBottom: 4,
    minHeight: 34,
  },
  actionRowContainer: {
    position: 'absolute',
    top: CARD_WIDTH - 20, // Position near bottom of image
    right: 8,
    zIndex: 999,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  circularAddButton: {
    height: 36,
    width: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    height: 32,
    width: 80,
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
  },
  // Previous Design Styles
  prevAddContainer: {
    marginTop: 8,
  },
  prevAddBtn: {
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevAddBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  prevQtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 6,
    height: 32,
  },
  prevQtyAction: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevQtyNum: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
});

export default ProductCard;

