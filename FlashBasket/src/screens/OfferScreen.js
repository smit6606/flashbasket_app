import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../constants/ThemeContext';
import { useCart } from '../redux/CartContext';
import { useNavigation } from '@react-navigation/native';

const OfferScreen = () => {
  const { theme, isDark } = useTheme();
  const { getCartTotal } = useCart();
  const navigation = useNavigation();
  const cartTotal = getCartTotal();

  const offers = [
    {
      id: '1',
      title: '₹50 OFF unlocked',
      subtitle: 'Valid on orders above ₹500',
      minAmount: 500,
      discount: 50,
      icon: 'brightness-percent',
      color: '#4CAF50'
    },
    {
      id: '2',
      title: '₹100 OFF unlocked',
      subtitle: 'Valid on orders above ₹999',
      minAmount: 999,
      discount: 100,
      icon: 'brightness-percent',
      color: '#4CAF50'
    },
    {
      id: '3',
      title: 'Free Delivery',
      subtitle: 'Valid on orders above ₹199',
      minAmount: 199,
      discount: 'FREE',
      icon: 'moped',
      color: '#2196F3'
    },
    {
      id: '4',
      title: '₹300 OFF',
      subtitle: 'Add more to unlock this mega discount',
      minAmount: 2500,
      discount: 300,
      icon: 'lock-open-outline',
      color: '#FF9800'
    }
  ];

  const activeOffers = offers.filter(o => cartTotal >= o.minAmount);
  const lockedOffers = offers.filter(o => cartTotal < o.minAmount);

  const renderOfferCard = ({ item, isLocked }) => (
    <TouchableOpacity 
      key={item.id}
      activeOpacity={isLocked ? 1 : 0.7}
      style={[
        styles.offerCard, 
        { 
          backgroundColor: isDark ? '#2c2c2c' : '#fff',
          borderColor: isLocked ? (isDark ? '#3d3d3d' : '#eee') : item.color,
          opacity: isLocked ? 0.6 : 1
        }
      ]}
      onPress={() => {
        if (!isLocked) {
          // In a real app, this would apply the coupon
          alert(`Applied: ${item.title}`);
          navigation.goBack();
        }
      }}
    >
      <View style={[styles.iconContainer, { backgroundColor: isLocked ? '#f5f5f5' : item.color + '20' }]}>
        <MIcon name={isLocked ? 'lock' : item.icon} size={24} color={isLocked ? '#999' : item.color} />
      </View>
      
      <View style={styles.offerInfo}>
        <Text style={[styles.offerTitle, { color: theme.colors.text }]}>{item.title}</Text>
        <Text style={[styles.offerSubtitle, { color: theme.colors.textSecondary }]}>{item.subtitle}</Text>
        {isLocked && (
          <Text style={styles.lockText}>Add ₹{item.minAmount - cartTotal} more to unlock</Text>
        )}
      </View>

      {!isLocked && (
        <View style={[styles.applyBadge, { backgroundColor: item.color }]}>
          <Text style={styles.applyText}>APPLY</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MIcon name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Offers & Coupons</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={[
          { title: 'ACTIVE OFFERS', data: activeOffers, isLocked: false },
          { title: 'LOCKED OFFERS', data: lockedOffers, isLocked: true }
        ]}
        keyExtractor={(item) => item.title}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View key={item.title}>
            <Text style={[styles.sectionTitle, { color: item.isLocked ? theme.colors.textSecondary : theme.colors.primary }]}>
              {item.title}
            </Text>
            {item.data.length > 0 ? (
              item.data.map(offer => renderOfferCard({ item: offer, isLocked: item.isLocked }))
            ) : (
              <Text style={styles.emptyText}>No {item.title.toLowerCase()} available</Text>
            )}
            <View style={{ height: 20 }} />
          </View>
        )}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  listContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 12,
  },
  offerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  offerInfo: {
    flex: 1,
  },
  offerTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  offerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  lockText: {
    fontSize: 11,
    color: '#FF5722',
    fontWeight: '700',
    marginTop: 4,
  },
  applyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  applyText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  }
});

export default OfferScreen;
