const Swap = require('../models/Swap');
const Item = require('../models/Item');
const User = require('../models/User');

exports.requestSwap = async (req, res) => {
  try {
    const { requestedItemId, offeredItemId, pointsOffered } = req.body;

    // Get requested item
    const requestedItem = await Item.findById(requestedItemId);
    if (!requestedItem || requestedItem.status !== 'available') {
      return res.status(400).json({ msg: 'Item not available for swap' });
    }

    // Check if user is not the owner of requested item
    if (requestedItem.owner.toString() === req.user.id) {
      return res.status(400).json({ msg: 'Cannot request your own item' });
    }

    // Check if user has enough points if offering points
    if (pointsOffered > 0) {
      const user = await User.findById(req.user.id);
      if (user.points < pointsOffered) {
        return res.status(400).json({ msg: 'Not enough points' });
      }
    }

    // Get offered item if provided
    let offeredItem = null;
    if (offeredItemId) {
      offeredItem = await Item.findById(offeredItemId);
      if (!offeredItem || offeredItem.status !== 'available') {
        return res.status(400).json({ msg: 'Offered item not available' });
      }
      // Check if user is the owner of offered item
      if (offeredItem.owner.toString() !== req.user.id) {
        return res.status(400).json({ msg: 'Not your item to offer' });
      }
    }

    // Create swap request
    const newSwap = new Swap({
      requester: req.user.id,
      recipient: requestedItem.owner,
      requestedItem: requestedItemId,
      offeredItem: offeredItemId,
      pointsOffered: pointsOffered || 0,
      status: 'pending'
    });

    // Save swap
    const swap = await newSwap.save();

    // Update items status if needed
    if (offeredItem) {
      offeredItem.status = 'pending';
      await offeredItem.save();
    }
    requestedItem.status = 'pending';
    await requestedItem.save();

    res.status(201).json(swap);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getSwaps = async (req, res) => {
  try {
    const swaps = await Swap.find({
      $or: [{ requester: req.user.id }, { recipient: req.user.id }]
    })
      .populate('requester', 'name profilePhoto')
      .populate('recipient', 'name profilePhoto')
      .populate('requestedItem')
      .populate('offeredItem')
      .sort({ createdAt: -1 });

    res.json(swaps);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.respondToSwap = async (req, res) => {
  try {
    const { swapId, action } = req.body; // action: 'accept' or 'reject'

    const swap = await Swap.findById(swapId)
      .populate('requestedItem')
      .populate('offeredItem');

    if (!swap) {
      return res.status(404).json({ msg: 'Swap not found' });
    }

    // Check if user is the recipient
    if (swap.recipient.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Check if swap is pending
    if (swap.status !== 'pending') {
      return res.status(400).json({ msg: 'Swap already processed' });
    }

    if (action === 'accept') {
      // Update swap status
      swap.status = 'accepted';
      await swap.save();

      // Update items status
      swap.requestedItem.status = 'swapped';
      await swap.requestedItem.save();

      if (swap.offeredItem) {
        swap.offeredItem.status = 'swapped';
        await swap.offeredItem.save();
      }

      // Handle points transfer if applicable
      if (swap.pointsOffered > 0) {
        await User.findByIdAndUpdate(swap.requester, { $inc: { points: -swap.pointsOffered } });
        await User.findByIdAndUpdate(swap.recipient, { $inc: { points: swap.pointsOffered } });
      }

      res.json({ msg: 'Swap accepted successfully' });
    } else if (action === 'reject') {
      // Update swap status
      swap.status = 'rejected';
      await swap.save();

      // Revert items status
      swap.requestedItem.status = 'available';
      await swap.requestedItem.save();

      if (swap.offeredItem) {
        swap.offeredItem.status = 'available';
        await swap.offeredItem.save();
      }

      res.json({ msg: 'Swap rejected' });
    } else {
      res.status(400).json({ msg: 'Invalid action' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.cancelSwap = async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id)
      .populate('requestedItem')
      .populate('offeredItem');

    if (!swap) {
      return res.status(404).json({ msg: 'Swap not found' });
    }

    // Check if user is the requester
    if (swap.requester.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Check if swap is pending
    if (swap.status !== 'pending') {
      return res.status(400).json({ msg: 'Cannot cancel processed swap' });
    }

    // Update swap status
    swap.status = 'cancelled';
    await swap.save();

    // Revert items status
    swap.requestedItem.status = 'available';
    await swap.requestedItem.save();

    if (swap.offeredItem) {
      swap.offeredItem.status = 'available';
      await swap.offeredItem.save();
    }

    res.json({ msg: 'Swap cancelled' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};