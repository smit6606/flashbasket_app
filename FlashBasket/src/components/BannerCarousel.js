import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Image, StyleSheet, Dimensions, Animated } from 'react-native';
import { useTheme } from '../constants/ThemeContext';

const { width } = Dimensions.get('window');

const banners = [
  'https://img.freepik.com/free-photo/view-assortment-with-food-basket_23-2148417032.jpg', // Grocery
  'https://img.freepik.com/free-psd/supermarket-shopping-banner-concept_23-2148507204.jpg', // Electronics/Multi
  'https://img.freepik.com/free-photo/beauty-products-arrangement-flat-lay_23-2148873832.jpg', // Beauty
  'https://img.freepik.com/free-photo/fresh-vegetables-with-wicker-basket-organic-food-concept_127032-159.jpg', // Fresh
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
    }, 3000);
    return () => clearInterval(timer);
  }, [activeIndex]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false, listener: (event) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setActiveIndex(index);
    }}
  );

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {banners.map((item, index) => (
          <View key={index} style={styles.bannerWrapper}>
            <Image 
              source={{ uri: item }} 
              style={styles.bannerImage} 
              resizeMode="cover" 
            />
          </View>
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        {banners.map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.dot, 
              { 
                backgroundColor: activeIndex === index ? theme.colors.primary : theme.colors.border,
                width: activeIndex === index ? 20 : 8
              }
            ]} 
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  scrollContent: {
  },
  bannerWrapper: {
    width: width,
    height: width * 0.45,
    paddingHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default BannerCarousel;
