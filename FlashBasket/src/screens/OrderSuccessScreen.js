import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../constants/ThemeContext';
import Animated, { 
  FadeInUp, 
  ZoomIn, 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withSequence, 
  withTiming,
  withSpring,
  withDelay,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

const OrderSuccessScreen = ({ navigation, route }) => {
  const { theme, isDark } = useTheme();
  // Safe access to params with a fallback
  const params = route?.params || {};
  const { order = { id: '#0000', totalAmount: '0.00' }, address = null } = params;

  const { width: screenWidth } = useWindowDimensions();
  const maxWidth = screenWidth - 48; // padding 24 left/right

  const buttonScale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: buttonScale.value }
      ],
      width: '100%',
    };
  });

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.content}>
        <Animated.View 
          entering={ZoomIn.duration(1000).springify()} 
          style={[styles.iconBox, { backgroundColor: theme.colors.primary + '10' }]}
        >
          <Animated.View 
            entering={ZoomIn.delay(400).duration(800)}
            style={[styles.innerCircle, { backgroundColor: theme.colors.primary + '20' }]}
          >
            <Icon name="checkmark-circle" size={110} color={theme.colors.primary} />
          </Animated.View>
        </Animated.View>
        
        <Animated.View entering={FadeInUp.delay(300).duration(800)} style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Order Placed Successfully!</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Sit back and relax while we bring your{"\n"}Flash basket to your doorstep.
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
              {address?.fullAddress || order?.fullAddress || 'Selected Address'}
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(700).duration(800)} style={styles.footer}>
          <Animated.View style={animatedButtonStyle}>
            <TouchableOpacity 
              activeOpacity={0.9}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={() => navigation.navigate('OrderTrackingScreen', { orderId: order.id })}
              style={{ width: '100%' }}
            >
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.primary + 'CC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.trackBtn, { shadowColor: theme.colors.primary }]}
              >
                <View style={[StyleSheet.absoluteFill, { borderRadius: 20, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }]}>
                  <View style={styles.btnContent}>
                    <View style={styles.btnIcon}>
                      <Icon name="navigate-circle-outline" size={24} color="#fff" />
                    </View>
                    <View>
                      <Text numberOfLines={1} style={styles.trackBtnText}>Track Your Order</Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
          
          <TouchableOpacity 
            style={[styles.homeBtn]}
            onPress={() => navigation.reset({
              index: 0,
              routes: [{ name: 'BottomTabs', params: { screen: 'Home' } }],
            })}
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
  footer: { width: '100%', gap: 16 },
  trackBtn: { width: '100%', height: 62, borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12 },
  btnContent: { flexDirection: 'row', alignItems: 'center' },
  btnIcon: { marginRight: 10 },
  trackBtnText: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: 1 },
  homeBtn: { width: '100%', height: 56, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  homeBtnText: { fontSize: 16, fontWeight: '700' },
  innerCircle: { width: 130, height: 130, borderRadius: 65, justifyContent: 'center', alignItems: 'center' },
});

export default OrderSuccessScreen;
