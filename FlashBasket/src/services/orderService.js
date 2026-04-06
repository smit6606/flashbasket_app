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
  },
  
  updateOrderStatus: async (orderId, status) => {
    return api.put(`/order/admin/status/${orderId}`, { status });
  },

  verifyOrderOTP: async (orderId, otp) => {
    return api.post(`/order/verify-otp/${orderId}`, { otp });
  }
};

export default orderService;
