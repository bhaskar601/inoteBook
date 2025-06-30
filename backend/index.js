// index.js

const express = require('express');
const mongoose = require('mongoose');
const user = require('./models/User');
const app = express();
const PORT = process.env.PORT || 3000;
const router = express.Router();

// Middleware
app.use(express.json()); // to parse JSON request bodies
app.use('/api/user', require('./Routes/user'));
app.use('/api/notes', require('./Routes/notes'));

// MongoDB Connection URI
const MONGODB_URI = 'mongodb+srv://bhaskarsahu2605:QXFf8mmUgznWRLB6@inotebokk.ecundke.mongodb.net/';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', err);
});

// Example route
app.get('/', (req, res) => {
  res.send('Hello from Backend!');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

