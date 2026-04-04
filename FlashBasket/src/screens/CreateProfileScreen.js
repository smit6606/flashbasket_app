import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../constants/ThemeContext';
import AuthHeader from '../components/AuthHeader';
import ButtonPrimary from '../components/ButtonPrimary';
import { useUser } from '../redux/UserContext';

const CreateProfileScreen = ({ route, navigation }) => {
  const { phone } = route.params;
  const { theme } = useTheme();
  const { updateProfile } = useUser();
  
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setLoading(true);
    try {
      const response = await updateProfile({ phone, name, password });
      if (response) { // updateProfile returns the created user object if successful
        navigation.replace('Main');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create profile. Please try again.');
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
      <AuthHeader onBack={() => navigation.goBack()} />
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Complete Profile</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Just a few more details to get you started
        </Text>

        <View style={styles.inputSection}>
          <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>FULL NAME</Text>
          <View style={[styles.inputContainer, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
            <TextInput 
              placeholder="Enter your name" 
              placeholderTextColor={theme.colors.textSecondary}
              style={[styles.input, { color: theme.colors.text }]}
              value={name}
              onChangeText={setName}
            />
          </View>
        </View>

        <View style={styles.inputSection}>
          <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>PASSWORD (OPTIONAL)</Text>
          <View style={[styles.inputContainer, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
            <TextInput 
              placeholder="Set a password" 
              placeholderTextColor={theme.colors.textSecondary}
              style={[styles.input, { color: theme.colors.text }]}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>

        <ButtonPrimary 
          title="Create Profile" 
          onPress={handleCreateProfile}
          loading={loading}
          disabled={!name.trim()}
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
    padding: 24,
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  inputContainer: {
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 60,
    justifyContent: 'center',
  },
  input: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 'auto',
    marginBottom: 20,
  },
});

export default CreateProfileScreen;
