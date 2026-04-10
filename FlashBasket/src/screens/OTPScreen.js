import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../constants/ThemeContext';
import AuthHeader from '../components/AuthHeader';
import OTPInput from '../components/OTPInput';
import ButtonPrimary from '../components/ButtonPrimary';
import { useAuth } from '../redux/AuthContext';
import authService from '../services/authService';

const OTPScreen = ({ route, navigation }) => {
  const { phone } = route.params;
  const { theme } = useTheme();
  const { loginWithOtp } = useAuth();
  
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async (otpValue = otp) => {
    if (otpValue.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await loginWithOtp(phone, otpValue);
      if (response.success) {
        // If user has no name, they need to complete profile
        if (!response.user || !response.user.name) {
          navigation.navigate('CreateProfile', { phone });
        }
        // Note: If user.name exists, AuthContext update will automatically trigger 
        // navigation to 'Main' via AppNavigation's conditional rendering.
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Invalid OTP, please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setTimer(30);
    try {
      await authService.sendOtp(phone);
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background, paddingBottom: 0 }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
      <AuthHeader onBack={() => navigation.goBack()} />
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Enter OTP</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Sent to <Text style={{ color: theme.colors.text, fontWeight: 'bold' }}>+91 {phone}</Text>
        </Text>

        <OTPInput 
          value={otp} 
          onChange={setOtp} 
          onComplete={(value) => handleVerify(value)}
        />

        <View style={styles.resendContainer}>
          {timer > 0 ? (
            <Text style={[styles.timerText, { color: theme.colors.textSecondary }]}>
              Resend OTP in <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>{timer}s</Text>
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text style={[styles.resendText, { color: theme.colors.primary }]}>Resend OTP</Text>
            </TouchableOpacity>
          )}
        </View>

        <ButtonPrimary 
          title="Verify & Continue" 
          onPress={() => handleVerify()}
          loading={loading}
          disabled={otp.length !== 6}
          style={styles.button}
        />
      </View>
      </KeyboardAvoidingView>
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
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 24,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  timerText: {
    fontSize: 14,
  },
  resendText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 'auto',
    marginBottom: 20,
  },
});

export default OTPScreen;
