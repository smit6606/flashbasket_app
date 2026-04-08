import api from './api';

const paymentService = {
  createPaymentIntent: async (params) => {
    return api.post('/payment/create-payment-intent', params);
  }
};

export default paymentService;
