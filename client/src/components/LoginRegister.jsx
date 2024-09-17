import React, { useState } from 'react';
import axios from 'axios';
import './LoginRegister.css';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Get the location object
  const message = location.state?.message; // Access the message passed from the previous page

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const query = isLogin
        ? `mutation login($email: String!, $password: String!) {
            login(email: $email, password: $password)
          }`
        : `mutation register($email: String!, $username: String!, $password: String!) {
            register(email: $email, username: $username, password: $password)
          }`;

      const variables = isLogin
        ? { email, password }
        : { email, username, password };

      const response = await axios.post('/graphql', {
        query,
        variables,
      });

      const token = response.data.data.login || response.data.data.register;
      if (token) {
        localStorage.setItem('token', token);
        setError(null);
        window.dispatchEvent(new Event('storage'));
        setTimeout(() => navigate('/profile'), 100);
      } else {
        setError('Authentication failed');
      }
    } catch (err) {
      setError('Authentication failed');
    }
  };

  return (
    <div className="login-register-container">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      {message && <p className="login-message">{message}</p>} {/* Display the message */}
      {error && <p className="error-message">{error}</p>}
      <form className="login-register-form" onSubmit={handleSubmit}>
        {!isLogin && (
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required={!isLogin}
              placeholder="Username"
            />
          </div>
        )}
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
        </div>
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <button className="toggle-button" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Switch to Register' : 'Switch to Login'}
      </button>
    </div>
  );
};

export default LoginRegister;
