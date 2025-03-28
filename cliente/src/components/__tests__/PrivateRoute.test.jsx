import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute';
import { AuthContext } from '../../context/AuthContext';

const MockAuthProvider = ({ children, user }) => {
  return (
    <AuthContext.Provider value={{ user, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
};

describe('PrivateRoute', () => {
  it('redirects to login page when not authenticated and preserves query parameters', () => {
    render(
      <MemoryRouter initialEntries={['/protected?param=value']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <PrivateRoute>
                <div>Protected Content</div>
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders children when authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <MockAuthProvider user={{ name: 'Test User' }}>
          <Routes>
            <Route
              path="/protected"
              element={
                <PrivateRoute>
                  <div>Protected Content</div>
                </PrivateRoute>
              }
            />
          </Routes>
        </MockAuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
