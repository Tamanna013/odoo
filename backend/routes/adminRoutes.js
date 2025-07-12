const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Item = require('../models/Item');
const Swap = require('../models/Swap');
const authMiddleware = require('../middleware/AuthMiddleware');

const adminCheck = (req, res, next) => {
  if (!req.user?.isAdmin) return res.status(403).json({ msg: 'Access denied' });
  next();
};

router.get('/users', authMiddleware, adminCheck, async (req, res) => {
  try {
    const users = await User.find({}, 'name email points');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching users' });
  }
});

router.get('/items', authMiddleware, adminCheck, async (req, res) => {
  try {
    const items = await Item.find().populate('owner', 'name');
    res.json(items);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching items' });
  }
});

router.get('/swaps', authMiddleware, adminCheck, async (req, res) => {
  try {
    const swaps = await Swap.find()
      .populate('requester', 'name')
      .populate('recipient', 'name');
    res.json(swaps);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching swaps' });
  }
});

module.exports = router;
