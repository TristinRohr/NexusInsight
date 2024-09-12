const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const userResolvers = {
  Query: {
    getUser: async (_, args, { user }) => {
      if (!user) throw new Error('Authentication required');
      return await User.findById(user._id);
    },
  },
  Mutation: {
    register: async (_, { username, email, password }, { res }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();

      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Set the token as an HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Secure in production
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

      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Set the token as an HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 60 * 60 * 1000,
      });

      return token;
    },

    logout: async (_, args, { res }) => {
      res.clearCookie('token'); // Clear the cookie on logout
      return 'Logged out successfully';
    },
  },
};

module.exports = userResolvers;
