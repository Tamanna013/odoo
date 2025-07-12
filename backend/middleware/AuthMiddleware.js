const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 Fetch the full user so we can attach isAdmin
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // ✅ Attach full user info to request
    req.user = {
      id: user._id.toString(),
      isAdmin: user.isAdmin
    };

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
