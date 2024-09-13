require('dotenv').config({ path: './.env' });
// client/server.js
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const stripeRoutes = require('./routes/stripe'); // Import stripe routes

// Import GraphQL type definitions and resolvers
const { typeDefs, resolvers } = require('./schemas');

const app = express();
const API_PORT = process.env.API_PORT || 3001;

app.use(cookieParser());
app.use(express.json()); // Make sure you can parse JSON requests

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

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );

  server.applyMiddleware({ app, cors: false });

  app.listen(API_PORT, () => {
    console.log(`Server ready at http://localhost:${API_PORT}${server.graphqlPath}`);
  });
}

// Use the Stripe routes
app.use('/api/stripe', stripeRoutes); // Prefix the Stripe routes with /api/stripe

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

startServer();
