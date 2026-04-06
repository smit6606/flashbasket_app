import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../constants/ThemeContext';
import { useAuth } from '../redux/AuthContext';
import { useUser } from '../redux/UserContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileOption = ({ icon, title, subtitle, onPress, theme, color = null }) => (
  <TouchableOpacity style={[styles.option, { borderBottomColor: theme.colors.border }]} onPress={onPress}>
    <View style={[styles.iconContainer, { backgroundColor: theme.colors.surface }]}>
      <Icon name={icon} size={22} color={color || theme.colors.text} />
    </View>
    <View style={styles.optionContent}>
      <Text style={[styles.optionTitle, { color: color || theme.colors.text }]}>{title}</Text>
      {subtitle && <Text style={[styles.optionSubtitle, { color: theme.colors.textSecondary }]}>{subtitle}</Text>}
    </View>
    <Icon name="chevron-right" size={20} color={theme.colors.textSecondary} />
  </TouchableOpacity>
);

const ProfileScreen = ({ navigation }) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, logout } = useAuth();
  const { wallet } = useUser();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
             await logout();
             await AsyncStorage.clear();
             navigation.reset({
                index: 0,
                routes: [{ name: 'Auth' }],
             });
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Settings & Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.profileCard, { backgroundColor: theme.colors.surface }]}>
          <Image 
            source={{ uri: user?.profile_image || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} 
            style={styles.avatar} 
          />
          <View style={styles.profileInfo}>
            <Text style={[styles.userName, { color: theme.colors.text }]}>{user?.name || 'Flash User'}</Text>
            <Text style={[styles.phoneNumber, { color: theme.colors.textSecondary }]}>+91 {user?.phone || '9876543210'}</Text>
          </View>
          <TouchableOpacity 
             style={[styles.editBadge, { backgroundColor: theme.colors.primaryLight }]}
             onPress={() => navigation.navigate('EditProfileScreen')}
          >
             <Icon name="pencil" size={16} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Account Settings</Text>
          <ProfileOption 
            icon="gift-outline" 
            title="Invite & Earn" 
            subtitle={user?.referralCode ? `Your Code: ${user.referralCode}` : 'Loading Code...'} 
            onPress={() => Alert.alert('Your Referral Code', user?.referralCode ? `Share this code with friends to both earn ₹50:\n\n${user.referralCode}` : 'Please try again later')} 
            theme={theme} 
          />
          <ProfileOption 
            icon="map-marker-outline" 
            title="My Addresses" 
            subtitle="Manage your delivery addresses" 
            onPress={() => navigation.navigate('AddressScreen')} 
            theme={theme} 
          />
          <ProfileOption 
            icon="package-variant-closed" 
            title="My Orders" 
            subtitle="Track and view past orders" 
            onPress={() => navigation.navigate('OrderHistoryScreen')} 
            theme={theme} 
          />
          <ProfileOption 
            icon="wallet-outline" 
            title="Flash Wallet" 
            subtitle={`Balance: ₹${wallet?.balance || 0}`} 
            onPress={() => navigation.navigate('WalletScreen')} 
            theme={theme} 
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>App Settings</Text>
          <ProfileOption 
            icon="moon-waning-crescent" 
            title="Appearance" 
            subtitle={isDark ? "Theme: Dark" : "Theme: Light"} 
            onPress={toggleTheme} 
            theme={theme} 
          />
        </View>

        <View style={styles.section}>
          <ProfileOption 
            icon="logout-variant" 
            title="Logout" 
            color={theme.colors.secondary}
            onPress={handleLogout} 
            theme={theme} 
          />
        </View>

        <View style={styles.footer}>
           <Text style={[styles.version, { color: theme.colors.textSecondary }]}>Version 1.0.0 (Production)</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  phoneNumber: {
    fontSize: 14,
    marginTop: 2,
    opacity: 0.8,
  },
  editBadge: {
    padding: 8,
    borderRadius: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  optionSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  version: {
    fontSize: 12,
    opacity: 0.5,
  }
});

export default ProfileScreen;
