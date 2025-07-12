const express = require('express');
const router = express.Router();
const swapController = require('../controllers/swapController');
const authMiddleware = require('../middleware/AuthMiddleware');

router.post('/', authMiddleware, swapController.requestSwap);

router.get('/', authMiddleware, swapController.getSwaps);

router.put('/:id/respond', authMiddleware, swapController.respondToSwap);

router.delete('/:id', authMiddleware, swapController.cancelSwap);

module.exports = router;