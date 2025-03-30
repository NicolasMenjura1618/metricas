import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute';
import AuthProviderMock from './AuthProviderMock';


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
        <AuthProviderMock value={{ isAuthenticated: true, user: { name: 'Test User' } }}>



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
        </AuthProviderMock>

      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
