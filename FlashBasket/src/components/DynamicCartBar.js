import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const DynamicCartBar = ({ cartTotal, cartCount, onCartPress, onOfferPress, visible }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  if (!visible || cartCount === 0) return null;

  const targetAmount = 599; // Real target or similar
  const remaining = Math.max(targetAmount - cartTotal, 0);
  const isUnlocked = remaining === 0;

  // Brand Colors
  const PRIMARY_COLOR = '#FF3561';
  const DARK_COLOR = '#1C1C1C';

  return (
    <View style={[styles.outerContainer, { bottom: 0 }]}>
      <View style={styles.row}>
        {/* LEFT: OFFER SECTION (65% width approx) */}
        <View style={styles.offerSection}>
          <View style={styles.offBadgeContainer}>
            <View style={[styles.offBadge, { backgroundColor: PRIMARY_COLOR }]}>
              <Text style={styles.offBadgeText}>Offers ^</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            activeOpacity={0.9} 
            onPress={onOfferPress}
            style={[styles.offerPill, { backgroundColor: DARK_COLOR }]}
          >
            <View style={styles.offerContent}>
              <View style={styles.iconCircle}>
                <Icon name="ticket-percent" size={18} color="#fff" />
              </View>
              <View style={styles.offerTextContainer}>
                <Text style={styles.offerTitle} numberOfLines={1}>
                  {isUnlocked ? 'Extra ₹50 OFF unlocked!' : 'Unlock extra ₹50 OFF'}
                </Text>
                {!isUnlocked && (
                  <Text style={styles.offerSubtitle} numberOfLines={1}>
                    Shop for <Text style={{ fontWeight: '900', color: '#fff' }}>₹{remaining} more</Text>
                  </Text>
                )}
              </View>
              <Icon name="chevron-right" size={20} color="rgba(255,255,255,0.6)" />
            </View>
          </TouchableOpacity>
        </View>

        {/* RIGHT: CART SECTION (Compact width) */}
        <TouchableOpacity 
          activeOpacity={0.9}
          onPress={onCartPress}
          style={[styles.cartPill, { backgroundColor: PRIMARY_COLOR }]}
        >
          <View style={styles.cartContent}>
            <View style={styles.cartIconWrapper}>
              <Icon name="cart-outline" size={24} color="#fff" />
            </View>
            <View style={styles.cartTextContainer}>
              <Text style={styles.cartTitleText}>Cart</Text>
              <Text style={styles.cartItemText}>{cartCount} {cartCount === 1 ? 'item' : 'items'}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    left: 8,
    right: 8,
    zIndex: 9999,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  offerSection: {
    flex: 0.68,
    marginRight: 6,
  },
  offBadgeContainer: {
    alignItems: 'center',
    marginBottom: -8,
    zIndex: 10,
  },
  offBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {
        elevation: 6,
      }
    }),
  },
  offBadgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  offerPill: {
    height: 55,
    borderRadius: 18,
    paddingHorizontal: 10,
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      }
    }),
  },
  offerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  offerTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  offerTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: -0.1,
  },
  offerSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
  cartPill: {
    flex: 0.32,
    height: 55,
    borderRadius: 18,
    justifyContent: 'center',
    paddingHorizontal: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      }
    }),
  },
  cartContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartIconWrapper: {
    marginRight: 4,
  },
  cartTextContainer: {
    justifyContent: 'center',
  },
  cartTitleText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 16,
  },
  cartItemText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    opacity: 0.9,
    lineHeight: 12,
  },
});

export default DynamicCartBar;
