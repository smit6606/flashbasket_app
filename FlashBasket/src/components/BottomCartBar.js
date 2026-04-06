import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const BottomCartBar = ({ visible, count, amount, onPress }) => {
  const { theme } = useTheme();

  if (!visible || count === 0) return null;

  return (
    <View style={styles.outerContainer}>
      <TouchableOpacity 
        style={[styles.container, { backgroundColor: '#27ae60' }]}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <View style={styles.leftSection}>
          <View style={styles.badge}>
            <Text style={[styles.badgeText, { color: '#27ae60' }]}>{count}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.amountText}>₹{amount}</Text>
            <Text style={styles.viewCartInfoText}>View Cart</Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <MIcon name="basket" size={24} color="#FFF" />
          <Icon name="chevron-forward" size={22} color="#FFF" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: width,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 70, // Premium large height
    borderRadius: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  badge: {
    backgroundColor: '#FFFFFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  badgeText: {
    fontSize: 16,
    fontWeight: '900',
  },
  priceContainer: {
    justifyContent: 'center',
  },
  amountText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  viewCartInfoText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginTop: -2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});

export default BottomCartBar;
