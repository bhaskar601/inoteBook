const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
require('dotenv').config(); // Load environment variables


// ✅ MongoDB URI (keep it in .env in production)
const MONGODB_URI = process.env.MONGODB_URI

// ✅ Middleware
app.use(cors()); // allow requests from frontend
app.use(express.json()); // parse JSON requests

// ✅ Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((error) => console.error('❌ MongoDB connection error:', error));

// ✅ Import Routers (user.js now exports router + tokenBlacklist)
const userRoutes = require('./Routes/user');
const notesRoutes = require('./Routes/notes');

// ✅ Register Routes
app.use('/api/user', userRoutes.router); // 👈 use .router because user.js exports an object
app.use('/api/notes', notesRoutes);      // notes route exports just a router

// ✅ Root Route
app.get('/', (req, res) => {
  res.send('✅ Hello from Backend!');
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
