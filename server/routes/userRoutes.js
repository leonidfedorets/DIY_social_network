// users.js

const express = require('express');
const router = express.Router();
const { registerUser, loginUser, checkAuth, getAllUsers } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/check-auth', authMiddleware, checkAuth);
router.get('/all', getAllUsers); // New route for all users without authentication

module.exports = router;
