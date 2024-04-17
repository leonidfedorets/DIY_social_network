import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import AuthContainer from './components/AuthContainer';
import styled from 'styled-components';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import Avatar from './components/Avatar';
import LogoutButton from './components/LogoutButton';
import Login from './components/Login';
import Register from './components/Register';
import Button from './components/Button';
import Menu from './components/Menu';
import Users from './components/Users';
import axios from 'axios';
import Footer from './components/Footer';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: Arial, sans-serif;
`;

const MainContent = styled.div`
  flex-grow: 1;
  padding: 20px;
`;

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);
  const [showUsers, setShowUsers] = useState(false);

  const toggleLogin = () => {
    setShowLogin(!showLogin);
    setShowRegister(false);
    setShowUsers(false);
  };

  const toggleRegister = () => {
    setShowRegister(!showRegister);
    setShowLogin(false);
    setShowUsers(false);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowLogin(false);
    setShowRegister(false);
  };

  const handleRegisterSuccess = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const handleLogout = async () => {
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

  const handleHomeClick = () => {
    setShowLogin(false);
    setShowRegister(false);
    setShowUsers(false);
  };

  const handleCategoriesClick = () => {
    // Implement logic for Categories click
  };

  const handleUsersClick = () => {
    setShowUsers(true);
    setShowLogin(false);
    setShowRegister(false);
  };

  const handleSettingsClick = () => {
    // Implement logic for Settings click
  };

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
  
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('Axios headers:', axios.defaults.headers); // Log the headers
  
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

  return (
    <AppContainer>
      <AuthProvider>
        <AuthContainer>
          <Menu
            onHomeClick={handleHomeClick}
            onCategoriesClick={handleCategoriesClick}
            onUsersClick={handleUsersClick}
            onSettingsClick={handleSettingsClick}
          />
          {user ? (
            <>
              <Avatar username={user.username} />
              <LogoutButton onLogout={handleLogout} />
            </>
          ) : (
            <>
              <Button onClick={toggleLogin}>Login</Button>
              <Button onClick={toggleRegister}>Register</Button>
            </>
          )}
          {showLogin && <Login onClose={toggleLogin} onLoginSuccess={handleLoginSuccess} />}
          {showRegister && <Register onClose={toggleRegister} onRegisterSuccess={handleRegisterSuccess} />}
        </AuthContainer>
        <MainContent>
          {showLogin || showRegister ? null : (
            <>
              {showUsers && <Users />}
              {!showUsers && (
                <>
                  <PostForm username={user ? user.username : null} /> {/* Pass username here */}
                  <div style={{ marginTop: '20px' }}>
                    <PostList />
                  </div>
                </>
              )}
            </>
          )}
        </MainContent>
        <Footer />
      </AuthProvider>
    </AppContainer>
  );
};

export default App;
