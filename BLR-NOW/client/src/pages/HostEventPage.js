// FIXED: Added 'useEffect' to the import list
import React, { useState, useEffect } from 'react'; 
import { useMap } from 'react-leaflet';
import EventMap from '../components/EventMap';
import CreateEvent from '../components/CreateEvent';
import DetectLocationControl from '../components/DetectLocationButton';

// We need to wrap the map to get a 'map' instance for flying
function MapController({ map, newLocation }) {
  // This 'useEffect' is now defined
  useEffect(() => {
    if (newLocation) {
      map.flyTo([newLocation.lat, newLocation.lng], 15);
    }
  }, [newLocation, map]);
  return null;
}

function HostEventPage() {
  const [events, setEvents] = useState([]);
  const [newLocation, setNewLocation] = useState(null);
  const [newAddress, setNewAddress] = useState(''); // New state for address
  const [mapInstance, setMapInstance] = useState(null); // State to hold map instance

  const handleEventCreated = () => {
    setEvents([]); 
    setNewLocation(null); 
    setNewAddress('');
  };

  // REVERSE GEOCODING (LatLng -> Address)
  const handleMapClick = async (latlng) => {
    setNewLocation(latlng);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`);
      const data = await response.json();
      setNewAddress(data.display_name || 'Address not found');
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      setNewAddress('Could not fetch address');
    }
  };

  // FORWARD GEOCODING (Address -> LatLng)
  const handleAddressSearch = async (address) => {
    if (!address) return;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const location = { lat: parseFloat(lat), lng: parseFloat(lon) };
        setNewLocation(location);
        setNewAddress(display_name);
        // Fly map to new location
        if (mapInstance) {
          mapInstance.flyTo([location.lat, location.lng], 15);
        }
      } else {
        alert('Address not found');
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      alert('Error finding address');
    }
  };

  return (
    <div className="page-layout">
      <div className="map-container-left">
        <EventMap 
          events={events}
          setEvents={setEvents}
          fetchOnInit={true} 
          onMapClick={handleMapClick} 
          newLocationMarker={newLocation} 
          // Pass the map instance up when it's created
          whenCreated={setMapInstance} 
        >
          {/* ADDED: Detect location button */}
          <DetectLocationControl />
          {/* ADDED: Map controller for flying */}
          {mapInstance && <MapController map={mapInstance} newLocation={newLocation} />}
        </EventMap>
      </div>
      
      <div className="content-container-right">
        <CreateEvent 
          onEventCreated={handleEventCreated} 
          newLocation={newLocation} 
          newAddress={newAddress} // Pass address to form
          onAddressSearch={handleAddressSearch} // Pass search handler
        />
      </div>
    </div>
  );
}

// This export default line was fine, but was blocked by the error above
export default HostEventPage;