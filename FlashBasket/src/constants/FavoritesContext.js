import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

import favoriteService from '../services/favoriteService';
import { useAuth } from '../redux/AuthContext';

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    } else {
      setFavorites([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const data = await favoriteService.getFavorites();
      setFavorites(data.data || []);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (product) => {
    if (!isAuthenticated) return;
    
    const existing = favorites.find(item => item.productId === product.id);
    try {
      if (existing) {
        await favoriteService.removeFromFavorites(existing.id);
        setFavorites(prev => prev.filter(item => item.id !== existing.id));
      } else {
        await favoriteService.addToFavorites(product.id);
        await loadFavorites();
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      await loadFavorites(); // rollback
    }
  };

  const isFavorite = (productId) => favorites.some((item) => item.productId === productId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, favoritesLoading: loading }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
