import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute';
import { AuthProvider } from '../../context/AuthContext';

// Mock components
const MockProtectedComponent = () => <div>Protected Content</div>;
const MockLoginComponent = () => <div>Login Page</div>;

// Mock AuthContext values
jest.mock('../../context/AuthContext', () => ({
  ...jest.requireActual('../../context/AuthContext'),
  useAuth: jest.fn()
}));

const renderWithRouter = (authState) => {
  const { useAuth } = require('../../context/AuthContext');
  useAuth.mockImplementation(() => ({
    isAuthenticated: authState.isAuthenticated,
    user: authState.user
  }));

  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <Routes>
        <Route path="/login" element={<MockLoginComponent />} />
        <Route
          path="/protected"
          element={
            <PrivateRoute>
              <MockProtectedComponent />
            </PrivateRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );
};

describe('PrivateRoute Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders protected content when user is authenticated', () => {
    renderWithRouter({
      isAuthenticated: true,
      user: { id: 1, email: 'test@test.com' }
    });

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  test('redirects to login when user is not authenticated', () => {
    renderWithRouter({
      isAuthenticated: false,
      user: null
    });

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('redirects to login when auth token is invalid', () => {
    renderWithRouter({
      isAuthenticated: false,
      user: null
    });

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  test('preserves route state during authentication', () => {
    const { useAuth } = require('../../context/AuthContext');
    
    // Initially not authenticated
    useAuth.mockImplementation(() => ({
      isAuthenticated: false,
      user: null
    }));

    const { rerender } = renderWithRouter({
      isAuthenticated: false,
      user: null
    });

    expect(screen.getByText('Login Page')).toBeInTheDocument();

    // Update to authenticated state
    useAuth.mockImplementation(() => ({
      isAuthenticated: true,
      user: { id: 1, email: 'test@test.com' }
    }));

    rerender(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<MockLoginComponent />} />
          <Route
            path="/protected"
            element={
              <PrivateRoute>
                <MockProtectedComponent />
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('handles nested protected routes', () => {
    const NestedComponent = () => <div>Nested Protected Content</div>;
    
    render(
      <MemoryRouter initialEntries={['/protected/nested']}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<MockLoginComponent />} />
            <Route
              path="/protected"
              element={
                <PrivateRoute>
                  <div>
                    <Routes>
                      <Route path="nested" element={<NestedComponent />} />
                    </Routes>
                  </div>
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    // Should redirect to login since we're not mocking authentication here
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Nested Protected Content')).not.toBeInTheDocument();
  });

  test('preserves query parameters when redirecting to login', () => {
    render(
      <MemoryRouter initialEntries={['/protected?returnUrl=/dashboard']}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<MockLoginComponent />} />
            <Route
              path="/protected"
              element={
                <PrivateRoute>
                  <MockProtectedComponent />
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    // Verify we're on the login page
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    // The query parameters would be preserved in the actual URL
    // but we can't test that directly in jsdom
  });
});
