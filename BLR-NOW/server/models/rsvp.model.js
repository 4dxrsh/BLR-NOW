const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  eta: {
    type: String, // Expected Time of Arrival
    required: true,
  },
  status: {
    type: String,
    enum: ['attending', 'attended', 'cancelled'],
    default: 'attending',
  },
}, {
  timestamps: true,
});

// Ensure a user can only RSVP to an event once
rsvpSchema.index({ user: 1, event: 1 }, { unique: true });

const RSVP = mongoose.model('RSVP', rsvpSchema);
module.exports = RSVP;