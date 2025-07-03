// middleware/middle.js

const jwt = require('jsonwebtoken');
const JWT_SECRET = '123456789'; // You can move this to .env

const mid = (req, res, next) => {
  const token = req.header('user-token');
  if (!token) return res.status(401).json({ error: 'Access Denied: No token provided' });

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data; // now you can access user id via req.user.id
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = mid;
