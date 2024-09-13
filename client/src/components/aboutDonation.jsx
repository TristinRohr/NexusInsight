import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

// Load your Stripe publishable key
const stripePromise = loadStripe('your-publishable-key-from-stripe');

const AboutDonation = () => {
  const handleDonation = async () => {
    const stripe = await stripePromise;

    try {
      // Create a checkout session on your backend
      const { data } = await axios.post('/create-checkout-session', {
        // Add any additional parameters here if needed
      });

      // Redirect the user to the Stripe checkout page
      const result = await stripe.redirectToCheckout({
        sessionId: data.id, // ID from the session creation response
      });

      if (result.error) {
        console.error('Error redirecting to Stripe:', result.error.message);
      }
    } catch (error) {
      console.error('Failed to initiate donation:', error);
    }
  };

  return (
    <div>
      <h1>About Us</h1>
      <p>
        Welcome to our League of Legends Tracker! We are passionate about helping players track their game stats, history, and live matches.
        Our mission is to provide a seamless experience to help you improve your skills and stay updated with your favorite players.
      </p>

      <h2>Support Us</h2>
      <p>
        If you appreciate our service, consider making a donation to support future development and features. Every contribution helps us keep the platform running and improve it for all players.
      </p>

      <button onClick={handleDonation}>Donate with Stripe</button>
    </div>
  );
};

export default AboutDonation;
