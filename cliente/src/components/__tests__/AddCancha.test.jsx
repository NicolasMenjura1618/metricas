import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import AddCancha from '../AddCancha';
import { CanchasContext } from '../../context/contextCanchas'; // Import the context

const mockContextValue = {
  addCancha: jest.fn(),
  canchas: []
};


// Mock the api service
jest.mock('../../services/api', () => ({
  addCancha: jest.fn()
}));

// Mock the context
jest.mock('../../context/contextCanchas', () => ({
  useCancha: () => ({
    addCancha: jest.fn(),
    canchas: []
  })
}));

const renderAddCancha = () => {
  return render(
    <CanchasContext.Provider value={mockContextValue}> // Wrap in Provider
      <BrowserRouter>
        <AddCancha />
      </BrowserRouter>
    </CanchasContext.Provider>
  );

};

describe('AddCancha Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders add cancha form', () => {
    renderAddCancha();
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descripción/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/precio/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /agregar cancha/i })).toBeInTheDocument();
  });

  test('validates required fields and empty name', async () => {

    renderAddCancha();
    const submitButton = screen.getByRole('button', { name: /agregar cancha/i });
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/el nombre es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/la descripción es requerida/i)).toBeInTheDocument();
      expect(screen.getByText(/el precio es requerido/i)).toBeInTheDocument();
    });
  });

  test('validates price format', async () => {
    renderAddCancha();
    const precioInput = screen.getByLabelText(/precio/i);
    
    fireEvent.change(precioInput, { target: { value: 'invalid-price' } });
    fireEvent.blur(precioInput);
    
    await waitFor(() => {
      expect(screen.getByText(/el precio debe ser un número válido/i)).toBeInTheDocument();
    });
  });

  test('validates address format', async () => {
    renderAddCancha();
    const addressInput = screen.getByLabelText(/dirección/i);
    
    fireEvent.change(addressInput, { target: { value: 'invalid-address' } });
    fireEvent.blur(addressInput);
    
    await waitFor(() => {
      expect(screen.getByText(/la dirección no es válida/i)).toBeInTheDocument();
    });
  });

  test('handles successful cancha creation', async () => {

    const mockCanchaData = {
      nombre: 'Cancha Test',
      descripcion: 'Descripción de prueba',
      precio: '100'
    };

    const api = require('../../services/api');
    api.addCancha.mockResolvedValueOnce({ id: 1, ...mockCanchaData });

    renderAddCancha();
    
    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { value: mockCanchaData.nombre },
    });
    fireEvent.change(screen.getByLabelText(/descripción/i), {
      target: { value: mockCanchaData.descripcion },
    });
    fireEvent.change(screen.getByLabelText(/precio/i), {
      target: { value: mockCanchaData.precio },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /agregar cancha/i }));
    
    await waitFor(() => {
      expect(api.addCancha).toHaveBeenCalledWith(mockCanchaData);
    });
  });

  test('validates location coordinates', async () => {
    renderAddCancha();
    const locationInput = screen.getByLabelText(/ubicación/i);
    
    fireEvent.change(locationInput, { target: { value: 'invalid-coordinates' } });
    fireEvent.blur(locationInput);
    
    await waitFor(() => {
      expect(screen.getByText(/las coordenadas están fuera de rango/i)).toBeInTheDocument();
    });
  });

  test('handles creation error', async () => {

    const api = require('../../services/api');
    api.addCancha.mockRejectedValueOnce(new Error('Error al crear la cancha'));

    renderAddCancha();
    
    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { value: 'Test Cancha' },
    });
    fireEvent.change(screen.getByLabelText(/descripción/i), {
      target: { value: 'Test Descripción' },
    });
    fireEvent.change(screen.getByLabelText(/precio/i), {
      target: { value: '100' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /agregar cancha/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/error al crear la cancha/i)).toBeInTheDocument();
    });
  });
});
