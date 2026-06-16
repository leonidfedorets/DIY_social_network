import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import styled from 'styled-components';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import LoginPopup from './components/LoginPopup';
import RegisterPopup from './components/RegisterPopup';
import Navbar from './components/Menu';
import Users from './components/Users';
import Backoffice from './components/Backoffice';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import toast from 'react-simple-toasts';
import 'react-simple-toasts/dist/theme/dark.css';
import './App.css';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex-grow: 1;
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  padding: 100px 20px 40px;
  animation: fadeIn 0.4s ease;
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 48px;

  h1 {
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 800;
    background: linear-gradient(135deg, #7c3aed, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 12px;
  }

  p {
    color: var(--text-secondary);
    font-size: 1.1rem;
  }
`;

const App = () => {
  const { user, logout, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showBackoffice, setShowBackoffice] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [posts, setPosts] = useState([]);

  const closeAll = () => {
    setShowLogin(false);
    setShowRegister(false);
    setShowUsers(false);
    setShowBackoffice(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast('Logged out successfully', { theme: 'dark', className: 'success-toast' });
    } catch {
      toast('Error logging out', { theme: 'dark', className: 'error-toast' });
    }
  };

  const handlePostSubmit = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const isHome = !showUsers && !showBackoffice;

  return (
    <AppContainer>
      <ErrorBoundary>
        <Navbar
          user={user}
          onHomeClick={closeAll}
          onUsersClick={() => { closeAll(); setShowUsers(true); }}
          onBackofficeClick={() => { closeAll(); setShowBackoffice(true); }}
          onLoginClick={() => { closeAll(); setShowLogin(true); }}
          onRegisterClick={() => { closeAll(); setShowRegister(true); }}
          onLogout={handleLogout}
        />

        {showLogin && <LoginPopup onClose={() => setShowLogin(false)} />}
        {showRegister && (
          <RegisterPopup
            onClose={() => setShowRegister(false)}
            onRegisterSuccess={() => {
              setShowRegister(false);
              toast('Registered! Please log in.', { theme: 'dark', className: 'success-toast' });
            }}
          />
        )}

        <MainContent>
          {!loading && (
            <>
              {isHome && (
                <>
                  <HeroSection>
                    <h1>Share Your DIY Projects</h1>
                    <p>Inspire the community with your creativity and craftsmanship</p>
                  </HeroSection>
                  <PostForm username={user?.username} onPostSubmit={handlePostSubmit} />
                  <PostList user={user} externalPosts={posts} />
                </>
              )}
              {showUsers && <Users />}
              {showBackoffice && user?.role === 'admin' && <Backoffice user={user} />}
            </>
          )}
        </MainContent>

        <Footer />
      </ErrorBoundary>
    </AppContainer>
  );
};

export default App;
