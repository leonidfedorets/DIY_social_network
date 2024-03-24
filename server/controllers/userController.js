const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register a new user
const registerUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'defaultSecret', {
      expiresIn: '1h', // Token expires in 1 hour
    });

    res.cookie('token', token, { httpOnly: true }); // Set token as a cookie
    res.status(200).json({ message: 'Login successful', user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all users (without authentication)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password from response
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Check user authentication
const checkAuth = async (req, res) => {
  try {
    // Extract userId from the request object
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'No token provided, authorization denied' });
    }

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};


module.exports = { registerUser, loginUser, checkAuth,getAllUsers };
