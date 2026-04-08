import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../services/authService';
import { setOnUnauthorizedCallback } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredData();
    // Set global unauthorized handler
    setOnUnauthorizedCallback(() => {
      logout();
    });
  }, []);

  const loadStoredData = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');
      
      if (storedToken) {
        setToken(storedToken);
      }
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading auth data from storage:', error);
    } finally {
      setLoading(false);
    }
  };

  const loginWithOtp = async (phone, otp) => {
    try {
      const data = await authService.verifyOtp(phone, otp);
      
      // PERSIST DATA LOCALLY (Safe check)
      if (data?.token) {
        await AsyncStorage.setItem('token', data.token);
      }
      if (data?.user) {
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
      }
      
      setToken(data?.token || null);
      setUser(data?.user || null);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API logout fails, clear local state
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      setToken(null);
      setUser(null);
    }
  };

  const updateUserInfo = async (userData) => {
    setUser(userData);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        loginWithOtp,
        logout,
        updateUserInfo,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
