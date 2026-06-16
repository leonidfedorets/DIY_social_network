import React, { useState } from 'react';
import styled from 'styled-components';
import { FiHome, FiUsers, FiSettings, FiLogOut, FiLogIn, FiUserPlus, FiMenu, FiX } from 'react-icons/fi';
import Avatar from './Avatar';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background: rgba(13, 13, 26, 0.85);
  border-bottom: 1px solid var(--border);
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 24px;
`;

const NavInner = styled.div`
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  font-size: 1.25rem;
  font-weight: 800;
  background: linear-gradient(135deg, #7c3aed, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  cursor: pointer;
  letter-spacing: -0.5px;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  @media (max-width: 640px) {
    display: none;
  }
`;

const NavBtn = styled.button`
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 7px;
  transition: var(--transition);

  &:hover {
    color: var(--text-primary);
    background: var(--bg-card-hover);
  }
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PrimaryBtn = styled.button`
  background: linear-gradient(135deg, #7c3aed, #3b82f6);
  border: none;
  color: white;
  padding: 8px 18px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 7px;
  transition: var(--transition);

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
  }
`;

const GhostBtn = styled(NavBtn)`
  border: 1px solid var(--border);
  color: var(--text-primary);

  &:hover {
    border-color: var(--accent-primary);
    color: var(--accent-primary);
    background: rgba(124, 58, 237, 0.1);
  }
`;

const MobileMenuBtn = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  font-size: 1.25rem;
  padding: 6px;

  @media (max-width: 640px) {
    display: flex;
    align-items: center;
  }
`;

const MobileMenu = styled.div`
  display: none;
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
  padding: 12px;
  flex-direction: column;
  gap: 4px;
  animation: slideDown 0.2s ease;
  z-index: 99;

  @media (max-width: 640px) {
    display: ${p => p.$open ? 'flex' : 'none'};
  }
`;

const Navbar = ({ user, onHomeClick, onUsersClick, onBackofficeClick, onLoginClick, onRegisterClick, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const close = () => setMobileOpen(false);

  const navItems = [
    { label: 'Home', icon: <FiHome />, onClick: () => { onHomeClick(); close(); } },
    { label: 'Users', icon: <FiUsers />, onClick: () => { onUsersClick(); close(); } },
    ...(user?.role === 'admin' ? [{ label: 'Backoffice', icon: <FiSettings />, onClick: () => { onBackofficeClick(); close(); } }] : []),
  ];

  return (
    <>
      <Nav>
        <NavInner>
          <Logo onClick={() => { onHomeClick(); close(); }}>DIY Network</Logo>
          <NavLinks>
            {navItems.map(item => (
              <NavBtn key={item.label} onClick={item.onClick}>
                {item.icon} {item.label}
              </NavBtn>
            ))}
          </NavLinks>
          <NavRight>
            {user ? (
              <>
                <Avatar username={user.username} />
                <GhostBtn onClick={onLogout}>
                  <FiLogOut /> Logout
                </GhostBtn>
              </>
            ) : (
              <>
                <GhostBtn onClick={onLoginClick}><FiLogIn /> Login</GhostBtn>
                <PrimaryBtn onClick={onRegisterClick}><FiUserPlus /> Sign Up</PrimaryBtn>
              </>
            )}
          </NavRight>
          <MobileMenuBtn onClick={() => setMobileOpen(o => !o)}>
            {mobileOpen ? <FiX /> : <FiMenu />}
          </MobileMenuBtn>
        </NavInner>
      </Nav>
      <MobileMenu $open={mobileOpen}>
        {navItems.map(item => (
          <NavBtn key={item.label} onClick={item.onClick} style={{ justifyContent: 'flex-start' }}>
            {item.icon} {item.label}
          </NavBtn>
        ))}
        {user ? (
          <NavBtn onClick={() => { onLogout(); close(); }} style={{ justifyContent: 'flex-start', color: 'var(--danger)' }}>
            <FiLogOut /> Logout
          </NavBtn>
        ) : (
          <>
            <NavBtn onClick={() => { onLoginClick(); close(); }} style={{ justifyContent: 'flex-start' }}><FiLogIn /> Login</NavBtn>
            <NavBtn onClick={() => { onRegisterClick(); close(); }} style={{ justifyContent: 'flex-start' }}><FiUserPlus /> Sign Up</NavBtn>
          </>
        )}
      </MobileMenu>
    </>
  );
};

export default Navbar;
