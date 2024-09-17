import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Stripe.css';

const CancelPage = () => {
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();

  // Determine if the user is logged in by checking for a token
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    if (countdown === 0) {
      if (isLoggedIn) {
        navigate('/profile'); // Redirect to profile if logged in
      } else {
        navigate('/'); // Redirect to home if not logged in
      }
    }

    return () => clearInterval(timer); // Cleanup the timer on unmount
  }, [countdown, isLoggedIn, navigate]);

  return (
    <div className="response-container">
      <h1 className="cancel-message">Payment Canceled</h1>
      <p>Your payment was canceled. Please try again or contact support.</p>

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

export default CancelPage;
