const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
  const { amount } = req.body;

  // Validate the amount (should be at least $1.00 and a whole number)
  if (!amount || amount < 100 || !Number.isInteger(amount)) {
    return res.status(400).json({ error: 'Invalid amount. Must be at least $1.00 and a whole number.' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Donation To Our Devs!',
            },
            unit_amount: amount, // Dynamic amount sent from the front-end
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    // Send back the checkout session ID and URL
    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error.message);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

module.exports = router;
