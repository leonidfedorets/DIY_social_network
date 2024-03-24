import React from 'react';
import styled from 'styled-components';

const TextArea = ({ ...props }) => {
  return <StyledTextArea {...props} />;
};

const StyledTextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
  font-size: 16px;
  margin-bottom: 10px;
  background-image: url('https://source.unsplash.com/random');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

export default TextArea;
