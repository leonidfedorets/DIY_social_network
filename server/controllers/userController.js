// userController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const registerUser = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultPermissions = role === 'admin' 
      ? { create: true, read: true, update: true, delete: true }
      : { create: true, read: true, update: true };

    const newUser = new User({ username, password: hashedPassword, role, permissions: defaultPermissions });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'defaultSecret', {
      expiresIn: '1h',
    });

    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ message: 'Login successful', user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successful' });
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkAuth = async (req, res) => {
  try {
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

const updateUserRole = async (req, res) => {
  const { role } = req.body;
  try {
    const userId = req.params.userId;
    const defaultPermissions = role === 'admin' 
      ? { create: true, read: true, update: true, delete: true }
      : { create: true, read: true, update: true };

    const user = await User.findByIdAndUpdate(userId, { role, permissions: defaultPermissions }, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateUserPermissions = async (req, res) => {
  const { permissions } = req.body;
  try {
    const userId = req.params.userId;
    const user = await User.findByIdAndUpdate(userId, { permissions }, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { registerUser, loginUser, logoutUser, checkAuth, getAllUsers, updateUserRole, updateUserPermissions };
