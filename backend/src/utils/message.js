/**
 * Centralized registry for all application messages
 */
const messages = {
  AUTH: {
    LOGIN_SUCCESS: 'Logged in successfully',
    LOGIN_FAILED: 'Invalid credentials',
    REGISTER_SUCCESS: 'Account created successfully',
    OTP_SENT: 'OTP sent successfully',
    OTP_VERIFIED: 'OTP verified successfully',
    UNAUTHORIZED: 'Please login to continue',
  },
  PRODUCT: {
    FETCH_SUCCESS: 'Products fetched successfully',
    FETCH_FAILED: 'Failed to fetch products',
    NOT_FOUND: 'Product not found',
    CREATE_SUCCESS: 'Product created successfully',
    UPDATE_SUCCESS: 'Product updated successfully',
    DELETE_SUCCESS: 'Product deleted successfully',
  },
  CART: {
    ADD_SUCCESS: 'Item added to cart',
    REMOVE_SUCCESS: 'Item removed from cart',
    UPDATE_SUCCESS: 'Cart updated',
    CLEAR_SUCCESS: 'Cart cleared',
  },
  ORDER: {
    PLACE_SUCCESS: 'Order placed successfully',
    FETCH_SUCCESS: 'Orders fetched successfully',
    NOT_FOUND: 'Order not found',
    UPDATE_SUCCESS: 'Order status updated',
  },
  COMMON: {
    SOMETHING_WENT_WRONG: 'Internal server error. Please try again later.',
    BAD_REQUEST: 'Invalid request data',
    NOT_FOUND: 'Requested resource not found',
  },
};

module.exports = messages;
