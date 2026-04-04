import React, { createContext, useState, useContext, useEffect } from 'react';
import userService from '../services/userService';
import { useAuth } from './AuthContext';

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

  const loadAddresses = React.useCallback(async () => {
    setAddressLoading(true);
    try {
      const data = await userService.getAddresses();
      setAddresses(data.addresses || []);
      if (data.addresses && data.addresses.length > 0 && !selectedAddress) {
        setSelectedAddress(data.addresses[0]);
      }
      setError(null);
    } catch (err) {
      console.error('Error loading addresses:', err);
      setError(err.message || 'Failed to load addresses');
    } finally {
      setAddressLoading(false);
    }
  }, [selectedAddress]);

  const loadWalletBalance = React.useCallback(async () => {
    setWalletLoading(true);
    try {
      const data = await userService.getWalletInfo();
      setWallet(data.wallet || { balance: 0 });
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
    }
  }, [isAuthenticated, loadAddresses, loadWalletBalance]);

  const addAddress = async (addressData) => {
    try {
      const data = await userService.addAddress(addressData);
      setAddresses([...addresses, data.address]);
      if (!selectedAddress) {
        setSelectedAddress(data.address);
      }
      return data.address;
    } catch (err) {
      console.error('Error adding address:', err);
      throw err;
    }
  };

  const updateAddress = async (id, addressData) => {
    try {
      const data = await userService.updateAddress(id, addressData);
      const updated = data.address;
      setAddresses(addresses.map((addr) => (addr.id === id ? updated : addr)));
      if (selectedAddress?.id === id) {
        setSelectedAddress(updated);
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
        setSelectedAddress(addresses.find((addr) => addr.id !== id) || null);
      }
    } catch (err) {
      console.error('Error deleting address:', err);
      throw err;
    }
  };

  const addMoneyToWallet = async (amount) => {
    try {
      const data = await userService.addMoneyToWallet(amount);
      setWallet(data.wallet);
      return data;
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
        setSelectedAddress,
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
