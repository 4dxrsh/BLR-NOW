import React, { useState } from 'react';

function AddressSearch({ map }) {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddressSearch = async (e) => {
    e.preventDefault();
    if (!address || !map) return;

    setLoading(true);
    try {
      // Use Nominatim API for forward geocoding
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const location = { lat: parseFloat(lat), lng: parseFloat(lon) };
        
        // Fly the map to the new location
        map.flyTo([location.lat, location.lng], 14); // Zoom level 14
      } else {
        alert('Address not found. Please try a different search.');
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      alert('Error finding address. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="address-search-container">
      <form onSubmit={handleAddressSearch}>
        <div className="address-input-group">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Search by address or area..."
          />
          <button type="submit" className="btn-secondary" disabled={loading}>
            {loading ? '...' : 'Go'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddressSearch;