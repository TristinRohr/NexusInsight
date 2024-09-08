// server/schemas/userResolvers.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const userResolvers = {
  Query: {
    getUser: async (_, args, { user }) => {
      if (!user) throw new Error('Authentication required');
      return await User.findById(user._id);
    }
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

module.exports = userResolvers;