const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id);
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authorization key context invalid.' });
      }
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Authentication verification failure.' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Missing Authorization Token.' });
  }
};

module.exports = { protect };