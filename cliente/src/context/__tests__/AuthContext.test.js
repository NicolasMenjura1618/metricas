import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from '../AuthContext';
import { loginUser, registerUser } from '../../services/api';

// Mock the API service
jest.mock('../../services/api', () => ({
  loginUser: jest.fn(),
  registerUser: jest.fn()
}));

// Test component that uses auth context
const TestComponent = () => {
  const { user, isAuthenticated, login, logout, register } = useAuth();
  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
      </div>
      {user && <div data-testid="user-info">{user.email}</div>}
      <button onClick={() => login({ email: 'test@test.com', password: 'password123' })}>
        Login
      </button>
      <button onClick={() => register({ nombre: 'Test User', email: 'test@test.com', password: 'password123' })}>
        Register
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

const renderWithAuthProvider = () => {
  return render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('provides initial unauthenticated state', () => {
    renderWithAuthProvider();
    
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
    expect(screen.queryByTestId('user-info')).not.toBeInTheDocument();
  });

  test('handles successful login', async () => {
    const mockUser = { id: 1, email: 'test@test.com' };
    const mockToken = 'fake-token';
    
    loginUser.mockResolvedValueOnce({ user: mockUser, token: mockToken });
    
    renderWithAuthProvider();
    
    fireEvent.click(screen.getByText('Login'));
    
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user-info')).toHaveTextContent(mockUser.email);
    });
    
    // Verify localStorage
    expect(localStorage.setItem).toHaveBeenCalledWith('token', mockToken);
    expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
  });

  test('handles login error', async () => {
    const errorMessage = 'Invalid credentials';
    loginUser.mockRejectedValueOnce(new Error(errorMessage));
    
    renderWithAuthProvider();
    
    fireEvent.click(screen.getByText('Login'));
    
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
      expect(screen.queryByTestId('user-info')).not.toBeInTheDocument();
    });
  });

  test('handles successful registration', async () => {
    const mockUser = { id: 1, email: 'test@test.com', nombre: 'Test User' };
    const mockToken = 'fake-token';
    
    registerUser.mockResolvedValueOnce({ user: mockUser, token: mockToken });
    
    renderWithAuthProvider();
    
    fireEvent.click(screen.getByText('Register'));
    
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user-info')).toHaveTextContent(mockUser.email);
    });
    
    // Verify localStorage
    expect(localStorage.setItem).toHaveBeenCalledWith('token', mockToken);
    expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
  });

  test('handles registration error', async () => {
    const errorMessage = 'Email already exists';
    registerUser.mockRejectedValueOnce(new Error(errorMessage));
    
    renderWithAuthProvider();
    
    fireEvent.click(screen.getByText('Register'));
    
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
      expect(screen.queryByTestId('user-info')).not.toBeInTheDocument();
    });
  });

  test('handles logout', async () => {
    // First login
    const mockUser = { id: 1, email: 'test@test.com' };
    const mockToken = 'fake-token';
    loginUser.mockResolvedValueOnce({ user: mockUser, token: mockToken });
    
    renderWithAuthProvider();
    
    fireEvent.click(screen.getByText('Login'));
    
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });
    
    // Then logout
    fireEvent.click(screen.getByText('Logout'));
    
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
    expect(screen.queryByTestId('user-info')).not.toBeInTheDocument();
    
    // Verify localStorage was cleared
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('user');
  });

  test('restores auth state from localStorage', () => {
    const mockUser = { id: 1, email: 'test@test.com' };
    const mockToken = 'fake-token';
    
    // Set initial state in localStorage
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'token') return mockToken;
      if (key === 'user') return JSON.stringify(mockUser);
      return null;
    });
    
    renderWithAuthProvider();
    
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    expect(screen.getByTestId('user-info')).toHaveTextContent(mockUser.email);
  });

  test('handles invalid localStorage data', () => {
    // Set invalid JSON in localStorage
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'user') return 'invalid-json';
      return null;
    });
    
    renderWithAuthProvider();
    
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
    expect(screen.queryByTestId('user-info')).not.toBeInTheDocument();
  });
});
