import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
  
      if (token) {
        axios.defaults.withCredentials = true; // Add this line
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('Axios headers:', axios.defaults.headers);
  
        try {
          const response = await axios.get('http://localhost:4000/api/users/check-auth');
          setUser(response.data.user);
        } catch (error) {
          console.error('Error checking authentication:', error);
          setUser(null);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
    };
  
    loadUser();
  }, []);
  
  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:4000/api/users/login', { username, password }, {
        withCredentials: true,
      });
      const { user, token } = response.data;
  
      setUser(user);
      localStorage.setItem('token', token);
      console.log('Token stored:', token); // Log the token here
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
      return user;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.get('http://localhost:4000/api/users/logout');
      setUser(null);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
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

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
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
