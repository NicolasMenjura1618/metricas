import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Custom render function that includes providers
const customRender = (ui, options) =>
  render(ui, {
    wrapper: ({ children }) => (
      <BrowserRouter>
        <AuthProvider>
          {children}
        </AuthProvider>
      </BrowserRouter>
    ),
    ...options
  });

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Test data generators
export const generateMockCancha = (overrides = {}) => ({
  id: Math.floor(Math.random() * 1000),
  nombre: 'Cancha Test',
  descripcion: 'Descripción de prueba',
  precio: '100',
  ...overrides
});

export const generateMockUser = (overrides = {}) => ({
  id: Math.floor(Math.random() * 1000),
  nombre: 'Usuario Test',
  email: 'test@example.com',
  ...overrides
});

export const generateMockReview = (overrides = {}) => ({
  id: Math.floor(Math.random() * 1000),
  rating: 5,
  comentario: 'Comentario de prueba',
  usuario: 'Usuario Test',
  fecha: new Date().toISOString().split('T')[0],
  ...overrides
});

// Mock responses
export const mockApiResponse = (data) => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {}
});

// Mock error responses
export const mockApiError = (message, status = 400) => ({
  response: {
    data: { error: message },
    status,
    statusText: 'Error',
    headers: {},
    config: {}
  }
});

// Wait utilities
export const waitForLoadingToFinish = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

// Event helpers
export const createMockEvent = () => ({
  preventDefault: jest.fn(),
  stopPropagation: jest.fn(),
  target: {
    value: '',
    checked: false
  }
});
