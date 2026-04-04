import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

const BottomCartBar = ({ visible, count, amount, onPress, scrollY }) => {
  const { theme } = useTheme();

  // Animation for scrolling behavior (optional if handled by parent but good to keep)
  if (!visible) return null;

  return (
    <View style={styles.outerContainer}>
      <View style={[styles.promoContainer, { backgroundColor: '#E3F2FD' }]}>
         <Text style={[styles.promoText, { color: theme.colors.primary }]}>
           Add items worth ₹120 to get FREE gift
         </Text>
      </View>
      <TouchableOpacity 
        style={[styles.container, { backgroundColor: theme.colors.primary }]}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <View style={styles.leftSection}>
          <View style={styles.countBadge}>
            <Text style={[styles.countText, { color: theme.colors.primary }]}>{count} ITEMS</Text>
          </View>
          <View>
            <Text style={styles.amountText}>₹{amount}</Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.viewCartText}>View Cart</Text>
          <Icon name="chevron-forward" size={20} color={theme.colors.white} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    zIndex: 100,
  },
  promoContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    alignItems: 'center',
    marginBottom: -4,
  },
  promoText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  countText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  amountText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCartText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
});

export default BottomCartBar;
