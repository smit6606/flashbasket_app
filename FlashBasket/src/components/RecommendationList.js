import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import APP_CONFIG from '../config';
import Icon from 'react-native-vector-icons/Ionicons';

const RecommendationItem = ({ item, onAdd }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
      <Image source={{ uri: (item.image && item.image.trim() !== '') ? item.image : APP_CONFIG.DEFAULT_PLACEHOLDER }} style={styles.image} />
      <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={[styles.weight, { color: theme.colors.textSecondary }]}>
        {item.weight}
      </Text>
      
      <View style={styles.footer}>
        <Text style={[styles.price, { color: theme.colors.text }]}>₹{item.price}</Text>
        <TouchableOpacity 
          style={[styles.addButton, { borderColor: theme.colors.primary }]}
          onPress={onAdd}
        >
          <Icon name="add" size={16} color={theme.colors.primary} />
          <Text style={[styles.addButtonText, { color: theme.colors.primary }]}>ADD</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const RecommendationList = ({ recommendations, onAdd }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>You may also like</Text>
      <FlatList
        data={recommendations}
        renderItem={({ item }) => <RecommendationItem item={item} onAdd={() => onAdd(item)} />}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    backgroundColor: '#F9F9F9',
    paddingVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginLeft: 16,
    marginBottom: 12,
  },
  listContent: {
    paddingLeft: 16,
  },
  card: {
    width: 140,
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
    height: 32,
    marginBottom: 4,
  },
  weight: {
    fontSize: 10,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  addButtonText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default RecommendationList;
