import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

const StickyActionBar = ({ onGoToCart, onAddToCart }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { borderTopColor: theme.colors.border }]}>
      <TouchableOpacity 
        style={[styles.cartButton, { backgroundColor: '#F3F4F6' }]} 
        onPress={onGoToCart}
      >
        <View style={styles.cartIconWrapper}>
            <Icon name="cart-outline" size={20} color={theme.colors.text} />
            <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.badgeText}>3</Text>
            </View>
        </View>
        <Text style={[styles.cartButtonText, { color: theme.colors.text }]}>Go to Cart</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.addButton, { backgroundColor: theme.colors.primary }]} 
        onPress={onAddToCart}
      >
        <Text style={styles.addButtonText}>Add to Cart</Text>
        <Icon name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    gap: 12,
    alignItems: 'center',
  },
  cartButton: {
    flex: 1,
    height: 54,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cartButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  addButton: {
    flex: 1.5,
    height: 54,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  cartIconWrapper: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  }
});

export default StickyActionBar;
