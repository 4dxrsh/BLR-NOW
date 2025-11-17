const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const RSVP = require('../models/rsvp.model');
const Event = require('../models/event.model');

// @route   POST /api/rsvp/attend
// @desc    RSVP to an event
router.post('/attend', auth, async (req, res) => {
  try {
    const { eventId, eta } = req.body;
    const userId = req.user;

    // Check if RSVP already exists
    const existingRSVP = await RSVP.findOne({ user: userId, event: eventId });
    if (existingRSVP) {
      return res.status(400).json({ msg: 'You are already attending this event.' });
    }

    // Create new RSVP
    const newRSVP = new RSVP({
      user: userId,
      event: eventId,
      eta: eta,
    });
    await newRSVP.save();

    // Add user to the event's attendee list
    await Event.findByIdAndUpdate(eventId, {
      $push: { attendees: userId }
    });

    res.status(201).json({ msg: 'Event booking confirmed!', rsvp: newRSVP });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/rsvp/my-upcoming
// @desc    Get all of a user's upcoming RSVPs
router.get('/my-upcoming', auth, async (req, res) => {
  try {
    const upcomingEvents = await RSVP.find({ user: req.user, status: 'attending' })
      .populate({
        path: 'event',
        populate: { path: 'author', select: 'username' } // Populate event author
      })
      .sort({ 'event.date': 1 }); // Sort by the event's date

    res.json(upcomingEvents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;