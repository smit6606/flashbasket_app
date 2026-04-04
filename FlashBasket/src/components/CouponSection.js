import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

const CouponSection = ({ onApplyCoupon }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
      <View style={styles.header}>
        <Icon name="pricetags-outline" size={20} color={theme.colors.secondary} />
        <Text style={[styles.title, { color: theme.colors.text }]}>Apply Coupon</Text>
        <TouchableOpacity onPress={onApplyCoupon}>
          <Text style={[styles.applyBtn, { color: theme.colors.secondary }]}>APPLY</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.offersRow}>
        <View style={[styles.offerBadge, { backgroundColor: theme.colors.secondaryLight }]}>
          <Text style={[styles.offerText, { color: theme.colors.secondary }]}>SAVE ₹100</Text>
        </View>
        <View style={[styles.offerBadge, { backgroundColor: theme.colors.primaryLight }]}>
          <Text style={[styles.offerText, { color: theme.colors.primary }]}>FLASH50</Text>
        </View>
        <TouchableOpacity style={styles.viewMore}>
          <Text style={[styles.viewMoreText, { color: theme.colors.textSecondary }]}>View More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
    flex: 1,
  },
  applyBtn: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  offersRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offerBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  offerText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  viewMore: {
    marginLeft: 10,
  },
  viewMoreText: {
    fontSize: 13,
    fontWeight: '500',
  },
});

export default CouponSection;
