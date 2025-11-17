import React, { useState } from 'react';
import { useMap } from 'react-leaflet';

// The button component now takes onLocationFound as a prop
function DetectLocationButton({ onLocationFound }) {
  const map = useMap();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const userLocation = { lat: latitude, lng: longitude };
        
        // Fly to the user's location
        map.flyTo([userLocation.lat, userLocation.lng], 14); // Zoom level 14
        
        // FIX: Call the new prop to set the marker
        if (onLocationFound) {
          onLocationFound(userLocation);
        }
        
        setLoading(false);
      },
      (error) => {
        console.error('Error getting location', error);
        alert('Could not detect your location. Please check browser permissions.');
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <button onClick={handleClick} className="detect-location-btn" disabled={loading} title="Detect My Location">
      {loading ? '...' : '📍'}
    </button>
  );
}

// The wrapper component now passes the prop down
function DetectLocationControl({ onLocationFound }) {
  return (
    <div className="leaflet-top leaflet-right">
      <div className="leaflet-control leaflet-bar">
        <DetectLocationButton onLocationFound={onLocationFound} />
      </div>
    </div>
  );
}

export default DetectLocationControl;