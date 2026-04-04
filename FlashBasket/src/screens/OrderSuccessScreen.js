import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../constants/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import SuccessAnimation from '../components/SuccessAnimation';

const OrderSuccessScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />
      
      <View style={styles.content}>
        <SuccessAnimation />
        
        <Text style={[styles.successTitle, { color: theme.colors.text }]}>Order Placed Successfully!</Text>
        <Text style={[styles.successSubtitle, { color: theme.colors.textSecondary }]}>
          Your order #FB-9284-8274 has been placed and will be delivered in 10-12 minutes.
        </Text>

        <View style={[styles.deliveryInfo, { backgroundColor: theme.colors.surface }]}>
          <Icon name="time-outline" size={24} color={theme.colors.primary} />
          <View style={styles.deliveryTextContainer}>
            <Text style={[styles.deliveryLabel, { color: theme.colors.text }]}>Estimated Delivery</Text>
            <Text style={[styles.deliveryTime, { color: theme.colors.primary }]}>6:45 PM (Today)</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.trackOrderButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('OrderHistoryScreen')}
        >
          <Text style={styles.trackOrderButtonText}>Track Order</Text>
          <Icon name="location-outline" size={20} color="white" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.backHomeButton}
          onPress={() => navigation.popToTop()}
        >
          <Text style={[styles.backHomeButtonText, { color: theme.colors.textSecondary }]}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 24,
  },
  successSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginTop: 40,
    width: '100%',
  },
  deliveryTextContainer: {
    marginLeft: 16,
  },
  deliveryLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  deliveryTime: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  trackOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 16,
  },
  trackOrderButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  backHomeButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  backHomeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrderSuccessScreen;
