const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const responseHandler = require('../utils/responseHandler');

exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return responseHandler.error(res, 'Amount is required', 400);
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // in paise (smallest currency unit for INR)
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
