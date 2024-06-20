// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, checkAuth, getAllUsers, updateUserRole, updateUserPermissions } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/check-auth', authMiddleware, checkAuth);
router.get('/all', authMiddleware, adminMiddleware, getAllUsers);
router.put('/:userId/role', authMiddleware, adminMiddleware, updateUserRole);
router.put('/:userId/permissions', authMiddleware, adminMiddleware, updateUserPermissions);

module.exports = router;

