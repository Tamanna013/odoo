const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/AuthMiddleware');

router.get('/me', authMiddleware, userController.getProfile);

router.put('/me', authMiddleware, userController.updateProfile);

router.delete('/me', authMiddleware, userController.deleteAccount);

module.exports = router;