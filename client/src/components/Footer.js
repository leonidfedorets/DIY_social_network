import React from 'react';
import styled from 'styled-components';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background-color: #f0f0f0;
  padding: 20px;
  text-align: center;
`;

const SocialIcons = styled.div`
  margin-top: 10px;
`;

const SocialIconLink = styled.a`
  margin: 0 10px;
  color: #333;
  font-size: 24px;

  &:hover {
    color: #007bff;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <p>Address: 1234 Main Street, Cityville, State, Country</p>
      <p>Phone: +1 (123) 456-7890</p>
      <p>Email: info@example.com</p>
      <p>All Rights Reserved &copy; 2024</p>
      <SocialIcons>
        <SocialIconLink href="#">
          <FaFacebook />
        </SocialIconLink>
        <SocialIconLink href="#">
          <FaTwitter />
        </SocialIconLink>
        <SocialIconLink href="#">
          <FaInstagram />
        </SocialIconLink>
      </SocialIcons>
    </FooterContainer>
  );
};

export default Footer;


