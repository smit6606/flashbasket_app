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
      console.log('[DEBUG-CONTEXT] loadCart: Calling cartService.getCart()...');
      const data = await cartService.getCart();
      console.log('[DEBUG-CONTEXT] loadCart: API response received:', data);
      setCart(data.data); // Backend returns { data: cartObj }
      console.log('[DEBUG-CONTEXT] loadCart: State updated.');
      setError(null);
    } catch (err) {
      console.error('[DEBUG-CONTEXT] loadCart: Error:', err);
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

    console.log('[DEBUG-CONTEXT] Optimistic addToCart: ProductID:', productId);

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
    console.log('[DEBUG-CONTEXT] Optimistic updateQuantity: ItemID:', cartItemId, 'Quantity:', quantity);

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
    console.log('[DEBUG-CONTEXT] Optimistic removeFromCart: ItemID:', cartItemId);

    // 1. Optimistic UI Update
    setCart(prevCart => {
      if (!prevCart || !prevCart.items) return prevCart;
      const items = prevCart.items.filter(item => 
        item.id !== cartItemId && (!productId || item.productId !== Number(productId))
      );
      return { ...prevCart, items };
    });

    try {
      await cartService.removeFromCart(cartItemId);
      // Wait a bit before reloading to ensure backend is fully updated
      setTimeout(() => loadCart(false), 500);
    } catch (err) {
      console.error('Error removing from cart:', err);
      loadCart(false); // Rollback to actual state
    }
  };

  const debounceSync = (id) => {
    if (syncTimeouts.current[id]) {
      clearTimeout(syncTimeouts.current[id]);
    }

    syncTimeouts.current[id] = setTimeout(async () => {
      console.log('[DEBUG-CONTEXT] Syncing cart to backend for ID:', id);
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
    // We need the latest state to sync. Since this is an async operation,
    // we'll fetch from the current cart state (though this might be slightly tricky with closures)
    // Actually, a better way is to pass the quantity, but we want the LATEST quantity.
    
    // Instead of passing quantity, we'll just call loadCart(false) after a small delay
    // but the actual addToCart/updateQuantity API must be called.
    
    // Let's find the item in the current state
    setCart(currentCart => {
      if (!currentCart) return currentCart;
      
      const item = currentCart.items.find(i => 
        i.productId === Number(id) || i.id === id || i.id === `temp-${id}`
      );

      if (item) {
        // Decide whether to call addToCart (if it was new) or updateQuantity
        if (typeof item.id === 'string' && item.id.startsWith('temp-')) {
          cartService.addToCart(item.productId, item.quantity).then(() => {
            loadCart(false); // Reload to get real IDs
          }).catch(err => {
             console.error('Background addToCart failed', err);
             loadCart(false); // Sync back to real state
          });
        } else {
          cartService.updateCartQuantity(item.id, item.quantity).then(() => {
            // Optional: loadCart(false) if we want absolute sync
          }).catch(err => {
             console.error('Background updateQuantity failed', err);
             loadCart(false);
          });
        }
      }
      return currentCart;
    });
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
