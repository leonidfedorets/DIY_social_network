const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, default: '' },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  permissions: {
    create: { type: Boolean, default: true },
    read: { type: Boolean, default: true },
    update: { type: Boolean, default: true },
    delete: { type: Boolean, default: false },
  },
  verified: { type: Boolean, default: false },
  otp: { type: String, default: null },
  otpExpiry: { type: Date, default: null },
  googleId: { type: String, default: null },
  bio: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
