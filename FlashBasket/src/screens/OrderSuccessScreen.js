import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../constants/ThemeContext';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';

const OrderSuccessScreen = ({ navigation, route }) => {
  const { order, address } = route.params;
  const { theme, isDark } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.content}>
        <Animated.View entering={ZoomIn.duration(800)} style={[styles.iconBox, { backgroundColor: theme.colors.primary + '15' }]}>
          <Icon name="checkmark-circle" size={100} color={theme.colors.primary} />
        </Animated.View>
        
        <Animated.View entering={FadeInUp.delay(300).duration(800)} style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Order Placed Successfully!</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Your order has been placed and will be delivered shortly.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(500).duration(800)} style={[styles.detailsCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Order ID:</Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>{order.id}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Total Amount:</Text>
            <Text style={[styles.detailValue, { color: theme.colors.primary }]}>₹{order.totalAmount}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Delivering to:</Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]} numberOfLines={2}>
              {address?.fullAddress || address?.full_address}
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(700).duration(800)} style={styles.footer}>
          <TouchableOpacity 
            style={[styles.trackBtn, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.navigate('OrderTrackingScreen', { orderId: order.id })}
          >
            <Text style={styles.trackBtnText}>Track Order</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.homeBtn]}
            onPress={() => navigation.navigate('Main')}
          >
            <Text style={[styles.homeBtnText, { color: theme.colors.textSecondary }]}>Back to Home</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  iconBox: { width: 160, height: 160, borderRadius: 80, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  textContainer: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 24, fontWeight: '900', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 16, textAlign: 'center', lineHeight: 24 },
  detailsCard: { width: '100%', padding: 20, borderRadius: 16, borderWidth: 1, marginBottom: 40 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  detailLabel: { fontSize: 14, fontWeight: '600' },
  detailValue: { fontSize: 14, fontWeight: '800', flex: 1, textAlign: 'right', marginLeft: 20 },
  divider: { height: 1, backgroundColor: '#eee', opacity: 0.5 },
  footer: { width: '100%', gap: 12 },
  trackBtn: { width: '100%', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  trackBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  homeBtn: { width: '100%', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  homeBtnText: { fontSize: 15, fontWeight: '600' },
});

export default OrderSuccessScreen;
