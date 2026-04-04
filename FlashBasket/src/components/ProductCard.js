import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable, Dimensions } from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import { useFavorites } from '../constants/FavoritesContext';
import Icon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { FadeIn, Layout, FadeInDown } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.44;

const ProductCard = ({ product }) => {
  const { theme } = useTheme();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [quantity, setQuantity] = React.useState(0);

  const handleAdd = () => setQuantity(1);
  const handleIncrease = () => setQuantity(q => q + 1);
  const handleDecrease = () => setQuantity(q => Math.max(0, q - 1));

  const liked = isFavorite(product.id);

  return (
    <Animated.View 
      layout={Layout.springify()}
      style={[styles.card, { 
        backgroundColor: theme.colors.surface, 
        borderColor: theme.colors.border,
        ...theme.shadows.soft,
      }]}
    >
      <TouchableOpacity 
        style={[styles.favoriteButton, { backgroundColor: theme.colors.surface }]} 
        onPress={() => toggleFavorite(product)}
        activeOpacity={0.7}
      >
        <MIcon 
          name={liked ? "heart" : "heart-outline"} 
          size={18} 
          color={liked ? theme.colors.secondary : theme.colors.textSecondary} 
        />
      </TouchableOpacity>

      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.image} />
        {product.discount > 0 && (
          <View style={[styles.discountBadge, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.discountText}>{product.discount}% OFF</Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text numberOfLines={2} style={[styles.name, { color: theme.colors.text }]}>
          {product.name}
        </Text>
        <Text style={[styles.weight, { color: theme.colors.textSecondary }]}>
          {product.weight}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: theme.colors.text }]}>₹{product.price}</Text>
            {product.oldPrice && (
              <Text style={[styles.oldPrice, { color: theme.colors.textTertiary }]}>
                ₹{product.oldPrice}
              </Text>
            )}
          </View>

          <View style={styles.actionContainer}>
            {quantity === 0 ? (
              <TouchableOpacity 
                style={[styles.addButton, { borderColor: theme.colors.primary }]}
                onPress={handleAdd}
                activeOpacity={0.8}
              >
                <Text style={[styles.addButtonText, { color: theme.colors.primary }]}>ADD</Text>
              </TouchableOpacity>
            ) : (
              <Animated.View 
                entering={FadeIn.duration(200)}
                style={[styles.quantityContainer, { backgroundColor: theme.colors.primary }]}
              >
                <Pressable onPress={handleDecrease} style={styles.qtyBtn}>
                  <Icon name="remove" size={14} color="#FFF" />
                </Pressable>
                <Text style={styles.qtyText}>{quantity}</Text>
                <Pressable onPress={handleIncrease} style={styles.qtyBtn}>
                  <Icon name="add" size={14} color="#FFF" />
                </Pressable>
              </Animated.View>
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 8,
    marginBottom: 16,
    marginHorizontal: 8,
    borderWidth: 1,
    width: CARD_WIDTH,
    minHeight: 260,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    borderRadius: 20,
    padding: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1.1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    padding: 10,
  },
  image: {
    width: '95%',
    height: '95%',
    resizeMode: 'contain',
  },
  discountBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomRightRadius: 12,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: 4,
  },
  weight: {
    fontSize: 11,
    marginBottom: 12,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 40,
  },
  priceContainer: {
    justifyContent: 'flex-end',
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
  },
  oldPrice: {
    fontSize: 11,
    textDecorationLine: 'line-through',
    marginTop: -1,
  },
  actionContainer: {
    height: '100%',
    justifyContent: 'flex-end',
  },
  addButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    minWidth: 75,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    height: 36,
    minWidth: 80,
    justifyContent: 'space-between',
    paddingHorizontal: 4,
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
    fontWeight: '800',
  },
});

export default React.memo(ProductCard);
