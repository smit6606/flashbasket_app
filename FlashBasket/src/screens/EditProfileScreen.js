import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../constants/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ButtonPrimary from '../components/ButtonPrimary';
import { useUser } from '../redux/UserContext';
import { useAuth } from '../redux/AuthContext';

const EditProfileScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { updateProfile } = useUser();
  const { user } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setLoading(true);
    try {
      const response = await updateProfile({ name, email });
      if (response) {
        Alert.alert('Success', 'Profile updated successfully!');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
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
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Edit Profile</Text>
      </View>
      
      <View style={styles.content}>
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
          <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>EMAIL</Text>
          <View style={[styles.inputContainer, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
            <TextInput 
              placeholder="Enter your email" 
              placeholderTextColor={theme.colors.textSecondary}
              style={[styles.input, { color: theme.colors.text }]}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={setEmail}
            />
          </View>
        </View>
        
        <View style={styles.inputSection}>
          <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>PHONE NUMBER (READ ONLY)</Text>
          <View style={[styles.inputContainer, { borderColor: theme.colors.border, backgroundColor: theme.colors.background }]}>
            <TextInput 
              style={[styles.input, { color: theme.colors.textSecondary }]}
              value={"+91 " + (user?.phone || '')}
              editable={false}
            />
          </View>
        </View>

        <ButtonPrimary 
          title="Save Changes" 
          onPress={handleUpdateProfile}
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
  container: { flex: 1 },
  keyboardContainer: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 24,
    flex: 1,
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
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    marginTop: 'auto',
    marginBottom: 20,
  },
});

export default EditProfileScreen;
