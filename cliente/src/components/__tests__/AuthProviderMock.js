import React from 'react';
import { AuthContext } from '../../context/AuthContext';

const mockAuthValue = {
  isAuthenticated: false,
  login: jest.fn(),
  logout: jest.fn(),
  user: null,
};

const AuthProviderMock = ({ children, value = mockAuthValue }) => (
  <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
);

export default AuthProviderMock;
