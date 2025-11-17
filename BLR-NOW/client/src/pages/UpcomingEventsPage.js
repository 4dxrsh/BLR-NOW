import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// This card is slightly different from the profile one
function UpcomingEventCard({ rsvp }) {
  const { event } = rsvp;
  return (
    <div className="upcoming-event-card">
      <div className="upcoming-event-details">
        <h3>{event.title}</h3>
        <p className="upcoming-event-host">
          Hosted by: <strong>{event.author.username}</strong>
        </p>
        <p className="upcoming-event-date">
          {new Date(event.date).toLocaleString()}
        </p>
        <p className="upcoming-event-address">
          {event.address || 'Location on map'}
        </p>
        <p className="upcoming-event-eta">
          Your ETA: <strong>{rsvp.eta}</strong>
        </p>
      </div>
      <div className="upcoming-event-category">
        {event.category}
      </div>
    </div>
  );
}

function UpcomingEventsPage() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const config = {
          headers: { 'x-auth-token': token },
        };
        const res = await axios.get('http://localhost:5000/api/rsvp/my-upcoming', config);
        setUpcomingEvents(res.data);
      } catch (err) {
        setError('Failed to fetch upcoming events.');
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, [token]);

  return (
    <div className="upcoming-events-page">
      <h1>My Upcoming Events</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error-msg">{error}</p>}
      {!loading && upcomingEvents.length === 0 && (
        <p>You have no upcoming events. Go attend some!</p>
      )}
      {!loading && upcomingEvents.length > 0 && (
        <div className="upcoming-events-list">
          {upcomingEvents.map(rsvp => (
            <UpcomingEventCard key={rsvp._id} rsvp={rsvp} />
          ))}
        </div>
      )}
    </div>
  );
}

export default UpcomingEventsPage;