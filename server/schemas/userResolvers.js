const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');  // Importing the User schema (updated)
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
    register: async (_, { username, email, password, gameName, tagLine }, { res }) => {
      // Check if a user with the same email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.error('User already exists with this email:', email);
        throw new Error('User already exists');
      }
    
      // No need to hash the password here, the pre-save hook will handle it
    
      // Create a new user with the raw password
      const newUser = new User({
        username,
        email,
        password,  // Save raw password, pre-save hook will hash it
        gameName,  // Adding gameName
        tagLine,   // Adding tagLine
      });
    
      // Log the new user object before saving
      console.log("New user before saving:", newUser);
      
      // Save the new user to the database
      await newUser.save();
    
      console.log("New user saved successfully.");
      console.log("New user ID:", newUser._id);
      
      // Generate a JWT token for the newly registered user
      const token = jwt.sign(
        { _id: newUser._id, email: newUser.email }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
      );
    
      // Log the generated JWT token
      console.log("Generated JWT token for new user:", token);
      
      // Set a cookie with the JWT token for authentication
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 60 * 60 * 1000, // 1 hour
      });
      
      // Return the JWT token
      return token;
    },

    login: async (_, { email, password }, { res }) => {
      // Log the login attempt details
      console.log("Login attempt for email:", email);

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        console.error("User not found for email:", email);
        throw new Error('Invalid credentials');
      }

      // Log the stored hashed password in the database
      console.log("Stored hashed password in DB:", user.password);
    
      // Compare entered password with the hashed password in the database
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      // Log the result of password comparison
      console.log("Password comparison result:", isValidPassword);
      
      if (!isValidPassword) {
        console.error("Invalid password for email:", email);
        throw new Error('Invalid credentials');
      }
    
      // Generate a JWT token
      const token = jwt.sign(
        { _id: user._id, email: user.email }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
      );
    
      // Log the generated JWT token
      console.log("Generated JWT token for user login:", token);
    
      // Set the JWT token in cookies
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 60 * 60 * 1000, // 1 hour
      });
    
      return token;
    },

    logout: async (_, args, { res }) => {
      res.clearCookie('token');
      console.log("User logged out, JWT token cleared.");
      return 'Logged out successfully';
    },

    updateUser: async (_, { input }, { user }) => {
      if (!user) {
        console.error("Unauthorized update attempt, no user found in context.");
        throw new Error('Authentication required');
      }

      const allowedUpdates = ['username', 'email', 'gameName', 'tagLine']; // Fields that can be updated
      const updates = {};
      
      // Log the input data for debugging purposes
      console.log("Update input received:", input);
      
      // Check if the input contains allowed fields and add them to updates
      for (const key in input) {
        if (allowedUpdates.includes(key)) {
          updates[key] = input[key];
        }
      }

      if (Object.keys(updates).length === 0) {
        console.error("No valid fields to update.");
        throw new Error('No valid fields to update');
      }

      // Log the updates being made
      console.log("Updates being applied:", updates);

      // Find the user by ID and update the allowed fields
      const updatedUser = await User.findByIdAndUpdate(user._id, updates, { new: true, runValidators: true });
      if (!updatedUser) {
        console.error("User not found for update, user ID:", user._id);
        throw new Error('User not found');
      }

      console.log("User updated successfully:", updatedUser);

      return updatedUser;
    },

    addFavoritePlayer: async (_, { summonerName, tagLine }, { user }) => {
      if (!user) throw new Error('Authentication required');
      const playerName = `${summonerName}#${tagLine}`; // Concatenate summonerName and tagLine

      console.log("Adding favorite player:", playerName);

      const existingUser = await User.findById(user._id);
      if (!existingUser) throw new Error('User not found');

      const isFavorite = existingUser.favoritePlayers.includes(playerName);
      if (isFavorite) {
        console.error("Player is already in favorites:", playerName);
        throw new Error('Player is already in favorites');
      }

      existingUser.favoritePlayers.push(playerName);
      await existingUser.save();
      console.log("Player added to favorites:", playerName);
      return existingUser;
    },

    removeFavoritePlayer: async (_, { summonerName, tagLine }, { user }) => {
      if (!user) throw new Error('Authentication required');
      const playerName = `${summonerName}#${tagLine}`;

      console.log("Removing favorite player:", playerName);

      const existingUser = await User.findById(user._id);
      if (!existingUser) throw new Error('User not found');

      const isFavorite = existingUser.favoritePlayers.includes(playerName);
      if (!isFavorite) {
        console.error("Player is not in favorites:", playerName);
        throw new Error('Player is not in favorites');
      }

      existingUser.favoritePlayers = existingUser.favoritePlayers.filter(fav => fav !== playerName);
      await existingUser.save();
      console.log("Player removed from favorites:", playerName);
      return existingUser;
    },

    // Adding Stripe checkout mutation
    checkout: async (_, { amount }, { req }) => {
      try {
        const url = new URL(req.headers.referer).origin;
        console.log("Creating Stripe session for amount:", amount);

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

        console.log("Stripe session created successfully, session ID:", session.id);

        return { sessionId: session.id };
      } catch (error) {
        console.error('Stripe Checkout Error:', error);
        throw new Error('Failed to create checkout session');
      }
    },
    
  },
};

module.exports = userResolvers;