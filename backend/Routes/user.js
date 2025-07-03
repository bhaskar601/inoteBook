const express = require('express');
const { body, param, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const mid = require('../middleware/middle');

const JWT_SECRET = '123456789'; // use .env for production

// Utility function to handle validation errors
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};

// ✅ Get all users (protected)
router.get('/', mid, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Get user by ID (protected)
router.get('/:id',
  mid,
  param('id').isString().withMessage('ID must be a string'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const user = await User.findOne({ id: req.params.id }).select('-password');
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// ✅ Create new user (open route)
router.post('/createuser',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('id').isAlphanumeric().withMessage('ID must be alphanumeric'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  async (req, res) => {
    if (handleValidationErrors(req, res)) return;

    const { name, id, password } = req.body;

    try {
      let existing = await User.findOne({ id });
      if (existing) return res.status(400).json({ error: 'User already exists' });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({ name, id, password: hashedPassword });
      await newUser.save();

      const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '1h' });

      res.status(201).json({ message: 'User created successfully', token });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// ✅ Login route
router.post('/login',
  [
    body('id').notEmpty().withMessage('ID is required'),
    body('password').notEmpty().withMessage('Password is required')
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
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// ✅ Update user (protected)
router.put('/:id',
  mid,
  [
    param('id').isString().withMessage('ID must be a string'),
    body('name').optional().notEmpty().withMessage('Name must not be empty'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
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
      const user = await User.findOneAndUpdate(
        { id: req.params.id },
        updateData,
        { new: true }
      ).select('-password');

      if (!user) return res.status(404).json({ error: 'User not found' });

      res.json({ message: 'User updated', user });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// ✅ Delete user (protected)
router.delete('/:id',
  mid,
  param('id').isString().withMessage('ID must be a string'),
  async (req, res) => {
    if (handleValidationErrors(req, res)) return;

    try {
      const result = await User.findOneAndDelete({ id: req.params.id });
      if (!result) return res.status(404).json({ error: 'User not found' });

      res.json({ message: 'User deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = router;
