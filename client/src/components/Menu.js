import React, { useState } from 'react';
import styled from 'styled-components';
import { FiHome, FiUsers, FiSettings, FiLogOut, FiLogIn, FiUserPlus, FiMenu, FiX } from 'react-icons/fi';
import Avatar from './Avatar';

const Nav = styled.nav`
  position:fixed;top:0;left:0;right:0;z-index:100;
  backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
  background:rgba(14,12,10,0.9);
  border-bottom:1px solid rgba(245,158,11,0.15);
  height:68px;display:flex;align-items:center;padding:0 24px;
`;
const NavInner = styled.div`max-width:1120px;width:100%;margin:0 auto;display:flex;align-items:center;justify-content:space-between;`;
const Logo = styled.div`
  font-size:1.2rem;font-weight:900;cursor:pointer;letter-spacing:-0.5px;display:flex;align-items:center;gap:10px;
  span.text{background:linear-gradient(135deg,#f59e0b,#d97706);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
  span.icon{font-size:1.4rem;}
`;
const NavLinks = styled.div`
  display:flex;align-items:center;gap:2px;
  @media(max-width:700px){display:none;}
`;
const NavBtn = styled.button`
  background:transparent;border:none;color:#b8a07a;padding:8px 14px;
  border-radius:8px;cursor:pointer;font-size:0.875rem;font-weight:500;
  display:flex;align-items:center;gap:7px;transition:all 0.2s;
  &:hover{color:#fef3c7;background:rgba(245,158,11,0.08);}
`;
const NavRight = styled.div`display:flex;align-items:center;gap:8px;`;
const GhostBtn = styled.button`
  background:transparent;border:1px solid rgba(245,158,11,0.25);color:#fef3c7;
  padding:8px 18px;border-radius:8px;cursor:pointer;font-size:0.875rem;font-weight:600;
  display:flex;align-items:center;gap:7px;transition:all 0.2s;
  &:hover{border-color:#f59e0b;color:#f59e0b;background:rgba(245,158,11,0.08);}
`;
const PrimaryBtn = styled.button`
  background:linear-gradient(135deg,#f59e0b,#d97706);border:none;color:#0e0c0a;
  padding:8px 18px;border-radius:8px;cursor:pointer;font-size:0.875rem;font-weight:700;
  display:flex;align-items:center;gap:7px;transition:all 0.2s;
  &:hover{opacity:0.9;transform:translateY(-1px);box-shadow:0 4px 12px rgba(245,158,11,0.4);}
`;
const MobileBtn = styled.button`
  display:none;background:transparent;border:none;color:#fef3c7;cursor:pointer;font-size:1.3rem;padding:6px;
  @media(max-width:700px){display:flex;align-items:center;}
`;
const MobileMenu = styled.div`
  display:none;position:fixed;top:68px;left:0;right:0;
  background:#161310;border-bottom:1px solid rgba(245,158,11,0.15);
  padding:12px;flex-direction:column;gap:4px;z-index:99;
  @media(max-width:700px){display:${p=>p.$open?'flex':'none'};}
`;

const Navbar = ({ user, onHomeClick, onUsersClick, onBackofficeClick, onLoginClick, onRegisterClick, onLogout }) => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const navItems = [
    {label:'Home',icon:<FiHome />,onClick:()=>{onHomeClick();close();}},
    {label:'Community',icon:<FiUsers />,onClick:()=>{onUsersClick();close();}},
    ...(user?.role==='admin'?[{label:'Admin',icon:<FiSettings />,onClick:()=>{onBackofficeClick();close();}}]:[]),
  ];
  return (
    <>
      <Nav>
        <NavInner>
          <Logo onClick={()=>{onHomeClick();close();}}>
            <span className="icon">🔨</span>
            <span className="text">DIY Network</span>
          </Logo>
          <NavLinks>
            {navItems.map(i=><NavBtn key={i.label} onClick={i.onClick}>{i.icon}{i.label}</NavBtn>)}
          </NavLinks>
          <NavRight>
            {user ? (
              <>
                <Avatar username={user.username} />
                <GhostBtn onClick={onLogout}><FiLogOut />Logout</GhostBtn>
              </>
            ) : (
              <>
                <GhostBtn onClick={onLoginClick}><FiLogIn />Login</GhostBtn>
                <PrimaryBtn onClick={onRegisterClick}><FiUserPlus />Join Free</PrimaryBtn>
              </>
            )}
          </NavRight>
          <MobileBtn onClick={()=>setOpen(o=>!o)}>{open?<FiX/>:<FiMenu/>}</MobileBtn>
        </NavInner>
      </Nav>
      <MobileMenu $open={open}>
        {navItems.map(i=><NavBtn key={i.label} onClick={i.onClick} style={{justifyContent:'flex-start'}}>{i.icon}{i.label}</NavBtn>)}
        {user
          ? <NavBtn onClick={()=>{onLogout();close();}} style={{justifyContent:'flex-start',color:'#ef4444'}}><FiLogOut/>Logout</NavBtn>
          : <>
              <NavBtn onClick={()=>{onLoginClick();close();}} style={{justifyContent:'flex-start'}}><FiLogIn/>Login</NavBtn>
              <NavBtn onClick={()=>{onRegisterClick();close();}} style={{justifyContent:'flex-start'}}><FiUserPlus/>Join Free</NavBtn>
            </>
        }
      </MobileMenu>
    </>
  );
};
export default Navbar;
