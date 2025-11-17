const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to local MongoDB");
    // IMPORTANT: Create the geospatial index after connecting
    const Event = require('./models/event.model');
    Event.collection.createIndex({ location: "2dsphere" })
      .then(() => console.log("Geospatial index created"))
      .catch(err => console.error("Index creation error:", err));
  })
  .catch(err => console.error("Could not connect to MongoDB", err));

// Routes
app.use('/api/events', require('./routes/event.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/rsvp', require('./routes/rsvp.routes')); // <-- ADD THIS
app.use('/api/profile', require('./routes/profile.routes')); // <-- ADD THIS

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});