const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

// Import GraphQL type definitions and resolvers
const { typeDefs, resolvers } = require('./schemas');

// Initialize express app
const app = express();
const API_PORT = process.env.API_PORT || 3001;

// Start Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    if (token) {
      try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        return { user };
      } catch (error) {
        console.log('Invalid token');
      }
    }
    return {};
  },
});

// Apply middlewares and start the server
async function startServer() {
  await server.start();
  
  // Use CORS middleware before applying Apollo middleware
  app.use(cors());
  
  // Apply Apollo middleware
  server.applyMiddleware({ app });

  app.listen(API_PORT, () => {
    console.log(`Server ready at http://localhost:${API_PORT}${server.graphqlPath}`);
  });
}

startServer();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));
