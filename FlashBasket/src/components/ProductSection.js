import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import ProductCard from './ProductCard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProductSection = ({ title, data, onViewAll, isBuyAgain = false }) => {
  const { theme } = useTheme();

  if (!data || data.length === 0) return null;

  return (
    <View style={[styles.container, { borderBottomColor: theme.colors.border }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
        <TouchableOpacity onPress={onViewAll} style={styles.headerBtn}>
          <Text style={[styles.viewAll, { color: theme.colors.secondary }]}>See All</Text>
          <Icon name="chevron-right" size={18} color={theme.colors.secondary} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ProductCard product={item} variant="previous" showBuyAgainLabel={isBuyAgain} />}
        contentContainerStyle={styles.listContent}
        snapToInterval={180}
        decelerationRate="fast"
      />

      <TouchableOpacity 
        style={[styles.bottomBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]} 
        onPress={onViewAll}
      >
        <Text style={[styles.bottomBtnText, { color: theme.colors.text }]}>See All {title}</Text>
        <Icon name="arrow-right" size={16} color={theme.colors.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    borderBottomWidth: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '800',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  bottomBtn: {
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  bottomBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
});

export default ProductSection;
