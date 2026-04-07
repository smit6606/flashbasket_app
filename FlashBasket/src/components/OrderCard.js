import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import APP_CONFIG from '../config';
import Icon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const OrderCard = ({ order, onPress }) => {
  const { theme, isDark } = useTheme();

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return '#27AE60';
      case 'out for delivery': return '#F2994A';
      case 'packed': return '#2D9CDB';
      case 'cancelled': return '#EB5757';
      default: return theme.colors.primary;
    }
  };

  const statusColor = getStatusColor(order.status);

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.colors.background, 
          borderColor: isDark ? theme.colors.border : '#F3F4F6',
          shadowColor: '#000',
        }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>
            Order {order.status}
          </Text>
        </View>
        <Text style={[styles.orderDate, { color: theme.colors.textSecondary }]}>
          {order.date}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.itemsSection}>
          <View style={styles.imageStack}>
            {order.items.slice(0, 3).map((item, index) => (
              <View 
                key={index} 
                style={[
                  styles.itemImageWrapper, 
                  { 
                    backgroundColor: isDark ? theme.colors.surface : '#F9FAFB', 
                    marginLeft: index === 0 ? 0 : -20,
                    zIndex: 3 - index,
                    borderColor: isDark ? theme.colors.surface : '#FFF',
                  }
                ]}
              >
                <Image source={{ uri: (item.image && item.image.trim() !== '') ? item.image : APP_CONFIG.DEFAULT_PLACEHOLDER }} style={styles.itemImage} />
              </View>
            ))}
            {order.items.length > 3 && (
              <View style={[styles.moreCount, { backgroundColor: theme.colors.surface, borderColor: isDark ? theme.colors.surface : '#FFF' }]}>
                <Text style={[styles.moreText, { color: theme.colors.textSecondary }]}>
                  +{order.items.length - 3}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.detailsGroup}>
            <Text style={[styles.itemNames, { color: theme.colors.text }]} numberOfLines={1}>
              {order.items.map(i => i.name).join(', ')}
            </Text>
            <View style={styles.metaRow}>
              <Text style={[styles.itemCount, { color: theme.colors.textSecondary }]}>
                {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}
              </Text>
              <View style={[styles.dot, { backgroundColor: theme.colors.border }]} />
              <Text style={[styles.priceText, { color: theme.colors.text }]}>
                ₹{order.amount}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.footer, { borderTopColor: isDark ? theme.colors.border : '#F3F4F6' }]}>
        <View style={styles.idContainer}>
          <MIcon name="identifier" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.orderId, { color: theme.colors.textSecondary }]}>
            {order.id}
          </Text>
        </View>
        <View style={styles.actionLink}>
          <Text style={[styles.viewDetails, { color: theme.colors.primary }]}>View Details</Text>
          <Icon name="chevron-forward" size={14} color={theme.colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
    paddingTop: 16,
    paddingHorizontal: 16,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  orderDate: {
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.6,
  },
  content: {
    marginBottom: 16,
  },
  itemsSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageStack: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 85,
  },
  itemImageWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  itemImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  moreCount: {
    marginLeft: -15,
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    zIndex: 0,
  },
  moreText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  detailsGroup: {
    flex: 1,
    marginLeft: 12,
  },
  itemNames: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginHorizontal: 8,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '800',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
    opacity: 0.7,
  },
  actionLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetails: {
    fontSize: 13,
    fontWeight: '800',
    marginRight: 2,
  },
});

export default OrderCard;
