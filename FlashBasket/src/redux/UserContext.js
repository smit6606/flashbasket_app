import React, { createContext, useState, useContext, useEffect } from 'react';
import userService from '../services/userService';
import { useAuth } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const { isAuthenticated, user, updateUserInfo } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [wallet, setWallet] = useState({ balance: 0 });
  const [addressLoading, setAddressLoading] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);
  const [error, setError] = useState(null);
  const PERSIST_KEY = 'selected_address_id';

  const loadAddresses = React.useCallback(async () => {
    setAddressLoading(true);
    try {
      const res = await userService.getAddresses();
      const addressesList = res.data || [];
      setAddresses(addressesList);
      
      if (addressesList.length > 0) {
        // Priority 1: Backend default address (last set by user)
        const backendDefault = addressesList.find(a => !!a.isDefault);
        
        // Priority 2: Local storage (fallback for currently active device session)
        const savedId = await AsyncStorage.getItem(PERSIST_KEY);
        const persisted = savedId ? addressesList.find(a => String(a.id) === savedId) : null;

        if (backendDefault) {
          setSelectedAddress(backendDefault);
          await AsyncStorage.setItem(PERSIST_KEY, String(backendDefault.id));
        } else if (persisted) {
          setSelectedAddress(persisted);
        } else {
          // Default to the most recent address if no explicit default is found
          const sorted = [...addressesList].sort((a, b) => b.id - a.id);
          setSelectedAddress(sorted[0]);
        }
      }
      setError(null);
    } catch (err) {
      console.error('Error loading addresses:', err);
      setError(err.message || 'Failed to load addresses');
    } finally {
      setAddressLoading(false);
    }
  }, []);

  const loadWalletBalance = React.useCallback(async () => {
    setWalletLoading(true);
    try {
      const balanceRes = await userService.getWalletInfo();
      const historyRes = await userService.getWalletTransactions();
      
      const balanceData = balanceRes.data?.data || {};
      const historyData = historyRes.data?.data || [];

      setWallet({ 
        balance: balanceData.balance || 0,
        transactions: historyData
      });
      setError(null);
    } catch (err) {
      console.error('Error loading wallet info:', err);
      setError(err.message || 'Failed to load wallet');
    } finally {
      setWalletLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadAddresses();
      loadWalletBalance();
    } else {
      setAddresses([]);
      setSelectedAddress(null);
      setWallet({ balance: 0 });
      AsyncStorage.removeItem(PERSIST_KEY).catch(() => {});
    }
  }, [isAuthenticated, loadAddresses, loadWalletBalance]);

  const handleSetSelectedAddress = async (addr) => {
    if (!addr) return;
    setSelectedAddress(addr);
    try {
      if (addr.id) {
        await AsyncStorage.setItem(PERSIST_KEY, String(addr.id));
        // Sync with backend to remember for next login
        await userService.setDefaultAddress(addr.id);
      }
    } catch (err) {
      console.warn('Failed to sync default address to backend:', err);
    }
  };

  const addAddress = async (addressData) => {
    try {
      const res = await userService.addAddress(addressData);
      const newAddress = res.data;
      if (newAddress) {
        setAddresses([...addresses, newAddress]);
        // Use the handler to sync with backend as default
        handleSetSelectedAddress(newAddress);
      }
      return newAddress;
    } catch (err) {
      console.error('Error adding address:', err);
      throw err;
    }
  };

  const updateAddress = async (id, addressData) => {
    try {
      const res = await userService.updateAddress(id, addressData);
      const updated = res.data;
      if (updated) {
        setAddresses(addresses.map((addr) => (addr.id === id ? updated : addr)));
        if (selectedAddress?.id === id) {
          handleSetSelectedAddress(updated);
        }
      }
      return updated;
    } catch (err) {
      console.error('Error updating address:', err);
      throw err;
    }
  };

  const deleteAddress = async (id) => {
    try {
      await userService.deleteAddress(id);
      setAddresses(addresses.filter((addr) => addr.id !== id));
      if (selectedAddress?.id === id) {
        const next = addresses.find((addr) => addr.id !== id);
        if (next) {
          handleSetSelectedAddress(next);
        } else {
          setSelectedAddress(null);
        }
      }
    } catch (err) {
      console.error('Error deleting address:', err);
      throw err;
    }
  };

  const addMoneyToWallet = async (amount) => {
    try {
      const res = await userService.addMoneyToWallet(amount);
      await loadWalletBalance();
      return res.data;
    } catch (err) {
      console.error('Error adding money to wallet:', err);
      throw err;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const data = await userService.updateProfile(profileData);
      updateUserInfo(data.data);
      return data.data;
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  return (
    <UserContext.Provider
      value={{
        addresses,
        selectedAddress,
        setSelectedAddress: handleSetSelectedAddress,
        wallet,
        addressLoading,
        walletLoading,
        error,
        loadAddresses,
        loadWalletBalance,
        addAddress,
        updateAddress,
        deleteAddress,
        addMoneyToWallet,
        updateProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
