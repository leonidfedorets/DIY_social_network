const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser'); // Add cookie-parser for handling cookies
const authMiddleware = require('./middleware/authMiddleware'); // Import auth middleware

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }));
app.use(cookieParser()); // Use cookie-parser middleware

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Check for successful connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB database');
});

// Routes
app.use('/api/posts', require('./routes/post'));
app.use('/api/users', require('./routes/userRoutes')); // Add this line for user routes

// Apply auth middleware to check-auth route
app.use('/api/users/check-auth', authMiddleware);

module.exports = app;

