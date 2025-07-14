const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, param, validationResult } = require('express-validator');
const mid = require('../middleware/middle');

const JWT_SECRET = '123456789'; // use .env in production

// ✅ In-memory blacklist (clears on server restart)
const tokenBlacklist = new Set();

// 🔧 Error handler for validations
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return false;
};

// ✅ Create User
router.post('/createuser',
  [
    body('name', 'Name is required').notEmpty(),
    body('id', 'ID is required').notEmpty(),
    body('password', 'Password must be at least 4 characters').isLength({ min: 4 }),
  ],
  async (req, res) => {
    if (handleValidationErrors(req, res)) return;

    const { name, id, password } = req.body;

    try {
      let user = await User.findOne({ id });
      if (user) return res.status(400).json({ error: 'User already exists' });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({ name, id, password: hashedPassword });
      await user.save();

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ message: 'User created', token });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// ✅ Login User
router.post('/login',
  [
    body('id', 'ID is required').notEmpty(),
    body('password', 'Password is required').notEmpty()
  ],
  async (req, res) => {
    if (handleValidationErrors(req, res)) return;

    const { id, password } = req.body;

    try {
      const user = await User.findOne({ id });
      if (!user) return res.status(400).json({ error: 'Invalid ID or password' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: 'Invalid ID or password' });

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ message: 'Login successful', token });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// ✅ Logout User
router.post('/logout', mid, (req, res) => {
  const token = req.header('auth-token');
  if (!token) return res.status(400).json({ error: 'No token provided' });

  tokenBlacklist.add(token); // ⛔ block future access with this token
  res.json({ message: 'User logged out successfully' });
});

// ✅ Get all users
router.get('/', mid, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// getuser
router.get('/getuser', mid, async (req, res) => {
  try {
    const user = await User.findOne({ id: req.user.id }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


// ✅ Get single user by ID
router.get('/:id',
  mid,
  param('id').notEmpty().withMessage('ID is required'),
  async (req, res) => {
    if (handleValidationErrors(req, res)) return;

    try {
      const user = await User.findOne({ id: req.params.id }).select('-password');
      if (!user) return res.status(404).json({ error: 'User not found' });

      res.json(user);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// ✅ Update User
router.put('/:id',
  mid,
  [
    param('id').notEmpty().withMessage('ID is required'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('password').optional().isLength({ min: 4 }).withMessage('Password must be at least 4 characters')
  ],
  async (req, res) => {
    if (handleValidationErrors(req, res)) return;

    const { name, password } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    try {
      const user = await User.findOneAndUpdate({ id: req.params.id }, updateData, { new: true }).select('-password');
      if (!user) return res.status(404).json({ error: 'User not found' });

      res.json({ message: 'User updated', user });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// ✅ Delete User
router.delete('/:id',
  mid,
  param('id').notEmpty().withMessage('ID is required'),
  async (req, res) => {
    if (handleValidationErrors(req, res)) return;

    try {
      const user = await User.findOneAndDelete({ id: req.params.id });
      if (!user) return res.status(404).json({ error: 'User not found' });

      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = { router, tokenBlacklist };
