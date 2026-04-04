import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import ProductCard from './ProductCard';

const FavouriteList = ({ items, theme }) => {
  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Image 
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3081/3081986.png' }} 
          style={styles.emptyImage} 
        />
        <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No Favourites Yet</Text>
        <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
          Start exploring and heart your favourite items!
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <ProductCard product={item} />}
      numColumns={2}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      columnWrapperStyle={styles.columnWrapper}
    />
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyImage: {
    width: 150,
    height: 150,
    marginBottom: 24,
    opacity: 0.8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  listContent: {
    padding: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default FavouriteList;
