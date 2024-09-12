import React, { useState } from 'react';
import axios from 'axios';

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

      await axios.post(
        '/graphql',
        { query, variables },
        { withCredentials: true }  // Send cookies with the request
      );

      window.location.reload();  // Reload the page to apply the login state
    } catch (err) {
      setError('Authentication failed');
    }
  };

  return (
    <div>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required={!isLogin}
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
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Switch to Register' : 'Switch to Login'}
      </button>
    </div>
  );
};

export default LoginRegister;
