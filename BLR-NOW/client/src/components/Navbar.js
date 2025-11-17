import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { token, logout, user } = useAuth(); // Get user info

  return (
    <nav className="navbar">
      {/* If logged in, brand goes to /events. If logged out, to /welcome */}
      <Link to={token ? "/events" : "/welcome"} className="navbar-brand">BLR-NOW</Link>
      <div className="nav-links">
        {token ? (
          <>
            <Link to="/events" className="nav-link">Events</Link>
            <Link to="/host" className="nav-link">Host an Event</Link>
            <Link to="/upcoming" className="nav-link">Upcoming Events</Link>
            <Link to="/about" className="nav-link">About Us</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            <button onClick={logout} className="nav-btn-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/about" className="nav-link">About Us</Link>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link-btn">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;