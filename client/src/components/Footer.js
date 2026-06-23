import React from 'react';
import styled from 'styled-components';
import { FiLinkedin, FiTwitter, FiInstagram, FiMail, FiMapPin } from 'react-icons/fi';

const FooterEl = styled.footer`
  background:#0a0908;border-top:1px solid rgba(245,158,11,0.1);padding:56px 24px 28px;margin-top:80px;
  position:relative;
  &::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;
    background:repeating-linear-gradient(90deg,#f59e0b 0px,#f59e0b 20px,transparent 20px,transparent 28px);
    opacity:0.5;}
`;
const Inner = styled.div`max-width:1120px;margin:0 auto;`;
const Grid = styled.div`
  display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:40px;margin-bottom:48px;
  @media(max-width:768px){grid-template-columns:1fr 1fr;gap:28px;}
  @media(max-width:480px){grid-template-columns:1fr;}
`;
const Brand = styled.div`
  h3{font-size:1.2rem;font-weight:900;color:#f59e0b;margin-bottom:10px;display:flex;align-items:center;gap:8px;}
  p{color:#6b5a3e;font-size:0.875rem;line-height:1.7;max-width:260px;}
`;
const ColTitle = styled.h4`font-size:0.75rem;font-weight:700;color:#b8a07a;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:16px;`;
const Links = styled.div`display:flex;flex-direction:column;gap:10px;`;
const FootLink = styled.span`color:#6b5a3e;font-size:0.875rem;cursor:pointer;transition:all 0.15s;&:hover{color:#f59e0b;text-decoration:underline;}`;
const ContactItem = styled.div`display:flex;align-items:center;gap:9px;color:#6b5a3e;font-size:0.875rem;margin-bottom:10px;svg{color:#f59e0b;flex-shrink:0;}`;
const SocialWrap = styled.div`display:flex;gap:10px;margin-top:4px;`;
const SLink = styled.a`
  width:36px;height:36px;border-radius:8px;border:1px solid rgba(245,158,11,0.15);
  display:flex;align-items:center;justify-content:center;color:#6b5a3e;font-size:1rem;
  transition:all 0.15s;
  &:hover{border-color:#f59e0b;color:#f59e0b;background:rgba(245,158,11,0.08);transform:translateY(-2px);}
`;
const Bottom = styled.div`
  border-top:1px solid rgba(245,158,11,0.08);padding-top:20px;
  display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;
`;
const BottomText = styled.span`color:#6b5a3e;font-size:0.78rem;`;

const CATS = [
  { label: 'Building', key: 'building' },
  { label: 'Construction', key: 'construction' },
  { label: 'IT & Dev', key: 'it-dev' },
  { label: 'Hobbies', key: 'hobbies' },
  { label: 'Home Improvement', key: 'home-improvement' },
];

const Footer = ({ onNavigate }) => (
  <FooterEl>
    <Inner>
      <Grid>
        <Brand>
          <h3>🔨 DIY Network</h3>
          <p>The community platform for makers, builders, and hobbyists. Share your expertise, learn new skills, and connect with thousands of hands-on creators.</p>
          <SocialWrap style={{marginTop:16}}>
            <SLink href="https://www.linkedin.com/in/leonid-fedorets-6b778431/" target="_blank" rel="noreferrer"><FiLinkedin /></SLink>
            <SLink href="https://twitter.com" target="_blank" rel="noreferrer"><FiTwitter /></SLink>
            <SLink href="https://instagram.com" target="_blank" rel="noreferrer"><FiInstagram /></SLink>
          </SocialWrap>
        </Brand>
        <div>
          <ColTitle>Categories</ColTitle>
          <Links>
            {CATS.map(c => (
              <FootLink key={c.key} onClick={() => onNavigate && onNavigate(c.key)}>{c.label}</FootLink>
            ))}
          </Links>
        </div>
        <div>
          <ColTitle>Platform</ColTitle>
          <Links>
            <FootLink onClick={() => onNavigate && onNavigate('how-it-works')}>How it works</FootLink>
            <FootLink onClick={() => onNavigate && onNavigate('guidelines')}>Community guidelines</FootLink>
            <FootLink onClick={() => onNavigate && onNavigate('privacy')}>Privacy policy</FootLink>
            <FootLink onClick={() => onNavigate && onNavigate('terms')}>Terms of service</FootLink>
          </Links>
        </div>
        <div>
          <ColTitle>Contact</ColTitle>
          <ContactItem><FiMapPin size={13}/> Kyiv, Ukraine</ContactItem>
          <ContactItem><FiMail size={13}/> leonidfedorets30@gmail.com</ContactItem>
        </div>
      </Grid>
      <Bottom>
        <BottomText>© {new Date().getFullYear()} DIY Network. All rights reserved.</BottomText>
        <BottomText>Built for makers, by makers 🔨</BottomText>
      </Bottom>
    </Inner>
  </FooterEl>
);

export default Footer;
