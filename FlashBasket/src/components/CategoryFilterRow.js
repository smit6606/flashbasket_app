import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import categoryService from '../services/categoryService';

const CategoryFilterRow = ({ onCategorySelect }) => {
  const { theme } = useTheme();
  const [categories, setCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState('all');
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
            const isActive = activeCategoryId === category.id;
            return (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryItem}
                onPress={() => {
                  setActiveCategoryId(category.id);
                  if (onCategorySelect) onCategorySelect(category.id === 'all' ? null : category.id);
                }}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.circle, 
                  { 
                    backgroundColor: isActive ? '#fef0e3' : '#fff',
                    borderColor: isActive ? '#000' : '#f0f0f0',
                  }
                ]}>
                  {category.image ? (
                    <Image 
                      source={{ uri: category.image }} 
                      style={[styles.catImage]} 
                    />
                  ) : (
                    <Text style={[styles.initial, { color: isActive ? '#000' : '#999' }]}>
                      {category.name?.[0]?.toUpperCase()}
                    </Text>
                  )}
                </View>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.categoryText,
                    { 
                      color: isActive ? '#000' : '#777',
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
    width: 66,
    height: 66,
    borderRadius: 20, // More square-rounded like Zepto
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
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
