import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const OFFERS = [
  { id: 1, code: 'WELCOME50', text: 'Flat ₹50 off', minimumAmount: 499, discountAmount: 50 },
  { id: 2, code: 'MEGA100', text: 'Flat ₹100 off', minimumAmount: 999, discountAmount: 100 },
  { id: 3, code: 'BONUS150', text: 'Flat ₹150 off', minimumAmount: 1499, discountAmount: 150 },
];

const CouponSection = ({ cartTotal, appliedOffer, onApplyOffer }) => {
  const { theme, isDark } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="gift-outline" size={20} color={theme.colors.text} />
        <Text style={[styles.title, { color: theme.colors.text }]}>Offers for you</Text>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {OFFERS.map((offer) => {
          const isUnlocked = cartTotal >= offer.minimumAmount;
          const isApplied = appliedOffer?.id === offer.id;
          const remainingAmount = offer.minimumAmount - cartTotal;

          return (
            <View 
              key={offer.id}
              style={[
                styles.offerCard, 
                { 
                  backgroundColor: theme.colors.surface,
                  borderColor: isApplied ? theme.colors.primary : theme.colors.border,
                  opacity: isUnlocked ? 1 : 0.7
                }
              ]}
            >
              <View style={styles.offerInfo}>
                <View style={[styles.iconContainer, { backgroundColor: isUnlocked ? theme.colors.primary + '20' : '#F0F0F0' }]}>
                  <Icon 
                    name="ticket-percent" 
                    size={20} 
                    color={isUnlocked ? theme.colors.primary : '#999'} 
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text style={[styles.offerCode, { color: theme.colors.text }]}>{offer.code}</Text>
                  <Text style={[styles.offerDesc, { color: theme.colors.textSecondary }]}>{offer.text}</Text>
                </View>
              </View>

              {isUnlocked ? (
                <TouchableOpacity 
                   style={[
                     styles.applyBtn, 
                     { backgroundColor: isApplied ? '#10B981' : theme.colors.primary }
                   ]}
                   onPress={() => onApplyOffer(isApplied ? null : offer)}
                >
                  <Text style={styles.applyBtnText}>{isApplied ? 'APPLIED' : 'APPLY'}</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.lockedContainer}>
                  <Text style={styles.lockedText}>Add ₹{remainingAmount} more</Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  scrollContent: {
    paddingRight: 20,
  },
  offerCard: {
    width: 200,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 12,
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  offerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 10,
  },
  offerCode: {
    fontSize: 14,
    fontWeight: '700',
  },
  offerDesc: {
    fontSize: 11,
    fontWeight: '500',
  },
  applyBtn: {
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  lockedContainer: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  lockedText: {
    color: '#666',
    fontSize: 11,
    fontWeight: '600',
  },
});

export default CouponSection;

