import React from 'react';
import { StyleSheet, ActivityIndicator, Pressable, Text } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  interpolateColor
} from 'react-native-reanimated';
import { useTheme } from '../constants/ThemeContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ButtonPrimary = ({ 
  title, 
  onPress, 
  loading, 
  disabled, 
  style, 
  textStyle,
  variant = 'primary' // 'primary', 'secondary', 'outline'
}) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.96);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const getBackgroundColor = () => {
    if (disabled) return theme.colors.border;
    if (variant === 'outline') return 'transparent';
    if (variant === 'secondary') return theme.colors.secondary;
    return theme.colors.primary;
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.textTertiary;
    if (variant === 'outline') return theme.colors.primary;
    return theme.colors.textOnPrimary;
  };

  return (
    <AnimatedPressable
      style={[
        styles.button,
        { 
          backgroundColor: getBackgroundColor(),
          borderWidth: variant === 'outline' ? 1.5 : 0,
          borderColor: theme.colors.primary,
          ...(theme.shadows?.soft || {}),
        },
        animatedStyle,
        style,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[
          styles.text, 
          { color: getTextColor() },
          textStyle
        ]}>
          {title}
        </Text>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default ButtonPrimary;
