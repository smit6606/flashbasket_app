import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTheme } from '../constants/ThemeContext';
import { useFavorites } from '../constants/FavoritesContext';
import { useCart } from '../redux/CartContext';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.44;

const ProductCard = ({ product, width, style, variant = 'previous', showBuyAgainLabel = false }) => {
  // Hooks MUST be at the very top
  const { theme, isDark } = useTheme();
  const navigation = useNavigation();
  const favoritesContext = useFavorites();
  const cartContext = useCart();

  const { toggleFavorite, isFavorite } = favoritesContext;
  const { cart, addToCart, updateQuantity } = cartContext;

  // Find this product in the cart
  const cartItem = useMemo(() => {
    return cart?.items?.find(item => item.productId == product.id);
  }, [cart, product.id]);

  const quantity = cartItem ? cartItem.quantity : 0;
  const liked = isFavorite(product.id);

  const handleAdd = async () => {
    try {
      // Pass the product object for optimistic UI update (to show info immediately)
      addToCart(product.id, 1, product);
    } catch (err) {
      console.error('[DEBUG] Error adding to cart:', err);
    }
  };

  const handleIncrease = async () => {
    try {
      // Pass productId as the 3rd argument for better debouncing tracking
      updateQuantity(cartItem.id, quantity + 1, product.id);
    } catch (err) {
      console.error('[DEBUG] Error increasing quantity:', err);
    }
  };

  const handleDecrease = async () => {
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
            <FastImage
              source={{ 
                uri: (product.image && product.image.trim() !== '') ? product.image : 'https://via.placeholder.com/150?text=Product',
                priority: FastImage.priority.normal,
              }}
              style={styles.image}
              resizeMode={FastImage.resizeMode.contain}
            />
            {product.discount > 0 && (
              <View style={[styles.discountTag, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.discountTagText}>{product.discount}% OFF</Text>
              </View>
            )}
            {showBuyAgainLabel && (
              <View style={[styles.buyAgainBadge, { backgroundColor: theme.colors.secondary }]}>
                <Text style={styles.buyAgainBadgeText}>Buy Again</Text>
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
  const savings = product.oldPrice ? product.oldPrice - product.price : 0;

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      layout={Layout.springify()}
      style={[
        styles.modernCard,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
        width && { width },
        style
      ]}
    >
      <Pressable
        onPress={() => navigation.navigate('ProductDetails', { product })}
        style={({ pressed }) => [
          { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }
        ]}
      >
        {/* badges Row */}
        <View style={styles.badgeRow}>
          {product.discount > 0 ? (
            <View style={[styles.modernDiscountTag, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.modernDiscountText}>{product.discount}% OFF</Text>
            </View>
          ) : <View />}
        </View>

        {/* Image Container */}
        <View style={styles.modernImageContainer}>
          <FastImage
            source={{ 
              uri: (product.image && product.image.trim() !== '') ? product.image : 'https://via.placeholder.com/150?text=Product',
              priority: FastImage.priority.normal,
            }}
            style={styles.modernImage}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>

        {/* Content Area */}
        <View style={styles.modernContent}>
          <Text numberOfLines={2} style={[styles.modernName, { color: theme.colors.text }]}>
            {product.name}
          </Text>

          <Text style={[styles.modernWeight, { color: theme.colors.textSecondary }]}>
            {product.weight || product.size || '1 unit'}
          </Text>

          <View style={styles.modernPriceSection}>
            <View style={styles.priceRow}>
              <Text style={[styles.modernPriceText, { color: theme.colors.text }]}>₹{product.price}</Text>
              {product.oldPrice && (
                <Text style={[styles.modernOldPrice, { color: theme.colors.textTertiary }]}>
                  ₹{product.oldPrice}
                </Text>
              )}
            </View>

            {savings > 0 && (
              <View style={[styles.savingsBadge, { backgroundColor: isDark ? theme.colors.primary + '20' : '#ECFDF5' }]}>
                <Text style={[styles.savingsText, { color: isDark ? theme.colors.primary : '#059669' }]}>₹{savings} OFF</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>

      {/* Add / Quantity Control */}
      <View style={styles.modernActionContainer}>
        {quantity === 0 ? (
          <TouchableOpacity
            style={[styles.modernAddBtn, { borderColor: theme.colors.primary }]}
            onPress={handleAdd}
            activeOpacity={0.7}
          >
            <Text style={[styles.modernAddBtnText, { color: theme.colors.primary }]}>ADD</Text>
            <Icon name="add" size={16} color={theme.colors.primary} />
          </TouchableOpacity>
        ) : (
          <View style={[styles.modernQtyContainer, { backgroundColor: theme.colors.primary }]}>
            <TouchableOpacity onPress={handleDecrease} style={styles.modernQtyBtn}>
              <Icon name="remove" size={16} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.modernQtyText}>{quantity}</Text>
            <TouchableOpacity onPress={handleIncrease} style={styles.modernQtyBtn}>
              <Icon name="add" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
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
  buyAgainBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 4,
  },
  buyAgainBadgeText: {
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
  // Modern Premium Styles
  modernCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 8,
    marginBottom: 8,
    marginHorizontal: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    minHeight: 210,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 16,
    marginBottom: 2,
  },
  modernDiscountTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  modernDiscountText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
  },
  popularityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#FEF3C7',
  },
  popularityText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#D97706',
    marginLeft: 2,
  },
  modernImageContainer: {
    width: '100%',
    height: 85,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  modernImage: {
    width: '100%',
    height: '100%',
  },
  modernContent: {
    flex: 1,
  },
  modernName: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    marginBottom: 1,
  },
  modernWeight: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 6,
  },
  modernPriceSection: {
    marginTop: 'auto',
  },
  modernPriceText: {
    fontSize: 14,
    fontWeight: '900',
  },
  modernOldPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    marginLeft: 6,
    fontWeight: '600',
  },
  savingsBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  savingsText: {
    color: '#059669',
    fontSize: 10,
    fontWeight: '800',
  },
  modernActionContainer: {
    marginTop: 8,
  },
  modernAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: 8,
    height: 34,
    gap: 2,
  },
  modernAddBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
  modernQtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    height: 34,
    paddingHorizontal: 2,
  },
  modernQtyBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modernQtyText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
  },
});

export default ProductCard;

