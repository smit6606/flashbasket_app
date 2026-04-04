import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import { useFavorites } from '../constants/FavoritesContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FavouriteList from '../components/FavouriteList';

const FavoritesScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { favorites } = useFavorites();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>My Favourites</Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
            {favorites.length} {favorites.length === 1 ? 'item' : 'items'}
          </Text>
        </View>
      </View>

      <FavouriteList items={favorites.map(f => f.product || f)} theme={theme} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitleContainer: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 12,
  },
});

export default FavoritesScreen;
