import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

const ProductInfo = ({ name, quantity, price, mrp, discount, rating }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.infoCol}>
          <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={2}>
            {name}
          </Text>
          <Text style={[styles.quantity, { color: theme.colors.textSecondary }]}>
            {quantity}
          </Text>
        </View>
        <View style={[styles.ratingBadge, { backgroundColor: theme.colors.primaryLight }]}>
          <Text style={[styles.ratingText, { color: theme.colors.primary }]}>
            {rating}
          </Text>
          <Icon name="star" size={14} color={theme.colors.primary} />
        </View>
      </View>

      <View style={styles.priceRow}>
        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: theme.colors.text }]}>₹{price}</Text>
          <Text style={[styles.mrp, { color: theme.colors.textSecondary }]}>₹{mrp}</Text>
        </View>
        <View style={[styles.discountBadge, { backgroundColor: theme.colors.secondary }]}>
          <Text style={styles.discountText}>{discount}% OFF</Text>
        </View>
      </View>

      <View style={styles.featureTags}>
        <View style={[styles.tag, { borderColor: theme.colors.border }]}>
          <Icon name="swap-horizontal" size={16} color={theme.colors.primary} />
          <Text style={[styles.tagText, { color: theme.colors.textSecondary }]}>2 Days Exchange</Text>
        </View>
        <View style={[styles.tag, { borderColor: theme.colors.border }]}>
          <Icon name="flash" size={16} color="#FFB800" />
          <Text style={[styles.tagText, { color: theme.colors.textSecondary }]}>Fast Delivery</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoCol: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  quantity: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    marginRight: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
  },
  mrp: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    marginLeft: 8,
    fontWeight: '500',
  },
  discountBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  featureTags: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ProductInfo;
