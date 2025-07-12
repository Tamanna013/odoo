const mongoose = require('mongoose');

const swapSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requestedItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  offeredItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  pointsOffered: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  completedAt: Date
});

module.exports = mongoose.model('Swap', swapSchema);