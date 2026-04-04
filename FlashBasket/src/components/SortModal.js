import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../constants/ThemeContext';

const { height } = Dimensions.get('window');

const SortModal = ({ visible, onClose, currentSort, onSortSelect }) => {
  const { theme } = useTheme();

  const options = [
    { label: 'Popularity', value: 'popular', icon: 'trending-up-outline' },
    { label: 'Price: Low to High', value: 'low-high', icon: 'arrow-up-outline' },
    { label: 'Price: High to Low', value: 'high-low', icon: 'arrow-down-outline' },
    { label: 'Discount', value: 'discount', icon: 'gift-outline' },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        <View style={[styles.sheet, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Sort By</Text>
          <View style={styles.content}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionItem,
                  { borderBottomColor: theme.colors.border },
                  currentSort === option.value && { backgroundColor: theme.colors.primaryLight }
                ]}
                onPress={() => onSortSelect(option.value)}
              >
                <View style={styles.optionRow}>
                  <View style={styles.iconContainer}>
                    <Icon name={option.icon} size={20} color={currentSort === option.value ? theme.colors.primary : theme.colors.textSecondary} />
                    <Text style={[
                      styles.optionLabel,
                      { color: currentSort === option.value ? theme.colors.primary : theme.colors.text }
                    ]}>
                      {option.label}
                    </Text>
                  </View>
                  {currentSort === option.value && (
                    <Icon name="checkmark-circle" size={24} color={theme.colors.primary} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    minHeight: height * 0.4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  content: {
    flex: 1,
  },
  optionItem: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 16,
  },
});

export default SortModal;
