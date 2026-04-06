import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const PremiumOfferBar = ({ cartTotal, visible }) => {
  const { theme } = useTheme();
  
  if (!visible || cartTotal === 0) return null;

  const targetAmount = 599;
  const remaining = Math.max(targetAmount - cartTotal, 0);
  const isUnlocked = remaining === 0;

  return (
    <View style={styles.outerContainer}>
      <View style={styles.offbadgeContainer}>
        <View style={[styles.offBadge, { backgroundColor: '#ff7675' }]}>
          <Text style={styles.offBadgeText}>Offers ^</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        activeOpacity={0.9} 
        style={[styles.container, { backgroundColor: '#1e272e' }]}
      >
        <View style={styles.leftSection}>
          <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <Icon name="percent" size={18} color="#fff" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.titleText}>
              {isUnlocked ? 'Extra ₹50 OFF unlocked!' : 'Unlock extra ₹50 OFF'}
            </Text>
            {!isUnlocked && (
              <Text style={styles.subtitleText}>
                Shop for <Text style={{ fontWeight: '900', color: '#fff' }}>₹{remaining} more</Text>
              </Text>
            )}
          </View>
        </View>
        
        <View style={styles.arrowBtn}>
          <Icon name="chevron-right" size={24} color="#fff" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: width - 24,
    marginHorizontal: 12,
    marginBottom: 8,
    zIndex: 1000,
  },
  offbadgeContainer: {
    alignItems: 'center',
    marginBottom: -10,
    zIndex: 1001,
  },
  offBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    elevation: 5,
    borderWidth: 1.5,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  offBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    justifyContent: 'center',
  },
  titleText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  subtitleText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  arrowBtn: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PremiumOfferBar;
