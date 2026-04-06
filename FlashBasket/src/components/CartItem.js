import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

const CartItem = ({ item, onIncrease, onDecrease }) => {
  const { theme, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={[styles.imageContainer, { backgroundColor: isDark ? '#1A1A1A' : '#F8F9FA' }]}>
        <Image 
          source={{ uri: item.image || 'https://via.placeholder.com/100?text=Item' }} 
          style={styles.image} 
        />
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={[styles.weight, { color: theme.colors.textSecondary }]}>
          {item.weight || '1 unit'}
        </Text>
        
        <View style={styles.bottomRow}>
          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: theme.colors.text }]}>₹{item.price}</Text>
            {item.oldPrice && (
              <Text style={[styles.oldPrice, { color: theme.colors.textSecondary }]}>
                ₹{item.oldPrice}
              </Text>
            )}
          </View>

          <View style={[styles.quantityContainer, { backgroundColor: theme.colors.primary + '15', borderColor: theme.colors.primary }]}>
            <TouchableOpacity onPress={onDecrease} style={styles.qtyBtn}>
              <Icon name="remove" size={16} color={theme.colors.primary} />
            </TouchableOpacity>
            <Text style={[styles.qtyText, { color: theme.colors.primary }]}>{item.quantity}</Text>
            <TouchableOpacity onPress={onIncrease} style={styles.qtyBtn}>
              <Icon name="add" size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
    lineHeight: 20,
  },
  weight: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 6,
  },
  oldPrice: {
    fontSize: 13,
    textDecorationLine: 'line-through',
    fontWeight: '400',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 6,
    minWidth: 80,
    justifyContent: 'space-between',
  },
  qtyBtn: {
    padding: 2,
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '700',
    marginHorizontal: 8,
  },
});

export default CartItem;

