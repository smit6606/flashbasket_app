import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet, Animated, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../constants/ThemeContext';

const placeholders = [
  'Milk and Bread',
  'Fresh Fruits',
  'Shampoo & Conditioner',
  'Crunchy Snacks',
  'Baby Toys',
  'Organic Face Wash',
  'Wireless Earphones',
];

const SearchBar = ({ onPress }) => {
  const { theme } = useTheme();
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out and Slide up
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -10,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        slideAnim.setValue(10); // Start from bottom
        
        // Fade in and Slide to center
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [fadeAnim, slideAnim]);

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={onPress}>
      <View style={[styles.searchBox, { 
        backgroundColor: theme.colors.surface, 
        borderColor: theme.colors.border,
        ...theme.shadows.soft 
      }]}>
        <Icon name="search-outline" size={20} color={theme.colors.primary} style={styles.icon} />
        
        <View style={styles.inputWrapper}>
          <Animated.View style={{ 
            opacity: fadeAnim, 
            transform: [{ translateY: slideAnim }],
            position: 'absolute',
            left: 0,
          }}>
            <Text style={[styles.placeholder, { color: theme.colors.textSecondary }]}>
              Search for "{placeholders[placeholderIndex]}"
            </Text>
          </Animated.View>
          
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            editable={false} // Placeholder for UI only, navigates on press usually
          />
        </View>

        <View style={styles.divider} />
        <Icon name="mic-outline" size={20} color={theme.colors.primary} style={styles.micIcon} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 54,
    borderWidth: 1,
  },
  icon: {
    marginRight: 10,
  },
  inputWrapper: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  placeholder: {
    fontSize: 15,
    fontWeight: '500',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 10,
  },
  micIcon: {
    marginLeft: 4,
  },
});

export default SearchBar;
