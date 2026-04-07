import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import APP_CONFIG from '../config';

const CategorySidebar = ({ categories, activeCategory, onCategoryChange }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { 
      backgroundColor: theme.colors.surface, 
      borderRightColor: theme.colors.border 
    }]}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isActive = activeCategory === item.id;
          return (
            <TouchableOpacity
              style={[
                styles.categoryItem,
                isActive && { 
                  backgroundColor: theme.colors.background,
                  borderLeftColor: theme.colors.primary,
                  borderLeftWidth: 4 
                }
              ]}
              onPress={() => onCategoryChange(item.id)}
            >
              <View style={[styles.imageContainer, { 
                backgroundColor: isActive ? theme.colors.primaryLight : theme.colors.background 
              }]}>
                <Image source={{ uri: (item.image && item.image.trim() !== '') ? item.image : APP_CONFIG.DEFAULT_PLACEHOLDER }} style={styles.categoryImage} />
              </View>
              <Text style={[
                styles.categoryName, 
                { 
                  color: isActive ? theme.colors.primary : theme.colors.textSecondary,
                  fontWeight: isActive ? 'bold' : '600'
                }
              ]} numberOfLines={2}>
                {item.name}
              </Text>
              {isActive && <View style={[styles.activeIndicator, { backgroundColor: theme.colors.primary }]} />}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '25%',
    borderRightWidth: 1,
  },
  listContent: {
    paddingBottom: 40,
  },
  categoryItem: {
    paddingVertical: 14,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 2,
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  categoryName: {
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 14,
    paddingHorizontal: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: '15%',
    height: '70%',
    width: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  }
});

export default CategorySidebar;
