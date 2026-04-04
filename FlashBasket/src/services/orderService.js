import api from './api';

const orderService = {
  createOrder: async (orderData) => {
    return api.post('/order/place', orderData);
  },

  getOrderHistory: async () => {
    return api.get('/order/history');
  },

  getOrderDetails: async (orderId) => {
    return api.get(`/order/${orderId}`);
  }
};

export default orderService;
