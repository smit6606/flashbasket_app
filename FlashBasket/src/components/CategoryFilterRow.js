import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import categoryService from '../services/categoryService';

const CategoryFilterRow = ({ onCategorySelect, activeCategory = 'all' }) => {
  const { theme, isDark } = useTheme();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      const catList = response.data || [];
      setCategories([{ id: 'all', name: 'All' }, ...catList]);
    } catch (error) {
      console.error('[CategoryRow Error] Fetch failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {loading ? (
          <ActivityIndicator size="small" color={theme.colors.primary} style={styles.loader} />
        ) : (
          categories.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryItem}
                onPress={() => {
                  if (onCategorySelect) onCategorySelect(category.id === 'all' ? 'all' : category.id);
                }}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.circle, 
                  { 
                    backgroundColor: isActive 
                      ? theme.colors.primary 
                      : (isDark ? '#1F1F1F' : '#FFFFFF'),
                    borderColor: isActive ? theme.colors.primary : theme.colors.border,
                  }
                ]}>
                  {category.image && category.image.trim() !== '' ? (
                    <Image 
                      source={{ uri: category.image.trim() }} 
                      style={[styles.catImage, isActive && { tintColor: '#FFFFFF' }]} 
                    />
                  ) : (
                    <Text style={[styles.initial, { color: isActive ? '#FFFFFF' : theme.colors.textSecondary }]}>
                      {category.name?.[0]?.toUpperCase()}
                    </Text>
                  )}
                </View>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.categoryText,
                    { 
                      color: isActive ? theme.colors.primary : theme.colors.textSecondary,
                      fontWeight: isActive ? '900' : '700',
                    },
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  categoryItem: {
    alignItems: 'center',
    width: 70,
  },
  circle: {
    width: 62,
    height: 62,
    borderRadius: 18,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  catImage: {
    width: '60%',
    height: '60%',
    resizeMode: 'contain',
  },
  initial: {
    fontSize: 18,
    fontWeight: '900',
  },
  categoryText: {
    fontSize: 11,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
});

export default CategoryFilterRow;
