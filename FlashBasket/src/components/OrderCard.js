import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

const OrderCard = ({ order, onPress }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.orderId, { color: theme.colors.textSecondary }]}>#{order.id}</Text>
          <Text style={[styles.orderDate, { color: theme.colors.textSecondary }]}> • {order.date}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: theme.colors.primaryLight }]}>
          <Text style={[styles.statusText, { color: theme.colors.primary }]}>{order.status}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.content}>
        <View style={styles.imagesContainer}>
          {order.items.slice(0, 3).map((item, index) => (
            <View key={index} style={[styles.itemImageContainer, { backgroundColor: theme.colors.surface }]}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
            </View>
          ))}
          {order.items.length > 3 && (
            <View style={[styles.moreItems, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.moreText, { color: theme.colors.textSecondary }]}>+{order.items.length - 3}</Text>
            </View>
          )}
        </View>
        <View style={styles.amountContainer}>
          <Text style={[styles.amountLabel, { color: theme.colors.textSecondary }]}>Amount Paid</Text>
          <Text style={[styles.amountValue, { color: theme.colors.text }]}>₹{order.amount}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.itemSummary, { color: theme.colors.text }]}>
          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
        </Text>
        <View style={styles.actionButton}>
          <Text style={[styles.actionText, { color: theme.colors.secondary }]}>View Details</Text>
          <Icon name="chevron-forward" size={16} color={theme.colors.secondary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 12,
    fontWeight: '500',
  },
  orderDate: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginBottom: 12,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  imagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  moreItems: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amountLabel: {
    fontSize: 10,
    marginBottom: 2,
  },
  amountValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 12,
  },
  itemSummary: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 4,
  },
});

export default OrderCard;
