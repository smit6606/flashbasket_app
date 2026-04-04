import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import categoryService from '../services/categoryService';

const CategoryTabs = ({ onTabSelect }) => {
  const { theme } = useTheme();
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMainCategories();
  }, []);

  const fetchMainCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      const catList = response.data || [];
      setTabs(catList.slice(0, 3)); // show top 3 as tabs
      if (catList.length > 0) {
        setActiveTab(catList[0].id);
      }
    } catch (error) {
      console.error('Error fetching tabs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null; // Keep it clean while loading

  if (tabs.length === 0) return null;

  return (
    <View style={[styles.container, { borderBottomWidth: 1, borderBottomColor: theme.colors.border }]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.tab,
            activeTab === tab.id && { borderBottomColor: theme.colors.primary, borderBottomWidth: 3 }
          ]}
          onPress={() => {
            setActiveTab(tab.id);
            if (onTabSelect) onTabSelect(tab);
          }}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === tab.id ? theme.colors.primary : theme.colors.textSecondary },
              activeTab === tab.id && { fontWeight: 'bold' }
            ]}
          >
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tab: {
    paddingVertical: 12,
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
  },
});

export default CategoryTabs;
