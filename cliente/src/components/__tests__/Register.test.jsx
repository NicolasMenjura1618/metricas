import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import Register from '../Register';

// Mock the api service
jest.mock('../../services/api', () => ({
  registerUser: jest.fn()
}));

const renderRegister = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Register />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders registration form', () => {
    renderRegister();
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    renderRegister();
    const submitButton = screen.getByRole('button', { name: /registrarse/i });
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/el nombre es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/el email es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/la contraseña es requerida/i)).toBeInTheDocument();
    });
  });

  test('validates password match', async () => {
    renderRegister();
    
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), {
      target: { value: 'password456' },
    });
    
    const submitButton = screen.getByRole('button', { name: /registrarse/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/las contraseñas no coinciden/i)).toBeInTheDocument();
    });
  });

  test('validates email format', async () => {
    renderRegister();
    const emailInput = screen.getByLabelText(/email/i);
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    
    await waitFor(() => {
      expect(screen.getByText(/formato de email inválido/i)).toBeInTheDocument();
    });
  });

  test('handles successful registration', async () => {
    const mockRegisterResponse = { message: 'Usuario registrado exitosamente' };
    const api = require('../../services/api');
    api.registerUser.mockResolvedValueOnce(mockRegisterResponse);

    renderRegister();
    
    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));
    
    await waitFor(() => {
      expect(api.registerUser).toHaveBeenCalledWith({
        nombre: 'Test User',
        email: 'test@test.com',
        password: 'password123',
      });
    });
  });

  test('handles registration error', async () => {
    const api = require('../../services/api');
    api.registerUser.mockRejectedValueOnce(new Error('El email ya está registrado'));

    renderRegister();
    
    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'existing@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/el email ya está registrado/i)).toBeInTheDocument();
    });
  });
});
