import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start as true

  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // Set header first
          axios.defaults.headers.common['x-auth-token'] = storedToken;
          // Call an endpoint to validate the token and get user data
          // We use the profile route since it's already protected
          const res = await axios.get('http://localhost:5000/api/profile/my-data');
          
          // Token is valid
          setToken(storedToken);
          setUser(res.data.user);

        } catch (err) {
          // Token is invalid or expired
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['x-auth-token'];
          setToken(null);
          setUser(null);
        }
      }
      // Finished validation (or there was no token)
      setLoading(false);
    };

    validateToken();
  }, []); // Run only once on app load

  const login = async (username, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['x-auth-token'] = res.data.token;
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const register = async (username, password) => {
    await axios.post('http://localhost:5000/api/auth/register', { username, password });
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout, loading }}>
      {/* Only render children when NOT loading */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};