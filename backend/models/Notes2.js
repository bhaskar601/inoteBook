const mongoose = require('mongoose');

const { Schema } = mongoose;

const notesSchema = new Schema({
  
  title: {
    type: String,
    required: true,
  }, 
  description: {
    type: String,
    required: true,
  },
    
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Make sure your User model is named 'User'
    required: true, // Optional: set to true if every note must be linked to a user
  }
}, {
  timestamps: true // Optional: adds createdAt and updatedAt
});

module.exports = mongoose.model('Notes2', notesSchema);
