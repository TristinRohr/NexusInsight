require('dotenv').config({ path: './.env' });
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Import GraphQL type definitions and resolvers
const { typeDefs, resolvers } = require('./schemas');

const app = express();
const API_PORT = process.env.API_PORT || 3001;

// Use cookie-parser to parse cookies from the request
app.use(cookieParser());

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    const token = req.cookies.token || ''; // Get the token from the cookie
    if (token) {
      try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        return { user, res }; // Pass response to set cookies if needed
      } catch (error) {
        console.log('Invalid token');
      }
    }
    return { res }; // Pass response even if no token
  },
});

// Apply CORS and Apollo middleware
async function startServer() {
  await server.start();
  
  app.use(cors({
    origin: 'http://localhost:3000', // Adjust origin as necessary
    credentials: true, // Allow credentials (cookies)
  }));
  
  server.applyMiddleware({ app, cors: false });

  app.listen(API_PORT, () => {
    console.log(`Server ready at http://localhost:${API_PORT}${server.graphqlPath}`);
  });
}

startServer();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));
