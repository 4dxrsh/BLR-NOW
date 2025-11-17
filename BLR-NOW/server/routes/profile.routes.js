const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const User = require('../models/user.model');
const Event = require('../models/event.model');
const RSVP = require('../models/rsvp.model');

// @route   GET /api/profile/my-data
// @desc    Get all data for the logged-in user's profile
router.get('/my-data', auth, async (req, res) => {
  try {
    const userId = req.user;

    // --- NEW LOGIC: Automatically update past events to "attended" ---
    // 1. Find all 'attending' RSVPs and populate their event date
    const attendingRsvps = await RSVP.find({ 
      user: userId, 
      status: 'attending' 
    }).populate('event', 'date'); // Only populate the event's date

    // 2. Filter to find which ones are now in the past
    const now = new Date();
    const idsToUpdate = attendingRsvps
      .filter(rsvp => rsvp.event && rsvp.event.date < now) // Check if event date is before now
      .map(rsvp => rsvp._id); // Get just the RSVP IDs

    // 3. If there are any, update their status to 'attended'
    if (idsToUpdate.length > 0) {
      await RSVP.updateMany(
        { _id: { $in: idsToUpdate } },
        { $set: { status: 'attended' } }
      );
    }
    // --- END NEW LOGIC ---


    // 4. Get User Info (original logic)
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // 5. Get Hosted Events (original logic)
    const hostedEvents = await Event.find({ author: userId });

    // 6. Get Counts (original logic)
    // This count will now be accurate because we just ran the update
    const attendedCount = await RSVP.countDocuments({ user: userId, status: 'attended' });
    const hostedCount = hostedEvents.length;

    res.json({
      user,
      hostedEvents,
      attendedCount,
      hostedCount,
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;