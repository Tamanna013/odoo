// routes/swapRoutes.js
const express = require('express');
const router = express.Router();
const swapController = require('../controllers/swapController');
const authMiddleware = require('../middleware/AuthMiddleware');

// POST create swap request
router.post('/', authMiddleware, swapController.requestSwap);

// GET all swaps for user
router.get('/', authMiddleware, swapController.getSwaps);

// PUT respond to swap (accept/reject)
router.put('/:id/respond', authMiddleware, swapController.respondToSwap);

// DELETE cancel swap
router.delete('/:id', authMiddleware, swapController.cancelSwap);

module.exports = router;