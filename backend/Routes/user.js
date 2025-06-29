// routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ✅ Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // hide password
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Get user by ID field (your custom id, not MongoDB _id)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Create new user
router.post('/', async (req, res) => {
  const { name, id, password } = req.body;

  try {
    let existing = await User.findOne({ id });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const newUser = new User({ name, id, password });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Update user
router.put('/:id', async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { id: req.params.id },
      { name, password },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'User updated', user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Delete user
router.delete('/:id', async (req, res) => {
  try {
    const result = await User.findOneAndDelete({ id: req.params.id });
    if (!result) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
