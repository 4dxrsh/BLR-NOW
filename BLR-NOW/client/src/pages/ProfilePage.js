import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Small card component for "My Events"
function MyEventCard({ event }) {
  return (
    <div className="my-event-card">
      <h4>{event.title}</h4>
      <p>{new Date(event.date).toLocaleString()}</p>
      <span>{event.category}</span>
    </div>
  );
}

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [hostedEvents, setHostedEvents] = useState([]);
  const [attendedCount, setAttendedCount] = useState(0);
  const [hostedCount, setHostedCount] = useState(0);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        const res = await axios.get('http://localhost:5000/api/profile/my-data', config);
        
        setProfile(res.data.user);
        setHostedEvents(res.data.hostedEvents);
        setAttendedCount(res.data.attendedCount);
        setHostedCount(res.data.hostedCount);

      } catch (err) {
        setError('Failed to fetch profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div className="error-msg">{error}</div>;
  }

  if (!profile) {
    return <div>User not found.</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <span>{profile.username.charAt(0).toUpperCase()}</span>
        </div>
        <div className="profile-info">
          <h1>{profile.username}</h1>
          <p>Joined: {new Date(profile.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>Stats</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Events Attended</h4>
              <p>{attendedCount}</p>
              {attendedCount === 0 && <span>(Feature coming soon)</span>}
            </div>
            <div className="stat-card">
              <h4>Events Hosted</h4>
              <p>{hostedCount}</p>
            </div>
            <div className="stat-card">
              <h4>Reviews</h4>
              <p>0</p> 
              <span>(Feature coming soon)</span>
            </div>
            <div className="stat-card">
              <h4>Rating</h4>
              <p>N/A</p>
              <span>(Feature coming soon)</span>
            </div>
          </div>
        </div>
        
        {/* THIS SECTION IS NOW REMOVED */}
        {/* <div className="profile-section">
          <h2>My Upcoming Events (RSVPs)</h2>
          ...
        </div> */}

        <div className="profile-section">
          <h2>My Hosted Events</h2>
          {hostedEvents.length > 0 ? (
            <div className="my-events-list">
              {hostedEvents.map(event => (
                <MyEventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <p>You have not hosted any events.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;