import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../constants/ThemeContext';

const { width } = Dimensions.get('window');
const BOX_SIZE = (width - 72) / 6;

const OTPInput = ({ value, onChange, onComplete }) => {
  const { theme } = useTheme();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);

  const handleTextChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    onChange(newOtp.join(''));

    if (text.length === 1 && index < 5) {
      inputs.current[index + 1].focus();
    }

    if (newOtp.every(char => char !== '')) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <View style={styles.container}>
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          style={[
            styles.input,
            { 
              backgroundColor: theme.colors.surface, 
              borderColor: digit !== '' ? theme.colors.primary : theme.colors.border,
              color: theme.colors.text 
            },
          ]}
          maxLength={1}
          keyboardType="number-pad"
          value={digit}
          onChangeText={(text) => handleTextChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          ref={(ref) => (inputs.current[index] = ref)}
          autoFocus={index === 0}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 32,
  },
  input: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderRadius: 12,
    borderWidth: 1.5,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default OTPInput;
