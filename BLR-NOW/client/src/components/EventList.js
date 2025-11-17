import React from 'react';

// Returns an emoji icon based on category
function getCategoryIcon(category) {
  switch (category.toLowerCase()) {
    case 'sports': return '⚽️';
    case 'music': return '🎵';
    case 'art': return '🎨';
    case 'study': return '📚';
    default: return '📍';
  }
}

// This is the individual card for an event
function EventCard({ event, onAttendClick }) {
  const icon = getCategoryIcon(event.category);

  return (
    <div className="event-card">
      <div className="event-card-icon">{icon}</div>
      <div className="event-card-details">
        <h3>{event.title}</h3>
        <p className="event-card-host">
          Hosted by: <strong>{event.author ? event.author.username : 'Unknown'}</strong>
        </p>
        <p className="event-card-date">
          {new Date(event.date).toLocaleString()}
        </p>
        {/* NEW: Display address */}
        <p className="event-card-address">
          {event.address || 'Location on map'}
        </p>
        <p className="event-card-desc">{event.description}</p>
        <span className="event-card-category">{event.category}</span>
      </div>
      
      <button 
        className="btn btn-primary btn-attend"
        onClick={() => onAttendClick(event)} // Pass the event up
      >
        Attend
      </button>
    </div>
  );
}

// This is the list that holds all the cards
function EventList({ events, onAttendClick }) {
  if (!events || events.length === 0) {
    return (
      <div className="event-list-empty">
        <p>No events found.</p>
        <p>Move the map or use 'Detect My Location' to find events near you.</p>
      </div>
    );
  }

  return (
    <div className="event-list">
      {events.map(event => (
        <EventCard 
          key={event._id} 
          event={event} 
          onAttendClick={onAttendClick} 
        />
      ))}
    </div>
  );
}

export default EventList;