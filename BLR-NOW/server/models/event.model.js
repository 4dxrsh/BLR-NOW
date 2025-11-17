const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This links to the User model
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  // --- NEW FIELD BELOW ---
  address: {
    type: String,
    default: ''
  },
  rules: {
    type: String,
    default: 'Be respectful to all attendees.'
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true,
});

eventSchema.index({ location: '2dsphere' });
const Event = mongoose.model('Event', eventSchema);
module.exports = Event;