const express = require('express');
const { body, param, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');

// Utility function to handle validation errors
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return true;
  }
  return false;
};

// ✅ Get all users (No validation needed)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Get user by ID
router.get('/:id', 
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

// ✅ Create new user (with password hashing)
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
  // Check if all required fields are actually present
  if (!name || !id || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Check if user already exists
  const existing = await User.findOne({ id });
  if (existing) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // 🔒 Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create and save the user
  const newUser = new User({ name, id, password: hashedPassword });
  await newUser.save();

  res.status(201).json({ message: 'User created successfully' });

} catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// ✅ Update user (with password hashing if password is provided)
router.put('/:id',
  [
    param('id').isString().withMessage('ID must be a string'),
    body('name').optional().notEmpty().withMessage('Name must not be empty'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  async (req, res) => {
    if (handleValidationErrors(req, res)) return;

    const updates = {};
    const { name, password } = req.body;

    if (name) updates.name = name;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    try {
      const user = await User.findOneAndUpdate(
        { id: req.params.id },
        updates,
        { new: true }
      ).select('-password');

      if (!user) return res.status(404).json({ error: 'User not found' });

      res.json({ message: 'User updated', user });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// ✅ Delete user
router.delete('/:id',
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
