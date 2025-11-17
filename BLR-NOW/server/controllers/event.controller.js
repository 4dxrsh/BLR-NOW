const Event = require('../models/event.model');

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    // Add 'rules' and 'address'
    const { title, description, category, date, latitude, longitude, rules, address } = req.body;

    const newEvent = new Event({
      title,
      description,
      category,
      date,
      rules,
      address, // Add address here
      author: req.user, // Get the user ID from the 'auth' middleware
      location: {
        type: 'Point',
        coordinates: [longitude, latitude], // [lng, lat]
      },
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get events near a point (the core geospatial query)
exports.getEventsNear = async (req, res) => {
  try {
    const { lng, lat } = req.query; // Get coords from query params

    if (!lng || !lat) {
      // If no coords, just return all events, populating the author's username
      const events = await Event.find({ date: { $gte: new Date() } }) // <-- FIX: Only find future events
        .populate('author', 'username') // Populate author username
        .sort({ date: 1 });
      return res.status(200).json(events);
    }

    const maxDistance = 5000; // 5000 meters (5km)

    const events = await Event.find({
      date: { $gte: new Date() }, // <-- FIX: Only find future events
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: maxDistance,
        },
      },
    }).populate('author', 'username'); // Populate author username

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};