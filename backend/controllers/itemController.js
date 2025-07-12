const multer = require('multer');
const path = require('path');
const Item = require('../models/Item');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/items/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });
const uploadMiddleware = upload.array('images', 5);

const createItem = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      type,
      size,
      condition,
      pointsValue
    } = req.body;

    const images = req.files.map(file => file.filename);

    const newItem = new Item({
      title,
      description,
      category,
      location,
      type,
      size,
      condition,
      pointsValue,
      images,
      owner: req.user.id 
    });

    await newItem.save();
    res.status(201).json({ message: 'Item created!', item: newItem });
  } catch (err) {
    console.error('Error in createItem:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllItems = async (req, res) => {
  try {
    const items = await Item.find().populate('owner', 'name');
    res.status(200).json(items);
  } catch (err) {
    console.error('Error in getAllItems:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('owner', 'name profilePhoto');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json(item);
  } catch (err) {
    console.error('Error in getItemById:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: 'Item not found' });

    if (item.owner.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await item.deleteOne();
    res.json({ msg: 'Item deleted successfully' });
  } catch (err) {
    console.error('Error in deleteItem:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  uploadMiddleware,
  createItem,
  getAllItems,
  getItemById,
  deleteItem 
};
