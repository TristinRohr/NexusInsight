const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const NodeCache = require('node-cache');
require('dotenv').config(); 

const User = require('./models/User');

const app = express();

// init cache with a 10 minute ttl (time to live)
const cache = new NodeCache({ stdTTL: 600 });

// define graphql type def and resolvers
const typeDefs = `#graphql
    type User {
        _id: ID
        username: String
        email: String
        favoritePlayers: [String]
    }

    type Query {
        hello: String
        getLiveMatchData(summonerName: String!): String
        getUser: User
    }

    type Mutation {
        register(username: String!, email: String!, password: String!): String
        login(email: String!, password: String!): String
        addFavoritePlayer(playerName: String!): User
    }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello World!',
    getLiveMatchData: async (_, { summonerName }) => {
      // Check if live match data is cached
      const cachedData = cache.get(summonerName);
      if (cachedData) {
        console.log(`Serving from cache for ${summonerName}`);
        return cachedData;
      }

      try {
        // Make the request using axios to Riot API
        const response = await axios.get(`https://<RIOT_API_ENDPOINT>/summoner/${summonerName}`, {
          headers: {
            'X-Riot-Token': process.env.RIOT_API_KEY,
          },
        });

        const matchData = response.data;
        // Cache the response for future requests
        cache.set(summonerName, matchData);
        return JSON.stringify(matchData); // Send the match data as a string (you can change it based on requirements)
      } catch (error) {
        console.error('Error fetching live match data:', error);
        return 'Error fetching live match data';
      }
    },
  },

  Mutation: {
    register: async (_, { username, email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();
      return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials');
      }
      return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    },

    addFavoritePlayer: async (_, { playerName }, { user }) => {
      if (!user) throw new Error('Authentication required');
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { $push: { favoritePlayers: playerName } },
        { new: true }
      );
      return updatedUser;
    },
  },
};

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

server.start().then(() => {
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () => {
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));
