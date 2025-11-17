import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function AttendModal({ event, onClose }) {
  const [eta, setEta] = useState('');
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!rulesAccepted) {
      setError('You must accept the rules to attend.');
      return;
    }
    if (!eta) {
      setError('Please provide an expected time of arrival.');
      return;
    }

    try {
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      const body = {
        eventId: event._id,
        eta: eta,
      };
      
      const res = await axios.post('http://localhost:5000/api/rsvp/attend', body, config);
      setSuccess(res.data.msg); // "Event booking confirmed!"
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to RSVP. You may already be attending.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="modal-close-btn">&times;</button>
        <h2>Attend: {event.title}</h2>
        
        {!success ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="eta">Expected Time of Arrival:</label>
              <input
                type="text"
                id="eta"
                value={eta}
                onChange={(e) => setEta(e.target.value)}
                placeholder="e.g., 7:30 PM"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Host's Rules:</label>
              <div className="rules-box">
                {event.rules || 'Be respectful to all attendees.'}
              </div>
            </div>
            
            <div className="form-group-checkbox">
              <input
                type="checkbox"
                id="rulesCheck"
                checked={rulesAccepted}
                onChange={(e) => setRulesAccepted(e.target.checked)}
              />
              <label htmlFor="rulesCheck">I comply with these rules.</label>
            </div>
            
            {error && <p className="error-msg">{error}</p>}
            
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={!rulesAccepted}
            >
              Final Confirmation
            </button>
          </form>
        ) : (
          <div className="success-msg">
            <h3>{success}</h3>
            <p>See you there!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AttendModal;