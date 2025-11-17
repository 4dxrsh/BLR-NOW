import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// --- NEW HELPER FUNCTION ---
// Gets tomorrow's date at 00:00 and formats it for the input
const getTomorrowISOString = () => {
  const tomorrow = new Date();
  // Set date to tomorrow
  tomorrow.setDate(tomorrow.getDate() + 1);
  // Set time to 00:00 (midnight)
  tomorrow.setHours(0, 0, 0, 0);
  
  // Adjust for local timezone to get the correct 'YYYY-MM-DDT00:00'
  const offset = tomorrow.getTimezoneOffset();
  const localDate = new Date(tomorrow.getTime() - (offset * 60 * 1000));
  return localDate.toISOString().slice(0, 16);
};
// ----------------------------

function CreateEvent({ onEventCreated, newLocation, newAddress, onAddressSearch }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Sports');
  const [date, setDate] = useState('');
  const [rules, setRules] = useState('Be respectful to all attendees.');
  
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');

  // --- MODIFIED: Set the minDate once on component load ---
  const [minDate] = useState(getTomorrowISOString());
  // --------------------------------------------------------

  useEffect(() => {
    if (newLocation) {
      setLocation(newLocation);
    }
  }, [newLocation]);

  useEffect(() => {
    if (newAddress) {
      setAddress(newAddress);
    }
  }, [newAddress]);


  const { token } = useAuth(); // Get the token

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- REMOVED: All complex time validation is no longer needed ---

    if (!location) {
      alert('Please pick a location on the map to the left');
      return;
    }

    const newEvent = {
      title, 
      description, 
      category, 
      date,
      rules, 
      address: address, 
      latitude: location.lat,
      longitude: location.lng,
    };

    try {
      const config = {
        headers: { 'x-auth-token': token },
      };
      
      await axios.post('http://localhost:5000/api/events', newEvent, config);
      
      alert('Event Created!');
      // Clear form
      setTitle('');
      setDescription('');
      setDate('');
      setRules('Be respectful to all attendees.');
      setLocation(null);
      setAddress('');
      onEventCreated();
    } catch (error) {
      console.error('Error creating event', error.response?.data?.msg || error.message);
      alert('Failed to create event. Are you logged in?');
    }
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };
  
  const handleAddressSearchClick = (e) => {
    e.preventDefault();
    onAddressSearch(address);
  };

  // --- REMOVED: handleDateFocus is no longer needed ---

  return (
    <div className="create-event-form">
      <h3>Create an Event</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        
        <div className="form-group">
          <label>Address:</label>
          <div className="address-input-group">
            <input 
              type="text" 
              value={address} 
              onChange={handleAddressChange} 
              placeholder="Or type an address"
            />
            <button 
              className="btn-secondary" 
              onClick={handleAddressSearchClick}
            >
              Find
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Location: (Click map or use address search)</label>
          <div className="location-display">
            {location 
              ? `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}`
              : 'No location selected'
            }
          </div>
        </div>

        <div className="form-group">
          <label>General Rules:</label>
          <textarea value={rules} onChange={(e) => setRules(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Category:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Sports">Sports</option>
            <option value="Music">Music</option>
            <option value="Study">Study</option>
            <option value="Art">Art</option>
          </select>
        </div>
        <div className="form-group">
          <label>Date & Time:</label>
          <input 
            type="datetime-local" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} // Simplified onChange
            required 
            min={minDate} // --- THIS IS THE FIX ---
            // onFocus handler removed
          />
        </div>

        <button type="submit" className="btn btn-primary">[PUBLISH EVENT]</button>
      </form>
    </div>
  );
}

export default CreateEvent;