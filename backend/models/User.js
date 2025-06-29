const mongoose = require('mongoose'); // ✅ Corrected 'mongoos' to 'mongoose'

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);
 // tab to ana hi padega hah hah haha