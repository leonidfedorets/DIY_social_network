import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check if the user is logged in
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('http://localhost:4000/api/users/check-auth', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.user) {
          setUser(response.data.user);
        }
      } catch (error) {
        if (error.response.status === 401) {
          // Token is invalid or user is not authenticated
          setUser(null);
          localStorage.removeItem('token');
        } else {
          console.error('Error checking authentication:', error);
          setUser(null); // Set user to null if any other error occurs
        }
      }
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:4000/api/users/login', { username, password }, {
        withCredentials: true,
      });
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token); // Store token in local storage
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const register = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:4000/api/users/register', { username, password }, {
        withCredentials: true,
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:4000/api/users/logout', {}, {
        withCredentials: true,
      });
      setUser(null);
      localStorage.removeItem('token'); // Remove token from local storage on logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext, AuthProvider, useAuth };
