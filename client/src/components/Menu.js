import React, { useState } from 'react';
import styled from 'styled-components';

const MenuContainer = styled.div`
  display: inline-block;
  position: fixed;
  top: 4%;
  left: 2%;
`;

const DropdownButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const DropdownContent = styled.div`
  display: ${(props) => (props.$isOpen ? 'block' : 'none')};
  position: absolute;
  background-color: #f8f9fa;
  border: 1px solid #ccc;
  padding: 10px;
  top: 100%;
  left: 0;
  z-index: 1;
`;

const MenuItem = styled.div`
  font-size: 16px;
  cursor: pointer;
  color: #007bff;
  padding: 5px;

  &:hover {
    background-color: #e9ecef;
  }
`;

const Menu = ({ onHomeClick, onCategoriesClick, onUsersClick, onSettingsClick, onBackofficeClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <MenuContainer>
      <DropdownButton onClick={toggleMenu}>Menu</DropdownButton>
      <DropdownContent $isOpen={isOpen}>
        <MenuItem onClick={() => { onHomeClick(); setIsOpen(false); }}>Home</MenuItem>
        <MenuItem onClick={() => { onCategoriesClick(); setIsOpen(false); }}>Categories</MenuItem>
        <MenuItem onClick={() => { onUsersClick(); setIsOpen(false); }}>Users</MenuItem>
        <MenuItem onClick={() => { onSettingsClick(); setIsOpen(false); }}>Settings</MenuItem>
        <MenuItem onClick={() => { onBackofficeClick(); setIsOpen(false); }}>Backoffice</MenuItem>
      </DropdownContent>
    </MenuContainer>
  );
};

export default Menu;
