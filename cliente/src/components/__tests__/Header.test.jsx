import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';
import { AuthProvider } from '../../context/AuthContext';

// Mock AuthContext
jest.mock('../../context/AuthContext', () => ({
  ...jest.requireActual('../../context/AuthContext'),
  useAuth: jest.fn()
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const renderHeader = (authState) => {
  const { useAuth } = require('../../context/AuthContext');
  useAuth.mockImplementation(() => ({
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    logout: authState.logout || jest.fn()
  }));

  return render(
    <BrowserRouter>
      <AuthProvider>
        <Header />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders logo and brand name', () => {
    renderHeader({ isAuthenticated: false });
    
    expect(screen.getByText(/sistema de canchas/i)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /logo/i })).toBeInTheDocument();
  });

  test('displays login and register links when not authenticated', () => {
    renderHeader({ isAuthenticated: false });
    
    expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument();
    expect(screen.getByText(/registrarse/i)).toBeInTheDocument();
    expect(screen.queryByText(/cerrar sesión/i)).not.toBeInTheDocument();
  });

  test('displays user info and logout when authenticated', () => {
    const mockUser = { nombre: 'Test User', email: 'test@test.com' };
    const mockLogout = jest.fn();

    renderHeader({
      isAuthenticated: true,
      user: mockUser,
      logout: mockLogout
    });
    
    expect(screen.getByText(mockUser.nombre)).toBeInTheDocument();
    expect(screen.getByText(/cerrar sesión/i)).toBeInTheDocument();
    expect(screen.queryByText(/iniciar sesión/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/registrarse/i)).not.toBeInTheDocument();
  });

  test('handles logout click', async () => {
    const mockLogout = jest.fn();
    renderHeader({
      isAuthenticated: true,
      user: { nombre: 'Test User' },
      logout: mockLogout
    });
    
    const logoutButton = screen.getByText(/cerrar sesión/i);
    fireEvent.click(logoutButton);
    
    expect(mockLogout).toHaveBeenCalled();
  });

  test('navigates to home on logo click', () => {
    renderHeader({ isAuthenticated: false });
    
    const logo = screen.getByRole('img', { name: /logo/i });
    fireEvent.click(logo);
    
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('displays admin controls for admin users', () => {
    renderHeader({
      isAuthenticated: true,
      user: { nombre: 'Admin User', role: 'admin' }
    });
    
    expect(screen.getByText(/panel de administración/i)).toBeInTheDocument();
  });

  test('hides admin controls for regular users', () => {
    renderHeader({
      isAuthenticated: true,
      user: { nombre: 'Regular User', role: 'user' }
    });
    
    expect(screen.queryByText(/panel de administración/i)).not.toBeInTheDocument();
  });

  test('handles navigation menu for mobile view', () => {
    renderHeader({ isAuthenticated: true, user: { nombre: 'Test User' } });
    
    const menuButton = screen.getByRole('button', { name: /menú/i });
    fireEvent.click(menuButton);
    
    expect(screen.getByRole('navigation')).toHaveClass('open');
    
    fireEvent.click(menuButton);
    expect(screen.getByRole('navigation')).not.toHaveClass('open');
  });

  test('closes mobile menu when clicking outside', () => {
    renderHeader({ isAuthenticated: true, user: { nombre: 'Test User' } });
    
    const menuButton = screen.getByRole('button', { name: /menú/i });
    fireEvent.click(menuButton);
    
    fireEvent.click(document.body);
    expect(screen.getByRole('navigation')).not.toHaveClass('open');
  });

  test('navigates to profile page when clicking user name', () => {
    renderHeader({
      isAuthenticated: true,
      user: { id: 1, nombre: 'Test User' }
    });
    
    const userNameLink = screen.getByText('Test User');
    fireEvent.click(userNameLink);
    
    expect(mockNavigate).toHaveBeenCalledWith('/perfil');
  });

  test('displays notification badge when notifications exist', () => {
    renderHeader({
      isAuthenticated: true,
      user: { 
        nombre: 'Test User',
        notifications: [{ id: 1, message: 'New notification' }]
      }
    });
    
    expect(screen.getByTestId('notification-badge')).toBeInTheDocument();
    expect(screen.getByTestId('notification-badge')).toHaveTextContent('1');
  });

  test('handles theme toggle', () => {
    renderHeader({ isAuthenticated: true, user: { nombre: 'Test User' } });
    
    const themeToggle = screen.getByRole('button', { name: /cambiar tema/i });
    fireEvent.click(themeToggle);
    
    expect(document.body.classList.contains('dark-theme')).toBeTruthy();
    
    fireEvent.click(themeToggle);
    expect(document.body.classList.contains('dark-theme')).toBeFalsy();
  });
});
