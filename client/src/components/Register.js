import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const RegisterPopup = ({ onClose, onSwitchView, onRegisterSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/users/register', { username, password });
      onRegisterSuccess(response.data.message);
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  return (
    <PopupContainer>
      <Popup>
        <CloseButton onClick={onClose}>X</CloseButton>
        <h2>Register</h2>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Error>{error}</Error>}
          <Button type="submit">Register</Button>
        </Form>
       
      </Popup>
    </PopupContainer>
  );
};

const PopupContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Popup = styled.div`
  width: 300px;
  padding: 20px;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
`;

const Error = styled.p`
  color: red;
  font-size: 14px;
`;

const SwitchLink = styled.span`
  color: blue;
  cursor: pointer;
  margin-top: 10px;
  text-decoration: underline;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: transparent;
  border: none;
  cursor: pointer;
`;

export default RegisterPopup;

