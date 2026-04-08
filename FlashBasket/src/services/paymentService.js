import api from './api';

const paymentService = {
  createPaymentIntent: async (amount) => {
    return api.post('/payment/create-payment-intent', { amount });
  }
};

export default paymentService;
