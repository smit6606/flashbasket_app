/**
 * Centralized constants for FlashBasket Backend
 */

const ORDER_STATUS = {
  PENDING: 'Pending',
  PLACED: 'Placed',
  PACKED: 'Packed',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
};

const ORDER_STATUS_FLOW = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.PLACED,
  ORDER_STATUS.PACKED,
  ORDER_STATUS.OUT_FOR_DELIVERY,
  ORDER_STATUS.DELIVERED,
];

const PAYMENT_METHODS = {
  ONLINE: 'online',
  COD: 'cod',
  WALLET: 'wallet',
  UPI: 'upi',
};

const WALLET_TRANSACTION_TYPES = {
  CREDIT: 'credit',
  DEBIT: 'debit',
};

const WALLET_SOURCES = {
  ORDER: 'order',
  FIRST_ORDER: 'first_order',
  CHECKOUT: 'checkout',
  REFUND: 'refund',
  TOPUP: 'topup',
};

module.exports = {
  ORDER_STATUS,
  ORDER_STATUS_FLOW,
  PAYMENT_METHODS,
  WALLET_TRANSACTION_TYPES,
  WALLET_SOURCES,
};
