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
import InfoPage from './components/InfoPage';
import ErrorBoundary from './components/ErrorBoundary';
import toast from 'react-simple-toasts';
import 'react-simple-toasts/dist/theme/dark.css';
import './App.css';

const shimmer = keyframes`0%{background-position:-200% center}100%{background-position:200% center}`;
const fadeUp = keyframes`from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}`;
const floatAnim = keyframes`0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}`;

const AppContainer = styled.div`display:flex;flex-direction:column;min-height:100vh;`;
const MainContent = styled.main`flex-grow:1;width:100%;`;

/* ── HERO ── */
const Hero = styled.section`
  position:relative;
  min-height:96vh;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  text-align:center;
  padding:130px 24px 80px;
  overflow:hidden;
  &::before{
    content:'';position:absolute;inset:0;
    background:
      radial-gradient(ellipse 90% 60% at 50% -10%,rgba(245,158,11,0.14) 0%,transparent 70%),
      radial-gradient(ellipse 50% 40% at 85% 85%,rgba(239,68,68,0.08) 0%,transparent 60%);
    pointer-events:none;
  }
`;
const TapeStripe = styled.div`
  position:absolute;top:0;left:0;right:0;height:5px;
  background:repeating-linear-gradient(90deg,#f59e0b 0px,#f59e0b 24px,#0e0c0a 24px,#0e0c0a 32px);
  opacity:0.7;
`;
const HeroBadge = styled.div`
  display:inline-flex;align-items:center;gap:8px;
  background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);
  border-radius:100px;padding:7px 18px;
  font-size:0.78rem;font-weight:700;color:#f59e0b;
  margin-bottom:28px;letter-spacing:0.08em;text-transform:uppercase;
  animation:${fadeUp} 0.5s ease 0.1s both;
`;
const HeroTitle = styled.h1`
  font-size:clamp(2.8rem,7.5vw,5.4rem);
  font-weight:900;line-height:1.05;letter-spacing:-0.03em;
  margin-bottom:22px;color:#fef3c7;
  animation:${fadeUp} 0.5s ease 0.2s both;
  span{
    background:linear-gradient(135deg,#f59e0b 0%,#ef4444 50%,#f59e0b 100%);
    background-size:200% auto;
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
    animation:${shimmer} 3s linear infinite;
  }
`;
const HeroSub = styled.p`
  font-size:clamp(1rem,2.5vw,1.2rem);color:#b8a07a;
  max-width:620px;margin:0 auto 44px;line-height:1.75;
  animation:${fadeUp} 0.5s ease 0.3s both;
`;
const HeroCTA = styled.div`
  display:flex;gap:14px;justify-content:center;flex-wrap:wrap;
  margin-bottom:72px;
  animation:${fadeUp} 0.5s ease 0.4s both;
`;
const BtnPrimary = styled.button`
  padding:15px 36px;
  background:linear-gradient(135deg,#f59e0b,#d97706);
  border:none;border-radius:12px;color:#0e0c0a;
  font-size:1rem;font-weight:700;cursor:pointer;transition:all 0.2s;
  &:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(245,158,11,0.4);}
`;
const BtnSecondary = styled.button`
  padding:15px 36px;
  background:rgba(255,248,220,0.06);border:1px solid rgba(245,158,11,0.25);
  border-radius:12px;color:#fef3c7;font-size:1rem;font-weight:600;cursor:pointer;transition:all 0.2s;
  &:hover{background:rgba(245,158,11,0.1);border-color:rgba(245,158,11,0.5);transform:translateY(-2px);}
`;
const HeroStats = styled.div`
  display:flex;gap:56px;justify-content:center;flex-wrap:wrap;
  animation:${fadeUp} 0.5s ease 0.5s both;
`;
const Stat = styled.div`
  text-align:center;
  .num{font-size:2.2rem;font-weight:900;color:#f59e0b;}
  .lbl{font-size:0.82rem;color:#6b5a3e;margin-top:3px;text-transform:uppercase;letter-spacing:0.06em;}
`;

/* ── SECTIONS ── */
const Section = styled.section`max-width:1120px;margin:0 auto;padding:80px 24px;`;
const Divider = styled.div`border-top:1px solid rgba(245,158,11,0.1);`;
const SectionLabel = styled.p`
  text-align:center;font-size:0.75rem;font-weight:700;letter-spacing:0.12em;
  text-transform:uppercase;color:#f59e0b;margin-bottom:10px;
`;
const SectionTitle = styled.h2`
  text-align:center;font-size:clamp(1.8rem,4vw,2.8rem);font-weight:900;
  color:#fef3c7;margin-bottom:14px;letter-spacing:-0.02em;
`;
const SectionDesc = styled.p`
  text-align:center;color:#6b5a3e;font-size:1rem;max-width:520px;
  margin:0 auto 56px;line-height:1.75;
`;

/* ── FEATURES ── */
const FeatGrid = styled.div`display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px;`;
const FeatCard = styled.div`
  background:rgba(255,248,220,0.03);border:1px solid rgba(245,158,11,0.1);
  border-radius:16px;padding:30px;transition:all 0.25s;
  &:hover{border-color:rgba(245,158,11,0.35);background:rgba(245,158,11,0.04);transform:translateY(-3px);box-shadow:0 16px 40px rgba(0,0,0,0.4);}
  .icon{font-size:2.2rem;margin-bottom:18px;display:inline-block;animation:${floatAnim} 3s ease-in-out infinite;}
  h3{font-size:1.05rem;font-weight:700;color:#fef3c7;margin-bottom:8px;}
  p{font-size:0.9rem;color:#6b5a3e;line-height:1.65;}
`;

/* ── CATEGORIES ── */
const CatGrid = styled.div`display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;`;
const CatCard = styled.button`
  background:rgba(255,248,220,0.03);border:1px solid ${p=>p.color||'rgba(245,158,11,0.15)'};
  border-radius:14px;padding:28px 20px;cursor:pointer;text-align:center;transition:all 0.2s;color:inherit;
  &:hover{background:${p=>p.bg||'rgba(245,158,11,0.06)'};transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.3);}
  .ci{font-size:2.4rem;margin-bottom:12px;display:block;}
  .cn{font-size:0.95rem;font-weight:700;color:#fef3c7;display:block;}
  .cc{font-size:0.78rem;color:#6b5a3e;margin-top:5px;display:block;}
`;

/* ── HOW IT WORKS ── */
const StepsGrid = styled.div`display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:24px;`;
const Step = styled.div`
  text-align:center;padding:24px;
  .sn{width:52px;height:52px;background:linear-gradient(135deg,#f59e0b,#d97706);
    border-radius:14px;display:flex;align-items:center;justify-content:center;
    font-size:1.2rem;font-weight:900;color:#0e0c0a;margin:0 auto 18px;}
  h3{font-size:1rem;font-weight:700;color:#fef3c7;margin-bottom:8px;}
  p{font-size:0.88rem;color:#6b5a3e;line-height:1.65;}
`;

/* ── CTA ── */
const CTABanner = styled.section`
  margin:0 24px 80px;border-radius:20px;
  background:linear-gradient(135deg,rgba(245,158,11,0.12),rgba(239,68,68,0.08));
  border:1px solid rgba(245,158,11,0.2);padding:64px 32px;text-align:center;
  h2{font-size:clamp(1.6rem,4vw,2.4rem);font-weight:900;color:#fef3c7;margin-bottom:12px;}
  p{color:#b8a07a;font-size:1rem;margin-bottom:28px;line-height:1.7;}
`;

/* ── FEED ── */
const FeedWrap = styled.div`max-width:920px;width:100%;margin:0 auto;padding:100px 20px 40px;`;
const FeedHero = styled.div`
  margin-bottom:32px;
  h2{font-size:1.7rem;font-weight:800;color:#fef3c7;}
  p{color:#6b5a3e;margin-top:5px;font-size:1rem;}
`;

const FEATURES = [
  {icon:'🔨',title:'Share Step-by-Step Projects',desc:'Post detailed tutorials with photos and videos. Help others build, create and fix things themselves.',delay:'0s'},
  {icon:'🤝',title:'Connect with Makers',desc:'Join thousands of builders, crafters and hobbyists who share your passion for doing things yourself.',delay:'0.1s'},
  {icon:'⭐',title:'Rate & Discuss',desc:'Score projects 0–100, leave detailed feedback, and engage in community discussions.',delay:'0.2s'},
  {icon:'📐',title:'All Skill Levels',desc:'From complete beginners to seasoned pros — find and share projects matched to your experience.',delay:'0.3s'},
  {icon:'💡',title:'Get Inspired Daily',desc:'Discover new ideas across building, IT, home improvement, hobbies, and more.',delay:'0.4s'},
  {icon:'🛡️',title:'Trusted Community',desc:'A safe, moderated platform where quality content is valued and recognized.',delay:'0.5s'},
];

const CATEGORIES = [
  {icon:'🏗️',name:'Building',count:'3.2k projects',color:'rgba(245,158,11,0.3)',bg:'rgba(245,158,11,0.07)',key:'building'},
  {icon:'🚧',name:'Construction',count:'2.1k projects',color:'rgba(239,68,68,0.3)',bg:'rgba(239,68,68,0.07)',key:'construction'},
  {icon:'💻',name:'IT & Dev',count:'1.8k projects',color:'rgba(59,130,246,0.3)',bg:'rgba(59,130,246,0.07)',key:'it-dev'},
  {icon:'🎨',name:'Hobbies',count:'4.1k projects',color:'rgba(168,85,247,0.3)',bg:'rgba(168,85,247,0.07)',key:'hobbies'},
  {icon:'🏠',name:'Home Improvement',count:'2.8k projects',color:'rgba(34,197,94,0.3)',bg:'rgba(34,197,94,0.07)',key:'home-improvement'},
  {icon:'🔧',name:'Other',count:'987 projects',color:'rgba(245,158,11,0.2)',bg:'rgba(245,158,11,0.04)',key:'other'},
];

const App = () => {
  const { user, logout, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showBackoffice, setShowBackoffice] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [posts, setPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [infoPage, setInfoPage] = useState(null);

  const INFO_PAGES = ['how-it-works','guidelines','privacy','terms'];
  const CAT_KEYS = ['building','construction','it-dev','hobbies','home-improvement'];

  const closeAll = () => { setShowLogin(false); setShowRegister(false); setShowUsers(false); setShowBackoffice(false); setInfoPage(null); };

  const handleLogout = async () => {
    try { await logout(); toast('Logged out', { theme: 'dark', className: 'success-toast' }); }
    catch { toast('Error logging out', { theme: 'dark', className: 'error-toast' }); }
  };

  const handlePostSubmit = (newPost) => setPosts([newPost, ...posts]);
  const isHome = !showUsers && !showBackoffice && !infoPage;

  const handleNavigate = (key) => {
    closeAll();
    if (INFO_PAGES.includes(key)) { setInfoPage(key); return; }
    if (CAT_KEYS.includes(key)) { setActiveCategory(key); return; }
  };

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
            onRegisterSuccess={() => { setShowRegister(false); toast('Account created! Please sign in.', { theme: 'dark', className: 'success-toast' }); }}
          />
        )}

        {!loading && (
          <MainContent>
            {showUsers && <div style={{maxWidth:920,margin:'0 auto',padding:'100px 20px 40px'}}><Users /></div>}
            {showBackoffice && user?.role === 'admin' && <div style={{maxWidth:1100,margin:'0 auto',padding:'100px 20px 40px'}}><Backoffice user={user} /></div>}
            {infoPage && <InfoPage page={infoPage} />}

            {isHome && (
              <>
                {user ? (
                  <FeedWrap>
                    <FeedHero>
                      <h2>Welcome back, {user.username} 👷</h2>
                      <p>Share your latest project or explore what the community is building.</p>
                    </FeedHero>
                    <PostForm username={user.username} onPostSubmit={handlePostSubmit} />
                    <PostList user={user} externalPosts={posts} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
                  </FeedWrap>
                ) : (
                  <>
                    <Hero>
                      <TapeStripe />
                      <HeroBadge>🔨 The DIY Community Platform</HeroBadge>
                      <HeroTitle>
                        Build, Fix &amp; Create —<br />
                        <span>Do It Yourself</span>
                      </HeroTitle>
                      <HeroSub>
                        DIY Network is where experienced makers share real knowledge. Post tutorials,
                        discuss projects, and learn from thousands of builders, craftspeople and hobbyists.
                        Perfect for those who love hands-on work.
                      </HeroSub>
                      <HeroCTA>
                        <BtnPrimary onClick={() => setShowRegister(true)}>Start Sharing Free →</BtnPrimary>
                        <BtnSecondary onClick={() => setShowLogin(true)}>Sign In</BtnSecondary>
                      </HeroCTA>
                      <HeroStats>
                        <Stat><div className="num">15k+</div><div className="lbl">Active Makers</div></Stat>
                        <Stat><div className="num">52k+</div><div className="lbl">Projects Shared</div></Stat>
                        <Stat><div className="num">6</div><div className="lbl">Categories</div></Stat>
                        <Stat><div className="num">100%</div><div className="lbl">Free</div></Stat>
                      </HeroStats>
                    </Hero>

                    <Section>
                      <SectionLabel>Why DIY Network</SectionLabel>
                      <SectionTitle>Everything a maker needs</SectionTitle>
                      <SectionDesc>One platform to share your expertise, discover techniques, and grow your skills — no fluff, just real DIY knowledge.</SectionDesc>
                      <FeatGrid>
                        {FEATURES.map(f => (
                          <FeatCard key={f.title} style={{animationDelay:f.delay}}>
                            <div className="icon">{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                          </FeatCard>
                        ))}
                      </FeatGrid>
                    </Section>

                    <Divider />
                    <Section>
                      <SectionLabel>Browse Categories</SectionLabel>
                      <SectionTitle>Find your craft</SectionTitle>
                      <SectionDesc>From concrete foundations to code — we cover every form of hands-on creativity.</SectionDesc>
                      <CatGrid>
                        {CATEGORIES.map(c => (
                          <CatCard key={c.key} color={c.color} bg={c.bg} onClick={() => { if(user){ setActiveCategory(c.key); } else { setShowRegister(true); } }}>
                            <span className="ci">{c.icon}</span>
                            <span className="cn">{c.name}</span>
                            <span className="cc">{c.count}</span>
                          </CatCard>
                        ))}
                      </CatGrid>
                    </Section>

                    <Divider />
                    <Section>
                      <SectionLabel>How it works</SectionLabel>
                      <SectionTitle>Start in 3 minutes</SectionTitle>
                      <SectionDesc>No fuss, no algorithms — just a straightforward community for people who build things.</SectionDesc>
                      <StepsGrid>
                        <Step><div className="sn">1</div><h3>Create your account</h3><p>Sign up free — no credit card, no subscription. Just your username and password.</p></Step>
                        <Step><div className="sn">2</div><h3>Post your project</h3><p>Write step-by-step instructions, upload photos or video, choose a category and difficulty level.</p></Step>
                        <Step><div className="sn">3</div><h3>Rate &amp; discuss</h3><p>Score other projects 0–100, leave detailed comments, and build your reputation as a maker.</p></Step>
                        <Step><div className="sn">4</div><h3>Learn &amp; grow</h3><p>Get feedback on your work and discover new techniques from experienced makers every day.</p></Step>
                      </StepsGrid>
                    </Section>

                    <CTABanner>
                      <h2>Ready to share your expertise?</h2>
                      <p>Join 15,000+ makers on DIY Network. Free forever. No algorithms, no ads — just real people sharing real skills.</p>
                      <BtnPrimary onClick={() => setShowRegister(true)}>Create Free Account →</BtnPrimary>
                    </CTABanner>
                  </>
                )}
              </>
            )}
          </MainContent>
        )}
        <Footer onNavigate={handleNavigate} />
      </ErrorBoundary>
    </AppContainer>
  );
};

export default App;
