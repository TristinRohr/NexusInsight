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

// Start Apollo Server and apply middleware
server.start().then(() => {
  server.applyMiddleware({ app });

  app.use(cors());

  app.listen({ port: 3001 }, () => {
    console.log(`Server ready at http://localhost:3001${server.graphqlPath}`);
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));