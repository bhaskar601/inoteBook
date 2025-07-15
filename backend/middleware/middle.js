// middleware/middle.js
require('dotenv').config(); // Load environment variables
const jwt = require('jsonwebtoken');
const { tokenBlacklist } = require('../Routes/user'); // 👈 import the blacklist
const JWT_SECRET = process.env.JWT_SECRET;// You can move this to .env in production

const mid = (req, res, next) => {
  const token = req.header('auth-token');

  if (!token) {
    return res.status(401).json({ error: 'Access Denied: No token provided' });
  }

  // ✅ Check if token is blacklisted
  if (tokenBlacklist && tokenBlacklist.has(token)) {
    return res.status(403).json({ error: 'Token has been invalidated. Please login again.' });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data; // now you can access user id via req.user.id
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = mid;
