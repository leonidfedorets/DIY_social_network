const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const registerUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser && existingUser.verified) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    let user;
    if (existingUser && !existingUser.verified) {
      existingUser.password = hashedPassword;
      existingUser.otp = otp;
      existingUser.otpExpiry = otpExpiry;
      user = await existingUser.save();
    } else {
      user = new User({ username, password: hashedPassword, otp, otpExpiry, verified: false });
      await user.save();
    }

    // In production, send OTP via email. For demo, return it in response.
    res.status(201).json({ message: 'OTP sent. Please verify your account.', otp, userId: user._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const verifyOtp = async (req, res) => {
  const { userId, otp } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.verified) return res.status(400).json({ error: 'Already verified' });
    if (!user.otp || user.otp !== otp) return res.status(400).json({ error: 'Invalid OTP code' });
    if (user.otpExpiry < new Date()) return res.status(400).json({ error: 'OTP has expired. Please register again.' });

    user.verified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ message: 'Account verified successfully! You can now sign in.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Invalid username or password' });
    if (!user.verified) return res.status(401).json({ error: 'Account not verified. Please complete OTP verification.' });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: 'Invalid username or password' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'defaultSecret', { expiresIn: '7d' });
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
    const users = await User.find({}, { password: 0, otp: 0 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password -otp');
    if (!user) return res.status(401).json({ error: 'User not found' });
    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

const updateUserRole = async (req, res) => {
  const { role } = req.body;
  try {
    const defaultPermissions = role === 'admin'
      ? { create: true, read: true, update: true, delete: true }
      : { create: true, read: true, update: true };
    const user = await User.findByIdAndUpdate(req.params.userId, { role, permissions: defaultPermissions }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateUserPermissions = async (req, res) => {
  const { permissions } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, { permissions }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { registerUser, verifyOtp, loginUser, logoutUser, checkAuth, getAllUsers, updateUserRole, updateUserPermissions };
