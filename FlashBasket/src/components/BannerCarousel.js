import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Animated, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../constants/ThemeContext';
import { useCart } from '../redux/CartContext';

const { width } = Dimensions.get('window');

const BANNERS = [
  {
    id: 1,
    title1: 'FLAT ₹50 OFF',
    title2: 'ON YOUR FIRST ORDER',
    subtitle: 'Use Code: NEW50',
    type: 'OFFER',
    colors: ['#00b09b', '#96c93d'], // Teal to Lime
    image: 'https://cdn-icons-png.flaticon.com/512/3724/3724720.png',
  },
  {
    id: 2,
    title1: 'FRESH FRUITS',
    title2: '& VEGETABLES',
    subtitle: 'Everything at up to 50% OFF',
    type: 'DEALS',
    colors: ['#f85032', '#e73827'], // Reddish
    image: 'https://cdn-icons-png.flaticon.com/512/2329/2329865.png',
  },
  {
    id: 3,
    title1: 'DAIRY & EGGS',
    title2: 'FARM FRESH PRODUCTS',
    subtitle: 'Delivered in 10-15 mins',
    type: 'ESSENTIALS',
    colors: ['#4b6cb7', '#182848'], // Dark Blueish
    image: 'https://cdn-icons-png.flaticon.com/512/2674/2674486.png',
  },
];

const BannerCarousel = () => {
  const { theme } = useTheme();
  const { getCartTotal } = useCart();
  const cartTotal = getCartTotal();
  
  const FREE_DELIVERY_THRESHOLD = 599;
  const remainingForFree = Math.max(0, FREE_DELIVERY_THRESHOLD - cartTotal);

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      let nextIndex = (activeIndex + 1) % (BANNERS.length + (remainingForFree > 0 ? 1 : 0));
      scrollViewRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setActiveIndex(nextIndex);
    }, 4500);
    return () => clearInterval(timer);
  }, [activeIndex, remainingForFree]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { 
      useNativeDriver: false, 
      listener: (event) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        if (index !== activeIndex) setActiveIndex(index);
      }
    }
  );

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={width}
        decelerationRate="fast"
      >
        {/* Static Banners */}
        {BANNERS.map((item, index) => (
          <View key={item.id} style={styles.bannerWrapper}>
            <LinearGradient 
              colors={item.colors} 
              start={{ x: 0, y: 0 }} 
              end={{ x: 1, y: 0 }} 
              style={[styles.imageContainer, theme.shadows.medium]}
            >
              <View style={styles.bannerTextContent}>
                <Text style={styles.typeLabel}>{item.type}</Text>
                <Text style={styles.title1}>{item.title1}</Text>
                <Text style={styles.title2}>{item.title2}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
                
                <TouchableOpacity activeOpacity={0.8} style={styles.ctaButton}>
                  <Text style={[styles.ctaText, { color: item.colors[1] }]}>Shop Now</Text>
                  <Icon name="arrow-right" size={14} color={item.colors[1]} />
                </TouchableOpacity>
              </View>
              
              <FastImage 
                source={{ uri: item.image, priority: FastImage.priority.high }} 
                style={styles.floatingImage} 
                resizeMode={FastImage.resizeMode.contain} 
              />
            </LinearGradient>
          </View>
        ))}

        {/* Dynamic Offer Banner (if threshold not met) */}
        {remainingForFree > 0 && (
          <View style={styles.bannerWrapper}>
            <LinearGradient 
              colors={['#8E2DE2', '#4A00E0']} 
              start={{ x: 0, y: 0 }} 
              end={{ x: 1, y: 0 }} 
              style={[styles.imageContainer, theme.shadows.medium]}
            >
              <View style={styles.bannerTextContent}>
                <Text style={styles.typeLabel}>UNLOCKED OFFER</Text>
                <Text style={styles.title1}>FREE DELIVERY</Text>
                <Text style={styles.title2}>WAITING FOR YOU!</Text>
                <Text style={styles.subtitle}>Shop for ₹{remainingForFree} more to unlock</Text>
                
                <View style={styles.ctaButtonLighter}>
                  <Text style={styles.ctaTextLight}>Keep Shopping</Text>
                </View>
              </View>
              
              <FastImage 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/411/411712.png', priority: FastImage.priority.normal }} 
                style={styles.floatingImage} 
                resizeMode={FastImage.resizeMode.contain} 
              />
            </LinearGradient>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.pagination}>
        {[...BANNERS, ...(remainingForFree > 0 ? [1] : [])].map((_, index) => {
          const indicatorWidth = scrollX.interpolate({
            inputRange: [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ],
            outputRange: [8, 20, 8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange: [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ],
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View 
              key={index} 
              style={[
                styles.dot, 
                { 
                  backgroundColor: theme.colors.primary,
                  width: indicatorWidth,
                  opacity: opacity,
                }
              ]} 
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  bannerWrapper: {
    width: width,
    paddingHorizontal: 16,
  },
  imageContainer: {
    width: '100%',
    height: width * 0.4,
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    padding: 16,
  },
  bannerTextContent: {
    flex: 1,
    justifyContent: 'center',
    zIndex: 2,
  },
  typeLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title1: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 24,
  },
  title2: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    opacity: 0.9,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
    opacity: 0.8,
    marginBottom: 12,
  },
  ctaButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaButtonLighter: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  ctaText: {
    fontSize: 10,
    fontWeight: '900',
    marginRight: 4,
  },
  ctaTextLight: {
    fontSize: 10,
    fontWeight: '900',
    color: '#fff',
  },
  floatingImage: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    width: 140,
    height: 140,
    opacity: 0.9,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  dot: {
    height: 4,
    borderRadius: 2,
    marginHorizontal: 3,
  },
});

export default BannerCarousel;
