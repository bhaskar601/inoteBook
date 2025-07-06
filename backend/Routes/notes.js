const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
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
    const user = await User.find({ id: req.user.id });
    const notes=await Note.find({user:user})

    // console.log(notes);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Get a single note by ID (must be user's own note)


router.put('/updatenote/:id', mid, async (req, res) => {
  try {
    const { title, description } = req.body;

    // Validate note _id
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid Note ID' });
    }

    console.log('Note ID:', req.params.id);
    console.log('Custom User ID:', req.user.id);

    // Step 1: Find user by custom `id` field
    const user = await User.findOne({ id: req.user.id });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Step 2: Use user's _id to update note
    const note = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        user: user._id  // ✅ match using MongoDB ObjectId
      },
      {
        $set: { title, description },
      },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ error: 'Note not found or unauthorized' });
    }

    res.json({ message: 'Note updated successfully', note });

  } catch (error) {
    console.error('Update failed:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// ✅ Delete a note by ID (only if user owns it)
router.delete('/delete/:id', mid, async (req, res) => {
  try {
    // ✅ Validate Note ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid Note ID' });
    }

    console.log("Note ID:", req.params.id);
    console.log("Custom User ID:", req.user.id);

    // ✅ Step 1: Find the user by custom ID
    const user = await User.findOne({ id: req.user.id });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // ✅ Step 2: Delete the note if it belongs to the user
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: user._id
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found or not authorized' });
    }

    res.json({ message: 'Note deleted successfully', deletedNote: note });

  } catch (err) {
    console.error("Delete failed:", err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
