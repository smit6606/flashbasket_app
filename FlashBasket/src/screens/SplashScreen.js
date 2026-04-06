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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar 
        backgroundColor={theme.colors.background}
        barStyle={isDark ? "light-content" : "dark-content"} 
      />
      
      <View style={styles.content}>
        <Animated.View style={[
          styles.logoContainer, 
          { 
            transform: [{ scale: logoScale }],
            opacity: textOpacity 
          }
        ]}>
          <Icon name="lightning-bolt" size={100} color={theme.colors.primary} />
          <View style={styles.basketIconOverlay}>
            <Icon name="basket" size={40} color={theme.colors.text} />
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: textOpacity, transform: [{ translateY: taglineTranslate }] }}>
          <Text style={[styles.logoText, { color: theme.colors.text }]}>
            Flash<Text style={{ color: theme.colors.primary }}>Basket</Text>
          </Text>
          <Text style={[styles.taglineText, { color: theme.colors.textSecondary }]}>Freshness in a Flash</Text>
        </Animated.View>
      </View>
      
      <View style={styles.footer}>
        <Text style={[styles.vLabel, { color: theme.colors.textSecondary, opacity: 0.5 }]}>V 2.5 STABLE</Text>
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
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  basketIconOverlay: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 2,
  },
  logoText: {
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1.5,
    textAlign: 'center',
  },
  taglineText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 3,
    textAlign: 'center',
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
  },
  vLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 3,
  },
});

export default SplashScreen;
