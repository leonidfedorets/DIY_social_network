import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  padding: 8px 16px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const LogoutButton = ({ onLogout }) => {
  const handleLogout = () => {
    // Call the onLogout function when clicked
    onLogout();
  };

  return <StyledButton onClick={handleLogout}>Logout</StyledButton>;
};

export default LogoutButton;
