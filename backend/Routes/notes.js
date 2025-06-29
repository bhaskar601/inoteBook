// routes/notes.js
const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes');

// ✅ Create a new note
router.post('/', async (req, res) => {
  const { title, description } = req.body;

  try {
    const existingNote = await Notes.findOne({ description });
    if (existingNote) return res.status(400).json({ error: 'Note with this description already exists' });

    const note = new Notes({ title, description });
    await note.save();
    res.status(201).json({ message: 'Note created successfully', note });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Get all notes
router.get('/', async (req, res) => {
  try {
    const notes = await Notes.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Get a single note by ID
router.get('/:id', async (req, res) => {
  try {
    const note = await Notes.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });

    res.json(note);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Update a note by ID
router.put('/:id', async (req, res) => {
  const { title, description } = req.body;

  try {
    const updatedNote = await Notes.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );

    if (!updatedNote) return res.status(404).json({ error: 'Note not found' });

    res.json({ message: 'Note updated successfully', note: updatedNote });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Delete a note by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedNote = await Notes.findByIdAndDelete(req.params.id);
    if (!deletedNote) return res.status(404).json({ error: 'Note not found' });

    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
