// index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ MongoDB Connection URI with DB name
const MONGODB_URI = 'mongodb+srv://bhaskarsahu2605:QXFf8mmUgznWRLB6@inotebokk.ecundke.mongodb.net/inotebook?retryWrites=true&w=majority&appName=inotebokk';

// ✅ Middleware
app.use(cors()); // Allow frontend to access backend
app.use(express.json()); // Parse JSON bodies

// ✅ Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((error) => console.error('❌ MongoDB connection error:', error));

// ✅ Routes
app.use('/api/user', require('./Routes/user'));   // Auth: login/register
app.use('/api/notes', require('./Routes/notes')); // Notes CRUD

// ✅ Test Route
app.get('/', (req, res) => {
  res.send('✅ Hello from Backend!');
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
