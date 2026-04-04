import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../constants/ThemeContext';

const OfferProgressBar = ({ currentAmount, targetAmount, offerText }) => {
  const { theme } = useTheme();
  const progress = Math.min(currentAmount / targetAmount, 1);
  const remaining = Math.max(targetAmount - currentAmount, 0);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primaryLight }]}>
      <Text style={[styles.text, { color: theme.colors.primary }]}>
        {remaining > 0 ? `Shop ₹${remaining} more to get ${offerText}` : `You've earned the ${offerText}!`}
      </Text>
      <View style={[styles.barContainer, { backgroundColor: theme.colors.border }]}>
        <View 
          style={[
            styles.progressBar, 
            { 
              backgroundColor: theme.colors.primary, 
              width: `${progress * 100}%` 
            }
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  barContainer: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
});

export default OfferProgressBar;
