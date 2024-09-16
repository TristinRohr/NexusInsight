require('dotenv').config({ path: './.env' });

const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const stripeRoutes = require('./routes/stripe'); // Import stripe routes
const path = require('path');

// Import GraphQL type definitions and resolvers
const { typeDefs, resolvers } = require('./schemas');

const app = express();
const PORT = process.env.PORT || 3001;
console.log('PORT:', PORT);

// Middleware
app.use(cookieParser());
app.use(express.json()); // Parse JSON requests

// CORS Setup
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Set Content Security Policy (CSP) to work with Stripe
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "script-src 'self' https://js.stripe.com 'unsafe-eval'; frame-src 'self' https://js.stripe.com; connect-src 'self' https://api.stripe.com;"
  );
  next();
});

// Use the Stripe routes
app.use('/api/stripe', stripeRoutes); // Ensure Stripe routes are set before serving static files

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    const token = req.cookies.token || '';
    if (token) {
      try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        return { user, res };
      } catch (error) {
        console.log('Invalid token');
      }
    }
    return { res };
  },
});

async function startServer() {
  await server.start();

  // Apply Apollo middleware
  server.applyMiddleware({ app, cors: false });

  // Serve static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // Handle React routing, return index.html for all unhandled routes
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
    });
  }

  // Start server on the defined port
  app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

startServer();
