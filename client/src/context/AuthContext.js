import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const loginUser = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:4000/api/users/login', {
        username,
        password,
      });
      const { user, token } = response.data;
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('token', token);
    } catch (error) {
      console.error('Error logging in:', error);
      throw new Error('Error logging in');
    }
  };

  const logoutUser = async () => {
    try {
      await axios.get('http://localhost:4000/api/users/logout');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Error logging out:', error);
      throw new Error('Error logging out');
    }
  };

  const checkAuth = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/users/check-auth', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error checking authentication:', error);
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
    }
  };

  const values = {
    user,
    token,
    isAuthenticated,
    loginUser,
    logoutUser,
    checkAuth,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext }; // Remove useAuth from exports





