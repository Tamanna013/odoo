const express = require('express');
const router = express.Router();
const { uploadMiddleware, createItem, getAllItems, getItemById } = require('../controllers/itemController');
const authMiddleware = require('../middleware/AuthMiddleware');

// ✅ Route to create a new item
router.post('/', authMiddleware, uploadMiddleware, createItem);

// ✅ Route to get all items
router.get('/', getAllItems);

// ✅ Route to get item by ID
router.get('/:id', getItemById);

const { deleteItem } = require('../controllers/itemController');
router.delete('/:id', authMiddleware, deleteItem);

module.exports = router;
