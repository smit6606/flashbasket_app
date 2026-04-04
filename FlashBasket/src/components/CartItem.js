import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

const CartItem = ({ item, onIncrease, onDecrease }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
      <Image source={{ uri: item.image }} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={[styles.weight, { color: theme.colors.textSecondary }]}>
          {item.weight}
        </Text>
        
        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: theme.colors.text }]}>₹{item.price}</Text>
          {item.oldPrice && (
            <Text style={[styles.oldPrice, { color: theme.colors.textSecondary }]}>
              ₹{item.oldPrice}
            </Text>
          )}
        </View>
      </View>

      <View style={[styles.quantityContainer, { backgroundColor: theme.colors.primary }]}>
        <TouchableOpacity onPress={onDecrease} style={styles.qtyBtn}>
          <Icon name="remove" size={18} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.qtyText}>{item.quantity}</Text>
        <TouchableOpacity onPress={onIncrease} style={styles.qtyBtn}>
          <Icon name="add" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    borderRadius: 8,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  weight: {
    fontSize: 12,
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 6,
  },
  oldPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    minWidth: 90,
    justifyContent: 'space-between',
  },
  qtyBtn: {
    padding: 2,
  },
  qtyText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default CartItem;
