import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../constants/ThemeContext';
import ButtonPrimary from './ButtonPrimary';

const { height } = Dimensions.get('window');

const FilterModal = ({ visible, onClose, filters, onApply }) => {
  const { theme } = useTheme();
  const [selectedPriceRange, setSelectedPriceRange] = useState(filters.priceRange || 'All');
  const [selectedCategories, setSelectedCategories] = useState(filters.categories || []);
  const [selectedRating, setSelectedRating] = useState(filters.rating || null);
  const [selectedDiscount, setSelectedDiscount] = useState(filters.discount || null);

  const toggleCategory = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleApply = () => {
    onApply({
      priceRange: selectedPriceRange,
      categories: selectedCategories,
      rating: selectedRating,
      discount: selectedDiscount
    });
    onClose();
  };

  const handleClear = () => {
    setSelectedPriceRange('All');
    setSelectedCategories([]);
    setSelectedRating(null);
    setSelectedDiscount(null);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        <View style={[styles.sheet, { backgroundColor: theme.colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Filters</Text>
            <TouchableOpacity onPress={handleClear}>
              <Text style={[styles.clearAll, { color: theme.colors.primary }]}>Clear ALL</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
            {/* Price Range */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Price Range</Text>
              <View style={styles.row}>
                {['Under ₹100', '₹100 - ₹500', '₹500+', 'All'].map((range) => (
                  <TouchableOpacity
                    key={range}
                    style={[
                      styles.chip,
                      { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                      selectedPriceRange === range && { backgroundColor: theme.colors.primaryLight, borderColor: theme.colors.primary }
                    ]}
                    onPress={() => setSelectedPriceRange(range)}
                  >
                    <Text style={[
                      styles.chipText,
                      { color: theme.colors.textSecondary },
                      selectedPriceRange === range && { color: theme.colors.primary }
                    ]}>
                      {range}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Rating */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Rating</Text>
              <View style={styles.row}>
                {[4, 3, 2, 1].map((star) => (
                  <TouchableOpacity
                    key={star}
                    style={[
                      styles.chip,
                      { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                      selectedRating === star && { backgroundColor: theme.colors.primaryLight, borderColor: theme.colors.primary }
                    ]}
                    onPress={() => setSelectedRating(star)}
                  >
                    <Text style={[
                      styles.chipText,
                      { color: theme.colors.textSecondary },
                      selectedRating === star && { color: theme.colors.primary }
                    ]}>
                      {star}★ & above
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Discount */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Discount</Text>
              <View style={styles.row}>
                {[10, 20, 50].map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[
                      styles.chip,
                      { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                      selectedDiscount === d && { backgroundColor: theme.colors.primaryLight, borderColor: theme.colors.primary }
                    ]}
                    onPress={() => setSelectedDiscount(d)}
                  >
                    <Text style={[
                      styles.chipText,
                      { color: theme.colors.textSecondary },
                      selectedDiscount === d && { color: theme.colors.primary }
                    ]}>
                      {d}% or more
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Multi select Category (Visual representation as requested) */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Sub Categories</Text>
              <View style={styles.row}>
                {['Organic', 'Imported', 'Local', 'Frozen', 'Premium'].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.chip,
                      { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                      selectedCategories.includes(cat) && { backgroundColor: theme.colors.primaryLight, borderColor: theme.colors.primary }
                    ]}
                    onPress={() => toggleCategory(cat)}
                  >
                    <Text style={[
                      styles.chipText,
                      { color: theme.colors.textSecondary },
                      selectedCategories.includes(cat) && { color: theme.colors.primary }
                    ]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <ButtonPrimary title="Apply Filters" onPress={handleApply} />
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
    height: height * 0.75,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  clearAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  footer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
});

export default FilterModal;
