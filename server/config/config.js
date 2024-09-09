const mongoose = require('mongoose');

// Ensure MONGODB_URI is defined
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('Error: MONGODB_URI is not defined in the environment variables');
  process.exit(1); // Exit the application if URI is missing
}

// Optional: Only log in development mode to avoid exposing sensitive info
if (process.env.NODE_ENV !== 'production') {
  console.log('MongoDB URI:', uri);
}

// Connect to MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the application if connection fails
  });

const db = mongoose.connection;

// Listen for errors after initial connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;
