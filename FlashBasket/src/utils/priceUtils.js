/**
 * Price calculation utilities for FlashBasket
 */

export const DELIVERY_THRESHOLD = 500;
export const DELIVERY_FEE = 25;
export const HANDLING_FEE = 5;

/**
 * Calculate delivery fee based on subtotal
 * @param {number} subtotal 
 * @returns {number}
 */
export const calculateDeliveryFee = (subtotal) => {
  if (subtotal === 0 || subtotal > DELIVERY_THRESHOLD) {
    return 0;
  }
  return DELIVERY_FEE;
};

/**
 * Calculate handling fee based on subtotal
 * @param {number} subtotal 
 * @returns {number}
 */
export const calculateHandlingFee = (subtotal) => {
  return subtotal > 0 ? HANDLING_FEE : 0;
};

/**
 * Calculate total order summary
 * @param {Object} params
 * @param {number} params.subtotal
 * @param {number} params.discount
 * @param {number} params.walletBalance
 * @param {boolean} params.useWallet
 * @returns {Object}
 */
export const calculateOrderSummary = ({ subtotal, discount = 0, walletBalance = 0, useWallet = false }) => {
  const deliveryFee = calculateDeliveryFee(subtotal);
  const handlingFee = calculateHandlingFee(subtotal);
  
  const baseAmount = subtotal - discount + deliveryFee + handlingFee;
  const walletUsed = useWallet ? Math.min(walletBalance, baseAmount) : 0;
  const grandTotal = Math.max(0, baseAmount - walletUsed);
  
  return {
    itemsTotal: subtotal,
    discount,
    deliveryFee,
    handlingFee,
    walletUsed,
    grandTotal
  };
};
