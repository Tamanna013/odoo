// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/AuthMiddleware');

// GET user profile
router.get('/me', authMiddleware, userController.getProfile);

// UPDATE user profile
router.put('/me', authMiddleware, userController.updateProfile);

// DELETE user account
router.delete('/me', authMiddleware, userController.deleteAccount);

module.exports = router;