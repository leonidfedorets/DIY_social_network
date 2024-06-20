import React from 'react';
import styled from 'styled-components';

const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 16px;
`;

const AvatarImg = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
`;

const Avatar = ({ username }) => {
  return (
    <AvatarContainer>
      <AvatarImg src={`https://ui-avatars.com/api/?name=${username}`} alt="User Avatar" />
      <span>{username}</span>
    </AvatarContainer>
  );
};

export default Avatar;


