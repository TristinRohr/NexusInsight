import React, { useState } from 'react';
import axios from 'axios';
import './LoginRegister.css';  // Import the CSS file
import { useNavigate } from 'react-router-dom';

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);  // Toggle between login/register
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

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
      localStorage.setItem('token', token);
      window.location.reload();
      Navigate('/LandingSearch');
    } catch (err) {
      setError('Authentication failed');
    }
  };

  return (
    <div className="login-register-container">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
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
              placeholder='Username'
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
            placeholder='Email'
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder='Password'
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