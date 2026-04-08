import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';
import { useRef } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const syncTimeouts = useRef({}); // Track timeouts per productId
  const cartRef = useRef(cart);

  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated]);

  const loadCart = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const data = await cartService.getCart();
      setCart(data.data); // Backend returns { data: cartObj }
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load cart');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1, productData = null) => {
    if (!isAuthenticated) {
      Alert.alert('Session Required', 'Please login to start shopping!');
      return;
    }

    // 1. Optimistic UI Update
    setCart(prevCart => {
      const items = prevCart?.items ? [...prevCart.items] : [];
      const existingItemIndex = items.findIndex(i => i.productId === Number(productId));

      if (existingItemIndex > -1) {
        // Increment existing
        items[existingItemIndex] = {
          ...items[existingItemIndex],
          quantity: items[existingItemIndex].quantity + quantity
        };
      } else {
        // Add new (using productData if available)
        items.push({
          id: `temp-${Date.now()}`,
          productId: Number(productId),
          product: productData || { id: productId, name: 'Loading...' },
          quantity: quantity
        });
      }
      return { ...prevCart, items };
    });

    // 2. Debouncing Sync
    debounceSync(productId);
  };

  const updateQuantity = async (cartItemId, quantity, productId) => {

    if (quantity < 1) {
      return removeFromCart(cartItemId, productId);
    }

    // 1. Optimistic UI Update
    setCart(prevCart => {
      if (!prevCart || !prevCart.items) return prevCart;
      const items = prevCart.items.map(item => {
        if (item.id === cartItemId || (productId && item.productId === Number(productId))) {
          return { ...item, quantity };
        }
        return item;
      });
      return { ...prevCart, items };
    });

    // 2. Debouncing Sync
    debounceSync(productId || cartItemId); // Fallback to cartItemId if productId not provided
  };

  const removeFromCart = async (cartItemId, productId) => {
    // 1. Clear any pending debounced syncs for this product
    if (productId && syncTimeouts.current[productId]) {
      clearTimeout(syncTimeouts.current[productId]);
      delete syncTimeouts.current[productId];
    } else if (cartItemId && syncTimeouts.current[cartItemId]) {
      clearTimeout(syncTimeouts.current[cartItemId]);
      delete syncTimeouts.current[cartItemId];
    }

    // 2. Optimistic UI Update
    setCart(prevCart => {
      if (!prevCart || !prevCart.items) return prevCart;
      const items = prevCart.items.filter(item => 
        item.id !== cartItemId && (!productId || item.productId !== Number(productId))
      );
      return { ...prevCart, items };
    });

    // 3. Skip backend call if it's a temporary ID
    if (typeof cartItemId === 'string' && cartItemId.startsWith('temp-')) {
      return; 
    }

    try {
      await cartService.removeFromCart(cartItemId);
      setTimeout(() => loadCart(false), 500);
    } catch (err) {
      console.error('Error removing from cart:', err);
      loadCart(false); 
    }
  };

  const debounceSync = (id) => {
    if (syncTimeouts.current[id]) {
      clearTimeout(syncTimeouts.current[id]);
    }

    syncTimeouts.current[id] = setTimeout(async () => {
      try {
        // Find the current quantity in our optimistic state
        // We use a small trick by defining a helper to call API
        await syncWithBackend(id);
        delete syncTimeouts.current[id];
      } catch (err) {
        console.error('Sync failed:', err);
      }
    }, 500); // 500ms debounce
  };

  const syncWithBackend = async (id) => {
    // Use the latest state from ref to avoid closure issues
    const currentCart = cartRef.current;
    if (!currentCart || !currentCart.items) return;

    const item = currentCart.items.find(i => 
      i.productId === Number(id) || i.id === id || i.id === `temp-${id}`
    );

    if (item) {
      try {
        if (typeof item.id === 'string' && item.id.startsWith('temp-')) {
          await cartService.addToCart(item.productId, item.quantity);
        } else {
          await cartService.updateCartQuantity(item.id, item.quantity);
        }
        await loadCart(false); // Reload to get real IDs and sync state
      } catch (err) {
        // Only log as error if it's a server error (status >= 500)
        // Otherwise use warn for network (0) or client errors (4xx) to keep console clean
        if (err.status >= 500) {
          console.error('[Cart Sync] Server failure:', err.message);
        } else {
          console.warn('[Cart Sync] Background sync failed:', err.message);
        }
        
        // We still reload to ensure UI is in sync with whatever is on server
        loadCart(false);
      }
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCart(null);
    } catch (err) {
      console.error('Error clearing cart:', err);
      throw err;
    }
  };

  const getCartCount = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => {
      const price = item.product?.discount_price || item.product?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        loadCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartCount,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
