import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Animated, Easing } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../constants/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SplashScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  
  // Animation values
  const logoScale = new Animated.Value(0);
  const textOpacity = new Animated.Value(0);
  const taglineTranslate = new Animated.Value(20);

  useEffect(() => {
    // Start animations
    Animated.sequence([
      Animated.delay(300),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(taglineTranslate, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      
      setTimeout(() => {
        if (token) {
          navigation.replace('Main');
        } else {
          navigation.replace('Auth');
        }
      }, 3000);
    };

    checkAuth();
  }, [navigation]);

  return (
    // Medium Dark background for best readability of logo and text
    <View style={[styles.container, { backgroundColor: '#1e272e' }]}>
      <StatusBar 
        backgroundColor="#1e272e" 
        barStyle="light-content" 
      />
      
      <View style={styles.content}>
        <Animated.View style={[
          styles.logoContainer, 
          { transform: [{ scale: logoScale }] }
        ]}>
          <Icon name="basket-flash" size={100} color={theme.colors.primary} />
        </Animated.View>

        <Animated.Text style={[
          styles.logoText, 
          { opacity: textOpacity }
        ]}>
          Flash<Text style={{ color: theme.colors.primary }}>Basket</Text>
        </Animated.Text>

        <Animated.View style={[
          styles.taglineContainer,
          { 
            opacity: textOpacity,
            transform: [{ translateY: taglineTranslate }]
          }
        ]}>
          <Text style={styles.taglineText}>Freshness in a Flash</Text>
        </Animated.View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.vLabel}>V 2.5 STABLE</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 40,
  },
  logoText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1.5,
  },
  taglineContainer: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  taglineText: {
    fontSize: 14,
    color: '#dfe6e9',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
  },
  vLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.3)',
    fontWeight: '800',
    letterSpacing: 3,
  },
});

export default SplashScreen;
