import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiX, FiUser, FiLock, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const fadeIn = keyframes`from{opacity:0}to{opacity:1}`;
const slideUp = keyframes`from{opacity:0;transform:translate(-50%,-46%)}to{opacity:1;transform:translate(-50%,-50%)}`;

const Overlay = styled.div`
  position:fixed;inset:0;
  background:rgba(0,0,0,0.85);
  backdrop-filter:blur(6px);
  z-index:1000;
  animation:${fadeIn} 0.2s ease;
`;

const Modal = styled.div`
  position:fixed;top:50%;left:50%;
  transform:translate(-50%,-50%);
  z-index:1001;
  width:calc(100% - 32px);
  max-width:420px;
  animation:${slideUp} 0.25s ease;
`;

const Card = styled.div`
  box-sizing:border-box;
  width:100%;
  background:#1a1208;
  border:1px solid rgba(245,158,11,0.4);
  border-radius:18px;
  padding:32px 28px;
  box-shadow:0 24px 64px rgba(0,0,0,0.9),0 0 40px rgba(245,158,11,0.06);
  overflow:hidden;
`;

const Header = styled.div`
  display:flex;justify-content:space-between;align-items:flex-start;
  margin-bottom:4px;
`;

const TitleGroup = styled.div``;

const Logo = styled.div`font-size:1.3rem;margin-bottom:2px;`;

const Title = styled.h2`
  font-size:1.45rem;font-weight:800;color:#fef3c7;letter-spacing:-0.3px;margin:0;
`;

const Subtitle = styled.p`
  color:#b8a07a;font-size:0.85rem;margin:6px 0 22px;
`;

const CloseBtn = styled.button`
  width:30px;height:30px;border-radius:50%;flex-shrink:0;
  background:rgba(245,158,11,0.08);
  border:1px solid rgba(245,158,11,0.2);
  color:#b8a07a;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  transition:all 0.2s;
  &:hover{background:rgba(239,68,68,0.15);border-color:#ef4444;color:#fef3c7;}
`;

const GoogleBtn = styled.button`
  box-sizing:border-box;
  width:100%;padding:11px 14px;
  background:rgba(255,255,255,0.04);
  border:1px solid rgba(245,158,11,0.2);
  border-radius:10px;color:#b8a07a;
  font-size:0.88rem;font-weight:500;
  cursor:not-allowed;
  display:flex;align-items:center;justify-content:center;gap:10px;
  margin-bottom:16px;
  position:relative;
  &::after{
    content:'Coming soon';
    position:absolute;right:12px;top:50%;transform:translateY(-50%);
    font-size:0.7rem;background:rgba(245,158,11,0.15);
    color:#f59e0b;padding:2px 8px;border-radius:100px;font-weight:600;
  }
`;

const GoogleSvg = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" style={{flexShrink:0}}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const Divider = styled.div`
  display:flex;align-items:center;gap:10px;
  margin-bottom:16px;color:#6b5a3e;font-size:0.75rem;
  &::before,&::after{content:'';flex:1;height:1px;background:rgba(245,158,11,0.12);}
`;

const Field = styled.div`position:relative;margin-bottom:10px;`;

const Icon = styled.span`
  position:absolute;left:12px;top:50%;transform:translateY(-50%);
  color:#6b5a3e;font-size:0.9rem;pointer-events:none;
  display:flex;align-items:center;
`;

const Input = styled.input`
  box-sizing:border-box;
  width:100%;
  padding:12px 12px 12px 38px;
  background:rgba(245,158,11,0.04);
  border:1px solid rgba(245,158,11,0.18);
  border-radius:9px;
  color:#fef3c7;font-size:0.9rem;
  transition:border-color 0.2s,box-shadow 0.2s;
  &::placeholder{color:#6b5a3e;}
  &:focus{
    outline:none;
    border-color:#f59e0b;
    background:rgba(245,158,11,0.07);
    box-shadow:0 0 0 3px rgba(245,158,11,0.1);
  }
`;

const Btn = styled.button`
  box-sizing:border-box;
  width:100%;padding:12px;
  background:linear-gradient(135deg,#d97706,#f59e0b);
  border:none;border-radius:10px;
  color:#1a0f00;font-size:0.92rem;font-weight:700;
  cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;
  margin-top:6px;transition:all 0.2s;
  &:hover:not(:disabled){opacity:0.9;transform:translateY(-1px);box-shadow:0 8px 20px rgba(245,158,11,0.35);}
  &:disabled{opacity:0.45;cursor:not-allowed;}
`;

const Err = styled.p`
  box-sizing:border-box;
  width:100%;
  color:#ef4444;font-size:0.8rem;
  margin-top:8px;text-align:center;
  background:rgba(239,68,68,0.08);
  padding:8px 12px;border-radius:8px;
  border:1px solid rgba(239,68,68,0.2);
`;

export default function LoginPopup({ onClose }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    setLoading(true); setError('');
    try {
      await login(username, password);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed — check your credentials.');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Overlay onClick={onClose} />
      <Modal>
        <Card>
          <Header>
            <TitleGroup>
              <Logo>🔨</Logo>
              <Title>Welcome back</Title>
            </TitleGroup>
            <CloseBtn onClick={onClose}><FiX size={14}/></CloseBtn>
          </Header>
          <Subtitle>Sign in to your DIY Network account</Subtitle>

          <GoogleBtn type="button" disabled>
            <GoogleSvg /> Continue with Google
          </GoogleBtn>

          <Divider>or sign in with username</Divider>

          <form onSubmit={handleSubmit}>
            <Field>
              <Icon><FiUser size={14}/></Icon>
              <Input type="text" placeholder="Username" value={username}
                onChange={e => setUsername(e.target.value)} autoFocus />
            </Field>
            <Field>
              <Icon><FiLock size={14}/></Icon>
              <Input type="password" placeholder="Password" value={password}
                onChange={e => setPassword(e.target.value)} />
            </Field>
            {error && <Err>{error}</Err>}
            <Btn type="submit" disabled={loading || !username.trim() || !password.trim()}>
              <FiLogIn size={15}/> {loading ? 'Signing in…' : 'Sign In'}
            </Btn>
          </form>
        </Card>
      </Modal>
    </>
  );
}
