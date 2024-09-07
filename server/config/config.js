const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(uri);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;