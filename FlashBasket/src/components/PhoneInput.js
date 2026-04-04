import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../constants/ThemeContext';

const PhoneInput = ({ value, onChangeText, disabled }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.countryCode, { color: theme.colors.text }]}>+91</Text>
        <View style={[styles.verticalLine, { backgroundColor: theme.colors.border }]} />
        <TextInput 
          placeholder="Enter Phone Number" 
          placeholderTextColor={theme.colors.textSecondary}
          keyboardType="phone-pad"
          style={[styles.input, { color: theme.colors.text }]}
          maxLength={10}
          value={value}
          onChangeText={onChangeText}
          editable={!disabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 60,
  },
  countryCode: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 12,
  },
  verticalLine: {
    width: 1,
    height: 30,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2.5,
  },
});

export default PhoneInput;
