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
            unit_amount: 1000,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
