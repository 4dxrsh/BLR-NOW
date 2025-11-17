import React, { useState } from 'react';
import EventMap from '../components/EventMap';
import EventList from '../components/EventList';
import DetectLocationControl from '../components/DetectLocationButton';
import AttendModal from '../components/AttendModal';
import AddressSearch from '../components/AddressSearch'; // <-- Import new component

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // NEW state for map features
  const [mapInstance, setMapInstance] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const handleAttendClick = (event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  // NEW handler for the detect location button
  const handleLocationFound = (latlng) => {
    setUserLocation(latlng);
  };

  return (
    <> 
      <div className="page-layout">
        <div className="map-container-left">
          <EventMap 
            events={events}    
            setEvents={setEvents}
            whenCreated={setMapInstance} // <-- Get map instance
            userLocationMarker={userLocation} // <-- Pass user location for marker
          >
            <DetectLocationControl onLocationFound={handleLocationFound} />
          </EventMap>
        </div>
        
        <div className="content-container-right">
          {/* NEW: Add the address search bar */}
          {mapInstance && <AddressSearch map={mapInstance} />}
          
          <h2 className="content-header">Events Near You</h2>
          <EventList 
            events={events} 
            onAttendClick={handleAttendClick} 
          /> 
        </div>
      </div>
      
      {modalOpen && selectedEvent && (
        <AttendModal 
          event={selectedEvent} 
          onClose={handleCloseModal} 
        />
      )}
    </>
  );
}

export default EventsPage;