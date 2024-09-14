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
const PORT = process.env.PORT || 3001; // Use process.env.PORT for deployment environments like Render

app.use(cookieParser());
app.use(express.json()); // Parse JSON requests

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

  // Set up CORS for production and development
  app.use(
    cors({
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      credentials: true,
    })
  );

  // Apply middleware for Apollo server
  server.applyMiddleware({ app, cors: false });

  // Serve the frontend files from /client/dist if in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // Handle React routing, return index.html for all unhandled routes
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
    });
  }

  // Listen on the appropriate port
  app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

// Use the Stripe routes
app.use('/api/stripe', stripeRoutes);
// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

startServer();
