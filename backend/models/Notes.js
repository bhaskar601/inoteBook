const mongoose = require('mongoose'); // ✅ Corrected 'mongoos' to 'mongoose'

const { Schema } = mongoose;

const notesSchema = new Schema({
  title: {
    type: String,
    required: true,
  }, 
  description: {
    type: String,
    required: true,
    
  }

});

module.exports = mongoose.model('Notes', notesSchema);
