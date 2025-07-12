const express = require('express');
const router = express.Router();
const { uploadMiddleware, createItem } = require('../controllers/itemController');
const authMiddleware = require('../middleware/AuthMiddleware');

console.log('authMiddleware:', typeof authMiddleware);
console.log('uploadMiddleware:', typeof uploadMiddleware);
console.log('createItem:', typeof createItem);

router.post('/', authMiddleware, uploadMiddleware, createItem); // ✅ not "protect"

const { getAllItems } = require('../controllers/itemController');

router.get('/', getAllItems);


module.exports = router;
