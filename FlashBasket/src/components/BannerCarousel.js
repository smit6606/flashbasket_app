import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Image, StyleSheet, Dimensions, Animated, Text } from 'react-native';
import { useTheme } from '../constants/ThemeContext';

const { width } = Dimensions.get('window');

const banners = [
  {
    id: 1,
    image: 'https://img.freepik.com/free-vector/grocery-store-banner-template_23-2148705662.jpg',
    type: 'Best Deals',
  },
  {
    id: 2,
    image: 'https://img.freepik.com/free-vector/flat-grocery-delivery-social-media-promo-template_23-2149102434.jpg',
    type: 'Sponsored',
  },
  {
    id: 3,
    image: 'https://img.freepik.com/free-psd/grocery-store-flyer-template_23-2148694033.jpg',
    type: 'Festival',
  },
  {
    id: 4,
    image: 'https://img.freepik.com/free-vector/flat-grocery-delivery-landing-page-template_23-2149026414.jpg',
    type: 'Co-powered',
  },
];

const BannerCarousel = () => {
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      let nextIndex = (activeIndex + 1) % banners.length;
      scrollViewRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setActiveIndex(nextIndex);
    }, 4000);
    return () => clearInterval(timer);
  }, [activeIndex]);

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
        {banners.map((item, index) => (
          <View key={item.id} style={styles.bannerWrapper}>
            <View style={[styles.imageContainer, theme.shadows.medium]}>
              <Image 
                source={{ uri: item.image || 'https://via.placeholder.com/400x200?text=Offer' }} 
                style={styles.bannerImage} 
                resizeMode="cover" 
              />
              {item.type && (
                <View style={[styles.typeBadge, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                  <Text style={styles.typeText}>{item.type}</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        {banners.map((_, index) => {
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
    height: width * 0.45,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  typeBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 12,
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
