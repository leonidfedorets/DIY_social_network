import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import AuthContainer from './components/AuthContainer';
import styled from 'styled-components';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import Avatar from './components/Avatar';
import LogoutButton from './components/LogoutButton';
import Login from './components/Login';
import Register from './components/Register';
import Button from './components/Button'; // New import for Button
import Menu from './components/Menu'; // New import for Menu
import Users from './components/Users'; // New import for Users

const AppContainer = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;
  position: relative;
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
    setShowLogin(true); // Automatically open login popup after successful registration
    setShowRegister(false);
  };

  const handleLogout = () => {
    setUser(null);
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
        {showLogin || showRegister ? null : (
          <>
            {showUsers && <Users />}
            {!showUsers && (
              <>
                <PostForm />
                <PostList />
              </>
            )}
          </>
        )}
      </AuthProvider>
    </AppContainer>
  );
};

export default App;

