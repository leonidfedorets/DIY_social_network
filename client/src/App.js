import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import styled, { keyframes } from 'styled-components';
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

const fadeIn = keyframes`from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); }`;
const float = keyframes`0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); }`;
const shimmer = keyframes`0% { background-position: -200% center; } 100% { background-position: 200% center; }`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex-grow: 1;
  width: 100%;
  animation: ${fadeIn} 0.4s ease;
`;

/* ── LANDING PAGE ── */

const Hero = styled.section`
  position: relative;
  min-height: 92vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 120px 24px 80px;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,58,237,0.18) 0%, transparent 70%),
                radial-gradient(ellipse 50% 40% at 80% 80%, rgba(59,130,246,0.12) 0%, transparent 60%);
    pointer-events: none;
  }
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(124,58,237,0.12);
  border: 1px solid rgba(124,58,237,0.3);
  border-radius: 100px;
  padding: 6px 16px;
  font-size: 0.82rem;
  font-weight: 600;
  color: #a78bfa;
  margin-bottom: 28px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.6rem, 7vw, 5rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin-bottom: 20px;
  color: #f1f5f9;

  span {
    background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #34d399 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: ${shimmer} 3s linear infinite;
  }
`;

const HeroSubtitle = styled.p`
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: #94a3b8;
  max-width: 600px;
  margin: 0 auto 40px;
  line-height: 1.7;
`;

const HeroCTA = styled.div`
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 64px;
`;

const BtnPrimary = styled.button`
  padding: 14px 32px;
  background: linear-gradient(135deg, #7c3aed, #3b82f6);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(124,58,237,0.45); opacity: 0.92; }
`;

const BtnSecondary = styled.button`
  padding: 14px 32px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 12px;
  color: #f1f5f9;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: rgba(255,255,255,0.1); transform: translateY(-2px); }
`;

const HeroStats = styled.div`
  display: flex;
  gap: 48px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Stat = styled.div`
  text-align: center;
  .num { font-size: 2rem; font-weight: 800; color: #f1f5f9; }
  .label { font-size: 0.85rem; color: #64748b; margin-top: 4px; }
`;

/* ── FEATURES ── */

const Section = styled.section`
  max-width: 1100px;
  margin: 0 auto;
  padding: 80px 24px;
`;

const SectionLabel = styled.p`
  text-align: center;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #7c3aed;
  margin-bottom: 12px;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 800;
  color: #f1f5f9;
  margin-bottom: 16px;
`;

const SectionDesc = styled.p`
  text-align: center;
  color: #64748b;
  font-size: 1rem;
  max-width: 500px;
  margin: 0 auto 56px;
  line-height: 1.7;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const FeatureCard = styled.div`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  padding: 28px;
  transition: all 0.25s;
  animation: ${fadeIn} 0.5s ease both;
  animation-delay: ${p => p.delay || '0s'};

  &:hover {
    border-color: rgba(124,58,237,0.3);
    background: rgba(124,58,237,0.05);
    transform: translateY(-3px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.3);
  }

  .icon {
    font-size: 2rem;
    margin-bottom: 16px;
    animation: ${float} 3s ease-in-out infinite;
    animation-delay: ${p => p.delay || '0s'};
    display: inline-block;
  }

  h3 { font-size: 1.1rem; font-weight: 700; color: #f1f5f9; margin-bottom: 8px; }
  p { font-size: 0.9rem; color: #64748b; line-height: 1.6; }
`;

/* ── CATEGORIES ── */

const CatDivider = styled.div`
  border-top: 1px solid rgba(255,255,255,0.06);
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 14px;
`;

const CatCard = styled.button`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px;
  padding: 24px 16px;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s;
  color: inherit;

  &:hover {
    border-color: ${p => p.color || 'rgba(124,58,237,0.4)'};
    background: ${p => p.bg || 'rgba(124,58,237,0.07)'};
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.25);
  }

  .cat-icon { font-size: 2rem; margin-bottom: 10px; display: block; }
  .cat-name { font-size: 0.88rem; font-weight: 600; color: #e2e8f0; display: block; }
  .cat-count { font-size: 0.75rem; color: #475569; margin-top: 4px; display: block; }
`;

/* ── HOW IT WORKS ── */

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
  position: relative;
`;

const Step = styled.div`
  text-align: center;
  padding: 24px;

  .step-num {
    width: 48px; height: 48px;
    background: linear-gradient(135deg, #7c3aed, #3b82f6);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; font-weight: 800; color: white;
    margin: 0 auto 16px;
  }

  h3 { font-size: 1rem; font-weight: 700; color: #f1f5f9; margin-bottom: 8px; }
  p { font-size: 0.88rem; color: #64748b; line-height: 1.6; }
`;

/* ── FEED (logged in) ── */

const FeedWrap = styled.div`
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  padding: 100px 20px 40px;
`;

const FeedHero = styled.div`
  margin-bottom: 36px;
  h2 { font-size: 1.6rem; font-weight: 700; color: #f1f5f9; }
  p { color: #64748b; margin-top: 4px; }
`;

/* ── CTA BANNER ── */

const CTABanner = styled.section`
  margin: 0 24px 80px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(124,58,237,0.2), rgba(59,130,246,0.15));
  border: 1px solid rgba(124,58,237,0.25);
  padding: 60px 32px;
  text-align: center;

  h2 { font-size: clamp(1.6rem, 4vw, 2.4rem); font-weight: 800; color: #f1f5f9; margin-bottom: 12px; }
  p { color: #94a3b8; font-size: 1rem; margin-bottom: 28px; }
`;

const FEATURES = [
  { icon: '🔨', title: 'Share Your Projects', desc: 'Post step-by-step DIY guides, photos, and videos. Help others learn from your experience.', delay: '0s' },
  { icon: '🤝', title: 'Connect with Makers', desc: 'Join a thriving community of builders, crafters, and hobbyists who share your passion.', delay: '0.1s' },
  { icon: '💡', title: 'Get Inspired Daily', desc: 'Discover thousands of creative projects across every skill level and category.', delay: '0.2s' },
  { icon: '⭐', title: 'Build Your Reputation', desc: 'Get recognized for your skills. Top makers earn badges and featured placements.', delay: '0.3s' },
  { icon: '📚', title: 'Learn New Skills', desc: 'Access tutorials, tips, and techniques shared by experts in every DIY domain.', delay: '0.4s' },
  { icon: '🛒', title: 'Find the Right Tools', desc: 'Community-curated tool lists and material recommendations for every project.', delay: '0.5s' },
];

const CATEGORIES = [
  { icon: '🪵', name: 'Woodworking', count: '2.4k projects', color: 'rgba(245,158,11,0.4)', bg: 'rgba(245,158,11,0.07)' },
  { icon: '⚡', name: 'Electronics', count: '1.8k projects', color: 'rgba(59,130,246,0.4)', bg: 'rgba(59,130,246,0.07)' },
  { icon: '🏠', name: 'Home Decor', count: '3.1k projects', color: 'rgba(236,72,153,0.4)', bg: 'rgba(236,72,153,0.07)' },
  { icon: '🌱', name: 'Gardening', count: '1.2k projects', color: 'rgba(34,197,94,0.4)', bg: 'rgba(34,197,94,0.07)' },
  { icon: '🎨', name: 'Art & Crafts', count: '2.9k projects', color: 'rgba(168,85,247,0.4)', bg: 'rgba(168,85,247,0.07)' },
  { icon: '🔧', name: 'Repairs', count: '987 projects', color: 'rgba(249,115,22,0.4)', bg: 'rgba(249,115,22,0.07)' },
  { icon: '🧵', name: 'Sewing', count: '756 projects', color: 'rgba(20,184,166,0.4)', bg: 'rgba(20,184,166,0.07)' },
  { icon: '🍳', name: 'Cooking', count: '1.5k projects', color: 'rgba(239,68,68,0.4)', bg: 'rgba(239,68,68,0.07)' },
];

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

  const handlePostSubmit = (newPost) => setPosts([newPost, ...posts]);

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
              toast('Account created! Please sign in.', { theme: 'dark', className: 'success-toast' });
            }}
          />
        )}

        {!loading && (
          <MainContent>
            {showUsers && (
              <div style={{ maxWidth: 900, margin: '0 auto', padding: '100px 20px 40px' }}>
                <Users />
              </div>
            )}
            {showBackoffice && user?.role === 'admin' && (
              <div style={{ maxWidth: 900, margin: '0 auto', padding: '100px 20px 40px' }}>
                <Backoffice user={user} />
              </div>
            )}

            {isHome && (
              <>
                {/* If logged in — show feed */}
                {user ? (
                  <FeedWrap>
                    <FeedHero>
                      <h2>Welcome back, {user.username} 👋</h2>
                      <p>Share your latest project or explore what the community is building.</p>
                    </FeedHero>
                    <PostForm username={user.username} onPostSubmit={handlePostSubmit} />
                    <PostList user={user} externalPosts={posts} />
                  </FeedWrap>
                ) : (
                  /* Not logged in — show landing page */
                  <>
                    <Hero>
                      <HeroBadge>✨ The DIY Community Platform</HeroBadge>
                      <HeroTitle>
                        Build, Share &amp; <br />
                        <span>Inspire Together</span>
                      </HeroTitle>
                      <HeroSubtitle>
                        DIY Network is where makers, builders, and crafters share their passion.
                        Post your projects, learn new skills, and connect with thousands of creators.
                      </HeroSubtitle>
                      <HeroCTA>
                        <BtnPrimary onClick={() => setShowRegister(true)}>
                          Start Sharing Free →
                        </BtnPrimary>
                        <BtnSecondary onClick={() => setShowLogin(true)}>
                          Sign In
                        </BtnSecondary>
                      </HeroCTA>
                      <HeroStats>
                        <Stat><div className="num">12k+</div><div className="label">Active Makers</div></Stat>
                        <Stat><div className="num">48k+</div><div className="label">Projects Shared</div></Stat>
                        <Stat><div className="num">8</div><div className="label">Categories</div></Stat>
                        <Stat><div className="num">100%</div><div className="label">Free to Join</div></Stat>
                      </HeroStats>
                    </Hero>

                    {/* Features */}
                    <Section>
                      <SectionLabel>Why DIY Network</SectionLabel>
                      <SectionTitle>Everything a maker needs</SectionTitle>
                      <SectionDesc>
                        One platform to share your work, discover inspiration, and grow your skills.
                      </SectionDesc>
                      <FeaturesGrid>
                        {FEATURES.map(f => (
                          <FeatureCard key={f.title} delay={f.delay}>
                            <div className="icon">{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                          </FeatureCard>
                        ))}
                      </FeaturesGrid>
                    </Section>

                    {/* Categories */}
                    <CatDivider />
                    <Section>
                      <SectionLabel>Browse by Category</SectionLabel>
                      <SectionTitle>Find your passion</SectionTitle>
                      <SectionDesc>
                        From woodworking to electronics — there's a community for every craft.
                      </SectionDesc>
                      <CategoriesGrid>
                        {CATEGORIES.map(c => (
                          <CatCard key={c.name} color={c.color} bg={c.bg}
                            onClick={() => setShowRegister(true)}>
                            <span className="cat-icon">{c.icon}</span>
                            <span className="cat-name">{c.name}</span>
                            <span className="cat-count">{c.count}</span>
                          </CatCard>
                        ))}
                      </CategoriesGrid>
                    </Section>

                    {/* How it works */}
                    <CatDivider />
                    <Section>
                      <SectionLabel>How it works</SectionLabel>
                      <SectionTitle>Start in minutes</SectionTitle>
                      <SectionDesc>
                        Joining the DIY Network community is fast, free, and easy.
                      </SectionDesc>
                      <StepsGrid>
                        <Step>
                          <div className="step-num">1</div>
                          <h3>Create your account</h3>
                          <p>Sign up for free in seconds — no credit card needed.</p>
                        </Step>
                        <Step>
                          <div className="step-num">2</div>
                          <h3>Post your project</h3>
                          <p>Upload photos, write a description, and share your process.</p>
                        </Step>
                        <Step>
                          <div className="step-num">3</div>
                          <h3>Connect &amp; grow</h3>
                          <p>Get feedback, follow makers, and build your reputation.</p>
                        </Step>
                        <Step>
                          <div className="step-num">4</div>
                          <h3>Get inspired</h3>
                          <p>Discover new projects every day from creators around the world.</p>
                        </Step>
                      </StepsGrid>
                    </Section>

                    {/* CTA Banner */}
                    <CTABanner>
                      <h2>Ready to share your first project?</h2>
                      <p>Join 12,000+ makers already on DIY Network. It's completely free.</p>
                      <BtnPrimary onClick={() => setShowRegister(true)}>
                        Create Free Account →
                      </BtnPrimary>
                    </CTABanner>
                  </>
                )}
              </>
            )}
          </MainContent>
        )}

        <Footer />
      </ErrorBoundary>
    </AppContainer>
  );
};

export default App;
