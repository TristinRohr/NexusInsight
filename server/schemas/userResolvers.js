const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const userResolvers = {
  Query: {
    getUser: async (_, args, { user }) => {
      if (!user) {
        console.error('User not authenticated');
        throw new Error('Authentication required');
      }
      const userData = await User.findById(user._id);
      if (!userData) {
        console.error('User not found in the database');
        throw new Error('User not found');
      }
      return userData ? { ...userData.toObject(), favoritePlayers: userData.favoritePlayers || [] } : null;
    }
  },
  
  Mutation: {
    register: async (_, { username, email, password }, { res }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();

      const token = jwt.sign({ _id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      return token;
    },

    login: async (_, { email, password }, { res }) => {
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 60 * 60 * 1000,
      });

      return token;
    },

    logout: async (_, args, { res }) => {
      res.clearCookie('token');
      return 'Logged out successfully';
    },

    addFavoritePlayer: async (_, { summonerName, tagLine }, { user }) => {
      if (!user) throw new Error('Authentication required');
      const playerName = `${summonerName}#${tagLine}`; // Concatenate summonerName and tagLine

      const existingUser = await User.findById(user._id);
      if (!existingUser) throw new Error('User not found');

      const isFavorite = existingUser.favoritePlayers.includes(playerName);
      if (isFavorite) {
        throw new Error('Player is already in favorites');
      }

      existingUser.favoritePlayers.push(playerName);
      await existingUser.save();
      return existingUser;
    },

    removeFavoritePlayer: async (_, { summonerName, tagLine }, { user }) => {
      if (!user) throw new Error('Authentication required');
      const playerName = `${summonerName}#${tagLine}`;

      const existingUser = await User.findById(user._id);
      if (!existingUser) throw new Error('User not found');

      const isFavorite = existingUser.favoritePlayers.includes(playerName);
      if (!isFavorite) {
        throw new Error('Player is not in favorites');
      }

      existingUser.favoritePlayers = existingUser.favoritePlayers.filter(fav => fav !== playerName);
      await existingUser.save();
      return existingUser;
    },

    // Adding Stripe checkout mutation
    checkout: async (_, { amount }, { req }) => {
      try {
        const url = new URL(req.headers.referer).origin;
    
        // Create a Stripe session with the custom amount
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [{
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Donation',
                description: 'Support Our Development',
              },
              unit_amount: amount, // The amount sent from the frontend
            },
            quantity: 1,
          }],
          mode: 'payment',
          success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${url}/`,
        });
    
        return { sessionId: session.id };
      } catch (error) {
        console.error('Stripe Checkout Error:', error);
        throw new Error('Failed to create checkout session');
      }
    },
    
  },
};

module.exports = userResolvers;
