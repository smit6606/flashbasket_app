import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RecentlyViewedContext = createContext();

const RECENTLY_VIEWED_KEY = 'recently_viewed_products';
const MAX_ITEMS = 20;

export const RecentlyViewedProvider = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    loadRecentlyViewed();
  }, []);

  const loadRecentlyViewed = async () => {
    try {
      const stored = await AsyncStorage.getItem(RECENTLY_VIEWED_KEY);
      if (stored) {
        setRecentlyViewed(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading recently viewed:', e);
    }
  };

  const addToRecentlyViewed = async (product) => {
    try {
      setRecentlyViewed((prev) => {
        // Remove if already exists to move to top
        const filtered = prev.filter((item) => item.id !== product.id);
        const updated = [product, ...filtered].slice(0, MAX_ITEMS);
        
        // Save to storage
        AsyncStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (e) {
      console.error('Error adding to recently viewed:', e);
    }
  };

  const clearRecentlyViewed = async () => {
    try {
      await AsyncStorage.removeItem(RECENTLY_VIEWED_KEY);
      setRecentlyViewed([]);
    } catch (e) {
      console.error('Error clearing recently viewed:', e);
    }
  };

  return (
    <RecentlyViewedContext.Provider 
      value={{ 
        recentlyViewed, 
        addToRecentlyViewed, 
        clearRecentlyViewed 
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export const useRecentlyViewed = () => useContext(RecentlyViewedContext);
