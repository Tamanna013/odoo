const express = require('express');
const router = express.Router();
const { uploadMiddleware, createItem, getAllItems, getItemById } = require('../controllers/itemController');
const authMiddleware = require('../middleware/AuthMiddleware');

router.post('/', authMiddleware, uploadMiddleware, createItem);

router.get('/', getAllItems);

router.get('/:id', getItemById);

const { deleteItem } = require('../controllers/itemController');
router.delete('/:id', authMiddleware, deleteItem);

module.exports = router;
