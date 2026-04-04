import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../constants/ThemeContext';

const SuccessAnimation = () => {
  const { theme } = useTheme();
  const scaleValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();

    Animated.timing(opacityValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [scaleValue, opacityValue]);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.circle, 
          { 
            backgroundColor: theme.colors.primaryLight,
            transform: [{ scale: scaleValue }],
            opacity: opacityValue,
          }
        ]}
      >
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
          <Icon name="checkmark-circle" size={100} color={theme.colors.primary} />
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SuccessAnimation;
