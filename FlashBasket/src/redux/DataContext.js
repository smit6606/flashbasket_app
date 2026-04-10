import React, { createContext, useState, useContext, useCallback } from 'react';
import categoryService from '../services/categoryService';
import productService from '../services/productService';
import orderService from '../services/orderService';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [sections, setSections] = useState([]);
  const [buyAgainProducts, setBuyAgainProducts] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const preloadData = useCallback(async () => {
    try {
      console.log('[Data] Starting data preload...');
      
      // Fetch Categories and Products in parallel
      const [categoryRes, productRes] = await Promise.all([
        categoryService.getAllCategories(),
        productService.getAllProducts({ limit: 100 })
      ]);

      const catList = categoryRes.data || [];
      const allProducts = productRes.data?.data || productRes.data || [];

      setCategories(catList);
      setProducts(allProducts);

      // Prepare sections for Home Screen
      const dynamicSections = catList.map(cat => ({
        id: cat.id,
        title: cat.name,
        data: allProducts.filter(p => p.categoryId === cat.id).slice(0, 8)
      })).filter(section => section.data.length > 0);

      const flashDeals = allProducts.filter(p => p.discount > 0).slice(0, 8);
      
      const finalSections = [];
      if (flashDeals.length > 0) {
        finalSections.push({ id: 'flash', title: 'Flash Deals 🔥', data: flashDeals });
      }
      finalSections.push(...dynamicSections);
      setSections(finalSections);

      // Fetch Buy Again if user is logged in
      if (user) {
        try {
          const buyAgainRes = await orderService.getBuyAgainProducts();
          setBuyAgainProducts(buyAgainRes.data || []);
        } catch (err) {
          console.error('[Data] Error fetching buy again:', err);
        }
      }

      setIsDataLoaded(true);
      console.log('[Data] Preload complete');
    } catch (error) {
      console.error('[Data] Preload failed:', error);
      // Even if it fails, we should probably set loaded to true to allow app to open 
      // but maybe show an error in Home. For now, just mark it as complete.
      setIsDataLoaded(true);
    }
  }, [user]);

  return (
    <DataContext.Provider
      value={{
        categories,
        products,
        sections,
        buyAgainProducts,
        isDataLoaded,
        preloadData,
        refreshData: preloadData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
