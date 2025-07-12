// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminMiddleware = require('../middleware/adminMiddleware');

// GET all users
router.get('/users', adminMiddleware, adminController.getAllUsers);

// DELETE user
router.delete('/users/:id', adminMiddleware, adminController.deleteUser);

// GET all items (including pending/private)
router.get('/items', adminMiddleware, adminController.getAllItems);

module.exports = router;