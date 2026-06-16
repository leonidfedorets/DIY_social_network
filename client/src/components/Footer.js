import React from 'react';
import styled from 'styled-components';
import { FiLinkedin, FiTwitter, FiInstagram, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';

const FooterEl = styled.footer`
  background: var(--bg-secondary);
  border-top: 1px solid var(--border);
  padding: 48px 24px 24px;
  margin-top: 80px;
`;

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 28px;
  }
`;

const Brand = styled.div`
  h3 {
    font-size: 1.2rem;
    font-weight: 800;
    background: linear-gradient(135deg, #7c3aed, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 8px;
  }
  p {
    color: var(--text-muted);
    font-size: 0.85rem;
    line-height: 1.6;
  }
`;

const ColTitle = styled.h4`
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 16px;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-muted);
  font-size: 0.85rem;
  margin-bottom: 10px;

  svg { color: var(--accent-primary); flex-shrink: 0; }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 12px;
`;

const SocialLink = styled.a`
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 1rem;
  transition: var(--transition);

  &:hover {
    border-color: var(--accent-primary);
    color: var(--accent-primary);
    background: rgba(124, 58, 237, 0.1);
    transform: translateY(-2px);
  }
`;

const Bottom = styled.div`
  border-top: 1px solid var(--border);
  padding-top: 20px;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.8rem;
`;

const Footer = () => (
  <FooterEl>
    <Inner>
      <Grid>
        <Brand>
          <h3>DIY Network</h3>
          <p>A community platform for sharing DIY projects, tutorials, and creative ideas.</p>
        </Brand>

        <div>
          <ColTitle>Contact</ColTitle>
          <ContactItem><FiMapPin size={14} /> 8A Pravda Ave, Kyiv, Ukraine</ContactItem>
          <ContactItem><FiPhone size={14} /> +380 (66) 103-9977</ContactItem>
          <ContactItem><FiMail size={14} /> leonidfedorets30@gmail.com</ContactItem>
        </div>

        <div>
          <ColTitle>Follow Us</ColTitle>
          <SocialLinks>
            <SocialLink href="https://www.linkedin.com/in/leonid-fedorets-6b778431/" target="_blank" rel="noreferrer">
              <FiLinkedin />
            </SocialLink>
            <SocialLink href="#"><FiTwitter /></SocialLink>
            <SocialLink href="#"><FiInstagram /></SocialLink>
          </SocialLinks>
        </div>
      </Grid>

      <Bottom>
        &copy; {new Date().getFullYear()} DIY Network. All rights reserved.
      </Bottom>
    </Inner>
  </FooterEl>
);

export default Footer;
