import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiX, FiUser, FiLock, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const slideUp = keyframes`
  from { opacity: 0; transform: translate(-50%, -48%); }
  to   { opacity: 1; transform: translate(-50%, -50%); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
  width: 100%;
  max-width: 440px;
  padding: 0 16px;
  animation: ${slideUp} 0.25s ease;
`;

const Card = styled.div`
  background: #1a1a2e;
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(124, 58, 237, 0.15);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const Title = styled.h2`
  font-size: 1.6rem;
  font-weight: 700;
  color: #f1f5f9;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 28px;
`;

const CloseBtn = styled.button`
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  color: #94a3b8;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { color: #f1f5f9; background: rgba(239,68,68,0.15); border-color: #ef4444; }
`;

const FieldWrapper = styled.div`
  position: relative;
  margin-bottom: 14px;
`;

const FieldIcon = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #475569;
  font-size: 1rem;
  pointer-events: none;
`;

const Input = styled.input`
  width: 100%;
  padding: 13px 14px 13px 42px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #f1f5f9;
  font-size: 0.95rem;
  transition: all 0.2s;
  &::placeholder { color: #475569; }
  &:focus {
    outline: none;
    border-color: #7c3aed;
    background: rgba(124, 58, 237, 0.08);
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
  }
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 13px;
  background: linear-gradient(135deg, #7c3aed, #3b82f6);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
  transition: all 0.2s;
  &:hover:not(:disabled) {
    opacity: 0.92;
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(124, 58, 237, 0.45);
  }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const ErrorMsg = styled.p`
  color: #ef4444;
  font-size: 0.82rem;
  margin-top: 10px;
  text-align: center;
  background: rgba(239,68,68,0.08);
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(239,68,68,0.2);
`;

const LoginPopup = ({ onClose }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(username, password);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Overlay onClick={onClose} />
      <Modal>
        <Card>
          <Header>
            <Title>Welcome back</Title>
            <CloseBtn onClick={onClose}><FiX /></CloseBtn>
          </Header>
          <Subtitle>Sign in to your DIY Network account</Subtitle>
          <form onSubmit={handleSubmit}>
            <FieldWrapper>
              <FieldIcon><FiUser /></FieldIcon>
              <Input type="text" placeholder="Username" value={username}
                onChange={e => setUsername(e.target.value)} autoFocus />
            </FieldWrapper>
            <FieldWrapper>
              <FieldIcon><FiLock /></FieldIcon>
              <Input type="password" placeholder="Password" value={password}
                onChange={e => setPassword(e.target.value)} />
            </FieldWrapper>
            {error && <ErrorMsg>{error}</ErrorMsg>}
            <SubmitBtn type="submit" disabled={loading}>
              <FiLogIn /> {loading ? 'Signing in…' : 'Sign In'}
            </SubmitBtn>
          </form>
        </Card>
      </Modal>
    </>
  );
};

export default LoginPopup;
