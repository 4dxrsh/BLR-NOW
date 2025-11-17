import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet'; // Import Leaflet library
import axios from 'axios';

const BENGALURU_CENTER = [12.9716, 77.5946];

// NEW: Define a custom icon for the user's location
// This is a simple blue circle SVG
const userLocationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0iIzNCODJGNCIgc3Ryb2tlPSIjZmZmIiBzdHJvS2Utd2lkdGg9IjYiLz48L3N2Zz4=',
  iconSize: [25, 25], // Size of the icon
  popupAnchor: [1, -20], // Point from which the popup should open
});

function EventFetcher({ setEvents, fetchOnInit }) {
  const map = useMap();
  const fetchEvents = () => {
    const { lat, lng } = map.getCenter();
    axios.get(`http://localhost:5000/api/events?lat=${lat}&lng=${lng}`)
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => console.error('Error fetching events', error));
  };
  useEffect(() => {
    if (fetchOnInit) {
      fetchEvents();
    }
    map.on('moveend', fetchEvents);
    return () => {
      map.off('moveend', fetchEvents);
    };
  }, [map, setEvents, fetchOnInit]);
  return null;
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

// ADD userLocationMarker prop
function EventMap({ events, setEvents, fetchOnInit = false, onMapClick = null, newLocationMarker = null, children, whenCreated, userLocationMarker = null }) {
  return (
    <MapContainer 
      center={BENGALURU_CENTER} 
      zoom={13} 
      style={{ height: '100%', width: '100%', borderRadius: '12px' }}
      ref={whenCreated ? (map) => whenCreated(map) : null}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <EventFetcher setEvents={setEvents} fetchOnInit={fetchOnInit} />
      {onMapClick && <MapClickHandler onMapClick={onMapClick} />}
      
      {/* Map over existing events */}
      {events && events.map(event => (
        <Marker
          key={event._id}
          position={[event.location.coordinates[1], event.location.coordinates[0]]}
        >
          <Popup>
            <strong>{event.title}</strong><br />
            {event.description}<br />
            Hosted by: {event.author ? event.author.username : 'Unknown'}<br />
            Date: {new Date(event.date).toLocaleString()}
          </Popup>
        </Marker>
      ))}

      {/* Marker for new event creation */}
      {newLocationMarker && (
        <Marker 
          position={[newLocationMarker.lat, newLocationMarker.lng]} 
        >
          <Popup>New Event Location</Popup>
        </Marker>
      )}

      {/* NEW: Marker for user's detected location */}
      {userLocationMarker && (
        <Marker
          position={[userLocationMarker.lat, userLocationMarker.lng]}
          icon={userLocationIcon} // Use the custom blue icon
        >
          <Popup>You are here</Popup>
        </Marker>
      )}

      {children}
    </MapContainer>
  );
}

export default EventMap;