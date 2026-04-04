import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../constants/ThemeContext';

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
                  backgroundColor: theme.colors.white,
                  borderLeftColor: theme.colors.primary,
                  borderLeftWidth: 4 
                }
              ]}
              onPress={() => onCategoryChange(item.id)}
            >
              <View style={[styles.imageContainer, { 
                backgroundColor: isActive ? theme.colors.primaryLight : theme.colors.background 
              }]}>
                <Image source={{ uri: item.image }} style={styles.categoryImage} />
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
    width: '30%',
    borderRightWidth: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  categoryItem: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryImage: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  categoryName: {
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '600',
    paddingHorizontal: 4,
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: '25%',
    height: '50%',
    width: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  }
});

export default CategorySidebar;
