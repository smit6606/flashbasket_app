import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { UI_MESSAGES } from '../utils/message';

const Footer = ({ theme }) => {
  return (
    <View style={styles.container}>
      {/* Features Section */}
      <View style={styles.featureRow}>
        <View style={[styles.featureCard, { backgroundColor: theme.colors.surface }]}>
          <Icon name="tag-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.featureText, { color: theme.colors.text }]}>
            {UI_MESSAGES.FEATURES.LOWEST_PRICES}
          </Text>
        </View>
        <View style={[styles.featureCard, { backgroundColor: theme.colors.surface }]}>
          <Icon name="truck-delivery-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.featureText, { color: theme.colors.text }]}>
            {UI_MESSAGES.FEATURES.FREE_DELIVERY}
          </Text>
        </View>
      </View>

      {/* Minimal Footer */}
      <View style={styles.minimalFooter}>
        <Text style={[styles.brandLogo, { color: theme.colors.primary }]}>
          {UI_MESSAGES.FOOTER_BRAND}
        </Text>
        <Text style={[styles.licenseText, { color: theme.colors.textSecondary }]}>
          {UI_MESSAGES.FOOTER_LICENSE}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    alignItems: 'center',
    width: '100%',
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  featureCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  minimalFooter: {
    alignItems: 'center',
    marginTop: 20,
  },
  brandLogo: {
    fontSize: 28,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  licenseText: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },
});

export default Footer;
