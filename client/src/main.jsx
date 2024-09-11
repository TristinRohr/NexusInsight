import './index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import App from './App';

const root = createRoot(document.getElementById('root'));

// Wrap App with Router for routing support
root.render(
  <Router>
    <App />
  </Router>
);
