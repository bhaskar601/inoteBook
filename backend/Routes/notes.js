const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const Note = require('../models/Notes2');
const User =require('../models/User')
const mid = require('../middleware/middle'); // Auth middleware

// 🛠️ Utility function to handle validation errors
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};

// ✅ Create a new note (requires login via token)
router.post('/createnotes', mid, async (req, res) => {
  const { title, description } = req.body;

  try {
    // ✅ Check if user exists
    const existingUser = await User.findOne({id:req.user.id});
    if (!existingUser) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // ✅ Save the note (no description restriction)
    const note = new Note({
      title,
      description,
      user: existingUser._id,
    });
    console.log(note);
    await note.save();
    res.status(201).json({ message: 'Note created successfully', note });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Get all notes of the logged-in user
router.get('/fetchall', mid, async (req, res) => {
  try {
    // console.log('hello')
    const notes = await Note.find({ user: req.user._id });
    console.log(notes)
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Get a single note by ID (must be user's own note)
router.get('/:id', mid, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if (!note) return res.status(404).json({ error: 'Note not found' });

    res.json(note);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Update a note by ID (only if user owns it)
router.put('/updated', mid, async (req, res) => {
  const { title, description } = req.body;

  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, description },
      { new: true }
    );

    if (!note) return res.status(404).json({ error: 'Note not found or not authorized' });

    res.json({ message: 'Note updated successfully', note });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Delete a note by ID (only if user owns it)
router.delete('/:id', mid, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!note) return res.status(404).json({ error: 'Note not found or not authorized' });

    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
