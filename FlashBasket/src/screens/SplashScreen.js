import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, Animated, Dimensions, Image, ImageBackground } from 'react-native';
import { useTheme } from '../constants/ThemeContext';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const { theme, isDark } = useTheme();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const logoFade = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(logoFade, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <ImageBackground
        source={require('../assets/images/splash_bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <Animated.View style={[
          styles.content,
          {
            opacity: logoFade,
            transform: [{ scale: logoScale }]
          }
        ]}>
          <Image 
            source={require('../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        <View style={styles.footer}>
          <View style={styles.loaderContainer}>
             <Animated.View style={[
               styles.loaderProgress, 
               { 
                 backgroundColor: theme.colors.primary, 
                 width: progressAnim.interpolate({
                   inputRange: [0, 1],
                   outputRange: ['0%', '100%']
                 })
               }
             ]} />
          </View>
          <Text style={styles.versionText}>v1.0.0 • PREMIUM EXPERIENCE</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: width * 0.8,
    height: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    width: width * 0.7,
    alignItems: 'center',
  },
  loaderContainer: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  loaderProgress: {
    height: '100%',
    borderRadius: 10,
  },
  versionText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    color: '#1B1B1B',
    opacity: 0.6,
  },
});

export default SplashScreen;
