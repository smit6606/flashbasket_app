const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const responseHandler = require('../utils/responseHandler');

const orderService = require('../services/orderService');

exports.createPaymentIntent = async (req, res) => {
  try {
    const { couponCode, useWallet } = req.body;
    const userId = req.user.id;

    const amount = await orderService.calculateRequiredPayment(userId, { couponCode, useWallet });

    if (amount <= 0) {
      return responseHandler.error(res, 'Invalid amount for payment intent', 400);
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // in INR smallest unit
      currency: 'inr',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return responseHandler.success(res, 'Payment intent created successfully', {
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Stripe Create Payment Intent Error:', error);
    return responseHandler.error(res, error.message || 'Payment server error', 500);
  }
};

// Keep verifyPayment if needed for webhooks, but since the requirement says "Stripe automatically verifies payment", 
// we might not need a manual verification API like Razorpay. 
// However, the frontend "create order" step should probably still happen on success.
