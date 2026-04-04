import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../constants/ThemeContext';
import PhoneInput from '../components/PhoneInput';
import ButtonPrimary from '../components/ButtonPrimary';
import AuthHeader from '../components/AuthHeader';
import authService from '../services/authService';
import ErrorModal from '../components/common/ErrorModal';

const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleContinue = async () => {
    if (phoneNumber.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit phone number');
      setErrorVisible(true);
      return;
    }
    
    setLoading(true);
    try {
      const response = await authService.sendOtp(phoneNumber);
      if (response.success) {
        navigation.navigate('OTP', { phone: phoneNumber });
      }
    } catch (error) {
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
      setErrorVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background, paddingBottom: 0 }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
      <View style={styles.topSection}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop' }} 
          style={styles.bannerImage}
        />
        <View style={styles.overlay} />
        <Text style={styles.appName}>FlashBasket</Text>
      </View>

      <View style={[styles.bottomSection, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Quick Commerce in 10 minutes</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Log in or sign up with your phone number</Text>

        <PhoneInput 
          value={phoneNumber} 
          onChangeText={setPhoneNumber} 
          disabled={loading}
        />

        <ButtonPrimary 
          title="Continue" 
          onPress={handleContinue}
          loading={loading}
          disabled={phoneNumber.length !== 10}
        />

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
            By continuing, you agree to our 
            <Text style={{ fontWeight: 'bold', color: theme.colors.text }}> Terms & Conditions</Text>
          </Text>
        </View>
      </View>
      </KeyboardAvoidingView>
      
      <ErrorModal 
        visible={errorVisible}
        message={errorMessage}
        onDismiss={() => setErrorVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  topSection: {
    height: '45%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  bottomSection: {
    flex: 1,
    padding: 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 32,
    textAlign: 'center',
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default LoginScreen;
