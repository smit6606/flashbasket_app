import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../constants/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Skeleton = ({ width, height, borderRadius = 4, style }) => {
  const { isDark } = useTheme();
  const shimmerAnimatedValue = useRef(new Animated.Value(0)).current;

  const BASE_COLOR = isDark ? '#1F1F1F' : '#E0E0E0';
  const HIGHLIGHT_COLOR = isDark ? '#2A2A2A' : '#F5F5F5';

  useEffect(() => {
    const startAnimation = () => {
      shimmerAnimatedValue.setValue(0);
      Animated.loop(
        Animated.timing(shimmerAnimatedValue, {
          toValue: 1,
          duration: 1200,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    };

    startAnimation();
  }, [shimmerAnimatedValue]);

  const numericWidth = typeof width === 'number' ? width : SCREEN_WIDTH;
  const translateX = shimmerAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-numericWidth, numericWidth],
  });

  return (
    <View
      style={[
        styles.container,
        {
          width: width || '100%',
          height: height || 20,
          borderRadius: borderRadius,
          backgroundColor: BASE_COLOR,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <LinearGradient
          colors={[BASE_COLOR, HIGHLIGHT_COLOR, BASE_COLOR]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
});

export default Skeleton;
