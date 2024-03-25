// users.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, checkAuth, getAllUsers } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser); // New route for logout
router.get('/check-auth', authMiddleware, checkAuth);
router.get('/all', getAllUsers); // New route for all users without authentication

module.exports = router;
