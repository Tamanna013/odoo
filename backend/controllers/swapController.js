const Swap = require('../models/Swap');
const Item = require('../models/Item');
const User = require('../models/User');

exports.requestSwap = async (req, res) => {
  try {
    const { requestedItemId, offeredItemId, pointsOffered } = req.body;

    const requestedItem = await Item.findById(requestedItemId);
    if (!requestedItem || requestedItem.status !== 'available') {
      return res.status(400).json({ msg: 'Item not available for swap' });
    }

    if (requestedItem.owner.toString() === req.user.id) {
      return res.status(400).json({ msg: 'Cannot request your own item' });
    }

    if (pointsOffered > 0) {
      const user = await User.findById(req.user.id);
      if (user.points < pointsOffered) {
        return res.status(400).json({ msg: 'Not enough points' });
      }
    }

    let offeredItem = null;
    if (offeredItemId) {
      offeredItem = await Item.findById(offeredItemId);
      if (!offeredItem || offeredItem.status !== 'available') {
        return res.status(400).json({ msg: 'Offered item not available' });
      }
      if (offeredItem.owner.toString() !== req.user.id) {
        return res.status(400).json({ msg: 'Not your item to offer' });
      }
    }

    const newSwap = new Swap({
      requester: req.user.id,
      recipient: requestedItem.owner,
      requestedItem: requestedItemId,
      offeredItem: offeredItemId,
      pointsOffered: pointsOffered || 0,
      status: 'pending'
    });

    const swap = await newSwap.save();

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
    const { action } = req.body;
    const swap = await Swap.findById(req.params.id)
      .populate('requestedItem')
      .populate('offeredItem');

    if (!swap) {
      return res.status(404).json({ msg: 'Swap not found' });
    }

    if (swap.recipient.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    if (swap.status !== 'pending') {
      return res.status(400).json({ msg: 'Swap already processed' });
    }

    if (action === 'accept') {
      
      swap.status = 'accepted';
      await swap.save();

      
      swap.requestedItem.status = 'swapped';
      await swap.requestedItem.save();

      if (swap.offeredItem) {
        swap.offeredItem.status = 'swapped';
        await swap.offeredItem.save();
      }

      
      if (swap.pointsOffered > 0) {
        await User.findByIdAndUpdate(swap.requester, { $inc: { points: -swap.pointsOffered } });
        await User.findByIdAndUpdate(swap.recipient, { $inc: { points: swap.pointsOffered } });
      }

      res.json({ msg: 'Swap accepted successfully' });
    } else if (action === 'reject') {
  
      swap.status = 'rejected';
      await swap.save();

      
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

    if (swap.requester.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    if (swap.status !== 'pending') {
      return res.status(400).json({ msg: 'Cannot cancel processed swap' });
    }

    swap.status = 'cancelled';
    await swap.save();

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
