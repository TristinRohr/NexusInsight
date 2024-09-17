import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Stripe.css';

const SuccessPage = () => {
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate(); // This is used to programmatically navigate to the profile or home page.

  // Determine if the user is logged in by checking for a token
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  useEffect(() => {
    // Set up a timer to update the countdown every second.
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    // When the countdown reaches 0, conditionally navigate based on whether the user is logged in.
    if (countdown === 0) {
      if (isLoggedIn) {
        navigate('/profile'); // Redirect to profile if logged in
      } else {
        navigate('/'); // Redirect to home if not logged in
      }
    }

    // Clean up the timer when the component is unmounted.
    return () => clearInterval(timer);
  }, [countdown, isLoggedIn, navigate]);

  return (
    <div className="response-container">
      <h1 className="success-message">Payment Successful</h1>
      <p>Thank you for your donation! We appreciate your support.</p>

      {/* Conditional rendering based on isLoggedIn */}
      <p>
        Redirecting to {isLoggedIn ? (
          <Link className="nav-link" to="/profile">Profile</Link>
        ) : (
          <Link className="nav-link" to="/">Home</Link>
        )} in {countdown} seconds...
      </p>
    </div>
  );
};

export default SuccessPage;
