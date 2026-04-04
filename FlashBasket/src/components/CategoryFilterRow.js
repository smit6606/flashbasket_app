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
                    backgroundColor: isActive ? theme.colors.primaryLight : theme.colors.surface,
                    borderColor: isActive ? theme.colors.primary : theme.colors.border,
                  }
                ]}>
                  {category.image ? (
                    <Image 
                      source={{ uri: category.image }} 
                      style={[styles.catImage, { opacity: isActive ? 1 : 0.8 }]} 
                    />
                  ) : (
                    <Text style={[styles.initial, { color: isActive ? theme.colors.primary : theme.colors.textSecondary }]}>
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
                      fontWeight: isActive ? '900' : '600',
                    },
                  ]}
                >
                  {category.name}
                </Text>
                {isActive && <View style={[styles.activeDot, { backgroundColor: theme.colors.primary }]} />}
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
    paddingVertical: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 20,
  },
  categoryItem: {
    alignItems: 'center',
    width: 65,
  },
  circle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  catImage: {
    width: '70%',
    height: '70%',
    resizeMode: 'contain',
  },
  initial: {
    fontSize: 20,
    fontWeight: '900',
  },
  categoryText: {
    fontSize: 10,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
  loader: {
    marginHorizontal: 30,
  },
});

export default CategoryFilterRow;
