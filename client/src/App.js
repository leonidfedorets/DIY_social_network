import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthContainer from './components/AuthContainer';
import styled from 'styled-components';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import Avatar from './components/Avatar';
import LogoutButton from './components/LogoutButton';
import LoginPopup from './components/LoginPopup';
import RegisterPopup from './components/RegisterPopup';
import Button from './components/Button';
import Menu from './components/Menu';
import Users from './components/Users';
import Backoffice from './components/Backoffice';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import axios from 'axios';
import toast from 'react-simple-toasts';
import 'react-simple-toasts/dist/theme/dark.css';
import './App.css'

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
  const { user, logout, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showBackoffice, setShowBackoffice] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [posts, setPosts] = useState([]);

  const toggleLogin = () => {
    setShowLogin(!showLogin);
    setShowRegister(false);
    setShowUsers(false);
    setShowBackoffice(false);
  };

  const toggleRegister = () => {
    setShowRegister(!showRegister);
    setShowLogin(false);
    setShowUsers(false);
    setShowBackoffice(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast('Logout successful', { theme: 'dark', className: 'success-toast' });
    } catch (error) {
      toast('Error logging out', { theme: 'dark', className: 'error-toast' });
    }
  };

  const handleHomeClick = () => {
    setShowLogin(false);
    setShowRegister(false);
    setShowUsers(false);
    setShowBackoffice(false);
  };

  const handleCategoriesClick = () => {
    // Implement logic for Categories click
  };

  const handleUsersClick = () => {
    setShowUsers(true);
    setShowLogin(false);
    setShowRegister(false);
    setShowBackoffice(false);
  };

  const handleSettingsClick = () => {
    // Implement logic for Settings click
  };

  const handleBackofficeClick = () => {
    setShowBackoffice(true);
    setShowLogin(false);
    setShowRegister(false);
    setShowUsers(false);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handlePostSubmit = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <AppContainer>
      <AuthProvider>
        <ErrorBoundary>
          <AuthContainer>
            <Menu
              onHomeClick={handleHomeClick}
              onCategoriesClick={handleCategoriesClick}
              onUsersClick={handleUsersClick}
              onSettingsClick={handleSettingsClick}
              onBackofficeClick={handleBackofficeClick}
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
            {showLogin && <LoginPopup onClose={toggleLogin} />}
            {showRegister && <RegisterPopup onClose={toggleRegister} />}
          </AuthContainer>
          <MainContent>
            {!loading && (
              <>
                {showUsers && <Users />}
                {showBackoffice && user?.role === 'admin' && <Backoffice user={user} />}
                {!showUsers && !showBackoffice && (
                  <>
                    <PostForm username={user ? user.username : null} onPostSubmit={handlePostSubmit} />
                    <div style={{ marginTop: '20px' }}>
                      <PostList user={user} />
                    </div>
                  </>
                )}
              </>
            )}
          </MainContent>
          <Footer />
        </ErrorBoundary>
      </AuthProvider>
     
    </AppContainer>
  );
};

export default App;
