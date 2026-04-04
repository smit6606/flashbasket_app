import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../constants/ThemeContext';

const AddressCard = ({ address, onSelect, onEdit, onDelete, isSelected }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.colors.background,
          borderColor: isSelected ? theme.colors.primary : theme.colors.border,
          borderWidth: isSelected ? 2 : 1,
        }
      ]}
      onPress={onSelect}
    >
      <View style={styles.iconContainer}>
        <Icon 
          name={address.type === 'Home' ? 'home-outline' : address.type === 'Office' ? 'briefcase-outline' : 'map-marker-outline'} 
          size={24} 
          color={isSelected ? theme.colors.primary : theme.colors.textSecondary} 
        />
      </View>
      
      <View style={styles.details}>
        <View style={styles.header}>
            <Text style={[styles.name, { color: theme.colors.text }]}>{address.name}</Text>
            <TouchableOpacity onPress={onEdit} style={styles.menuButton}>
                <Icon name="dots-vertical" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
        </View>
        <Text style={[styles.address, { color: theme.colors.textSecondary }]} numberOfLines={2}>
          {address.fullAddress}
        </Text>
        <Text style={[styles.pincode, { color: theme.colors.textSecondary }]}>
          {address.city} - {address.pincode}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 16,
    marginTop: 2,
  },
  details: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuButton: {
    padding: 4,
  },
  address: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  pincode: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default AddressCard;
