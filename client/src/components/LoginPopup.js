import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiX, FiUser, FiLock, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translate(-50%, -45%); }
  to { opacity: 1; transform: translate(-50%, -50%); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(6px);
  z-index: 200;
  animation: ${fadeIn} 0.2s ease;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 201;
  width: 100%;
  max-width: 420px;
  padding: 0 16px;
  animation: ${slideUp} 0.25s ease;
`;

const Card = styled.div`
  background: linear-gradient(145deg, #1a1a2e, #16213e);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 40px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(124, 58, 237, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
`;

const CloseBtn = styled.button`
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    color: var(--text-primary);
    border-color: var(--danger);
    background: rgba(239, 68, 68, 0.1);
  }
`;

const FieldWrapper = styled.div`
  position: relative;
  margin-bottom: 16px;
`;

const Icon = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px 12px 42px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 0.9rem;
  transition: var(--transition);

  &::placeholder { color: var(--text-muted); }
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    background: rgba(124, 58, 237, 0.06);
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
  }
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #7c3aed, #3b82f6);
  border: none;
  border-radius: var(--radius-sm);
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
  transition: var(--transition);

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
  }
  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
`;

const ErrorMsg = styled.p`
  color: var(--danger);
  font-size: 0.8rem;
  margin-top: 12px;
  text-align: center;
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
      setError(err.response?.data?.error || 'Login failed');
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
          <form onSubmit={handleSubmit}>
            <FieldWrapper>
              <Icon><FiUser /></Icon>
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoFocus
              />
            </FieldWrapper>
            <FieldWrapper>
              <Icon><FiLock /></Icon>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </FieldWrapper>
            {error && <ErrorMsg>{error}</ErrorMsg>}
            <SubmitBtn type="submit" disabled={loading}>
              <FiLogIn /> {loading ? 'Signing in...' : 'Sign In'}
            </SubmitBtn>
          </form>
        </Card>
      </Modal>
    </>
  );
};

export default LoginPopup;
