import React from 'react';
import styled from 'styled-components';

const AuthContainerWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 10px;
`;

const AuthContainer = ({ children }) => {
  return <AuthContainerWrapper>{children}</AuthContainerWrapper>;
};

export default AuthContainer;



