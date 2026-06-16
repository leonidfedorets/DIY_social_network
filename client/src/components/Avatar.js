import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Img = styled.img`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 2px solid var(--accent-primary);
  object-fit: cover;
`;

const Name = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);

  @media (max-width: 480px) {
    display: none;
  }
`;

const Avatar = ({ username }) => (
  <Container>
    <Img
      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=7c3aed&color=fff&bold=true`}
      alt={username}
    />
    <Name>{username}</Name>
  </Container>
);

export default Avatar;
