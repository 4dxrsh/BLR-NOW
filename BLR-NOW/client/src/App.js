import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventsPage from './pages/EventsPage';
import HostEventPage from './pages/HostEventPage';
import ProfilePage from './pages/ProfilePage';
import UpcomingEventsPage from './pages/UpcomingEventsPage';
import AboutPage from './pages/AboutPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import RootRedirect from './pages/RootRedirect'; // <-- IMPORT NEW COMPONENT
import './App.css'; 

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/welcome" element={<HomePage />} /> {/* <-- Landing page is now here */}
          
          {/* Root redirector */}
          <Route path="/" element={<RootRedirect />} /> {/* <-- '/' NOW REDIRECTS */}
          
          {/* Protected Routes Below */}
          <Route 
            path="/events" 
            element={
              <ProtectedRoute>
                <EventsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/host" 
            element={
              <ProtectedRoute>
                <HostEventPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/upcoming" 
            element={
              <ProtectedRoute>
                <UpcomingEventsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/map" 
            element={
              <ProtectedRoute>
                <EventsPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;