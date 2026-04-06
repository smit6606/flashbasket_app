import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../constants/ThemeContext';
import orderService from '../services/orderService';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';

const OrderTrackingScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const { theme, isDark } = useTheme();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOtp, setShowOtp] = useState(false);

  const fetchOrderDetails = async () => {
    try {
      const response = await orderService.getOrderDetails(orderId);
      if (response && response.data) {
        setOrder(response.data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
    const interval = setInterval(fetchOrderDetails, 15000); // Poll every 15 seconds for status updates
    return () => clearInterval(interval);
  }, []);

  const StatusItem = ({ status, isLast = false, currentStatus }) => {
    const statuses = ['Pending', 'Packed', 'Out for Delivery', 'Delivered'];
    const idx = statuses.indexOf(status);
    const currentIdx = statuses.indexOf(currentStatus);
    const isCompleted = idx <= currentIdx;
    const isActive = idx === currentIdx;

    return (
      <View style={styles.statusRow}>
        <View style={styles.indicatorCol}>
          <View style={[
            styles.circle, 
            { backgroundColor: isCompleted ? theme.colors.primary : theme.colors.border }
          ]}>
            <Icon 
              name={isCompleted ? "checkmark" : "ellipse-outline"} 
              size={14} 
              color={isCompleted ? "#fff" : theme.colors.textSecondary} 
            />
          </View>
          {!isLast && <View style={[
            styles.line, 
            { backgroundColor: isCompleted && idx < currentIdx ? theme.colors.primary : theme.colors.border }
          ]} />}
        </View>
        <View style={styles.statusContent}>
          <Text style={[
            styles.statusLabel, 
            { color: isCompleted ? theme.colors.text : theme.colors.textSecondary, fontWeight: isActive ? '800' : '600' }
          ]}>
            {status}
          </Text>
          <Text style={[styles.statusSubtitle, { color: theme.colors.textSecondary }]}>
            {status === 'Pending' && 'Waiting for restaurant/store confirmation'}
            {status === 'Packed' && 'Owner is packing your items'}
            {status === 'Out for Delivery' && 'Our rider is on the way'}
            {status === 'Delivered' && 'Order has been delivered safely'}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.loader, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Live Tracking</Text>
        <TouchableOpacity onPress={fetchOrderDetails}>
          <Icon name="refresh" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.duration(600)} layout={Layout.springify()} style={[styles.orderInfo, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.infoRow}>
            <View>
              <Text style={[styles.orderIdLabel, { color: theme.colors.textSecondary }]}>Order ID</Text>
              <Text style={[styles.orderId, { color: theme.colors.text }]}>{orderId}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: theme.colors.primary + '15' }]}>
              <Text style={[styles.statusBadgeText, { color: theme.colors.primary }]}>{order?.status?.toUpperCase()}</Text>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Icon name="time-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.infoText, { color: theme.colors.text }]}>12-18 Mins</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="wallet-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.infoText, { color: theme.colors.text }]}>{order?.paymentMethod?.toUpperCase()}</Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.timelineSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Order Progress</Text>
          <View style={styles.timeline}>
            <StatusItem status="Pending" currentStatus={order?.status} />
            <StatusItem status="Packed" currentStatus={order?.status} />
            <StatusItem status="Out for Delivery" currentStatus={order?.status} />
            <StatusItem status="Delivered" currentStatus={order?.status} isLast />
          </View>
        </View>

        {order?.status === 'Out for Delivery' && (
          <Animated.View entering={FadeInDown.duration(800)} style={[styles.otpSection, { backgroundColor: theme.colors.primary + '08', borderColor: theme.colors.primary + '20' }]}>
            <View style={styles.otpHeader}>
              <Icon name="shield-checkmark" size={24} color={theme.colors.primary} />
              <Text style={[styles.otpTitle, { color: theme.colors.text }]}>Delivery Verification</Text>
            </View>
            <Text style={[styles.otpDesc, { color: theme.colors.textSecondary }]}>
              Share this secret OTP with our delivery partner only after receiving your items.
            </Text>
            
            {!showOtp ? (
              <TouchableOpacity 
                style={[styles.revealBtn, { backgroundColor: theme.colors.primary }]}
                onPress={() => setShowOtp(true)}
              >
                <Text style={styles.revealBtnText}>Reveal Delivery OTP</Text>
              </TouchableOpacity>
            ) : (
              <View style={[styles.otpBadge, { backgroundColor: 'white', borderColor: theme.colors.primary, borderWidth: 2 }]}>
                 <Text style={[styles.otpToken, { color: theme.colors.primary }]}>{order.otp || '----'}</Text>
              </View>
            )}
            
            <Text style={[styles.securityNote, { color: theme.colors.textSecondary }]}>
              <Icon name="lock-closed" size={12} /> Secure Delivery Protocol
            </Text>
          </Animated.View>
        )}

        {order?.status === 'Delivered' && (
           <TouchableOpacity 
             style={[styles.rateBtn, { borderColor: theme.colors.primary }]}
             onPress={() => navigation.navigate('Home')}
           >
             <Text style={[styles.rateBtnText, { color: theme.colors.primary }]}>Back to Home</Text>
           </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  backBtn: { padding: 4 },
  scrollContainer: { padding: 16 },
  orderInfo: { padding: 20, borderRadius: 24, marginBottom: 24, elevation: 2, borderWidth: 1, borderColor: '#f0f0f0' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderIdLabel: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', marginBottom: 2 },
  orderId: { fontSize: 15, fontWeight: 'bold' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  statusBadgeText: { fontSize: 12, fontWeight: '900' },
  divider: { height: 1, marginVertical: 15, opacity: 0.1 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoText: { fontSize: 13, fontWeight: '700' },
  timelineSection: { padding: 8, marginBottom: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '900', marginBottom: 25 },
  timeline: { marginLeft: 10 },
  statusRow: { flexDirection: 'row', minHeight: 85 },
  indicatorCol: { alignItems: 'center', width: 30 },
  circle: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  line: { width: 2, flex: 1, marginVertical: -4 },
  statusContent: { flex: 1, marginLeft: 18, paddingTop: 2 },
  statusLabel: { fontSize: 16, marginBottom: 4 },
  statusSubtitle: { fontSize: 13, lineHeight: 18 },
  otpSection: { padding: 24, borderRadius: 24, borderWidth: 1, alignItems: 'center', marginTop: 10, borderStyle: 'dashed' },
  otpHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
  otpTitle: { fontSize: 20, fontWeight: '900' },
  otpDesc: { fontSize: 14, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  revealBtn: { paddingHorizontal: 30, paddingVertical: 15, borderRadius: 16, elevation: 4 },
  revealBtnText: { color: '#fff', fontSize: 16, fontWeight: '900' },
  otpBadge: { paddingHorizontal: 40, paddingVertical: 15, borderRadius: 16, marginBottom: 15 },
  otpToken: { fontSize: 32, fontWeight: '900', letterSpacing: 8 },
  securityNote: { fontSize: 11, fontWeight: '700', marginTop: 10 },
  rateBtn: { marginTop: 20, padding: 16, borderRadius: 16, borderWidth: 2, alignItems: 'center' },
  rateBtnText: { fontSize: 16, fontWeight: '800' },
});

export default OrderTrackingScreen;
