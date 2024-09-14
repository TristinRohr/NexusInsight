// routes/stripe.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Donation',
            },
            unit_amount: 1000, // e.g., $10 donation
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Use dynamic success and cancel URLs from environment variables
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    // Send the session ID to the client
    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error.message);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

module.exports = router;
