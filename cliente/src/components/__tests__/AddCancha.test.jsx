                                                                    |||import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import AddCancha from '../AddCancha';
import { CanchasContext } from '../../context/contextCanchas'; // Import the context

const mockContextValue = {
  setCanchas: jest.fn(),
  notify: jest.fn(),
};

jest.mock('../../services/api', () => ({
  addCancha: jest.fn(),
}));

const renderAddCancha = () => {
  return render(
    <CanchasContext.Provider value={mockContextValue}>
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
    expect(screen.getByLabelText(/nombre de la cancha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ubicación de la cancha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dirección de la cancha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descripción de la cancha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /añadir/i })).toBeInTheDocument();
  });

  test('validates required fields and empty name', async () => {
    renderAddCancha();
    const submitButton = screen.getByRole('button', { name: /añadir/i });
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/el nombre es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/la descripción es requerida/i)).toBeInTheDocument();
    });
  });

  test('validates address format', async () => {
    renderAddCancha();
    const addressInput = screen.getByLabelText(/dirección de la cancha/i);
    
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
      locacion: 'Ubicación X',
      direccion: 'Dirección Y'
    };

    const api = require('../../services/api');
    api.addCancha.mockResolvedValueOnce({ data: { id: 1, ...mockCanchaData } });

    renderAddCancha();
    
    fireEvent.change(screen.getByLabelText(/nombre de la cancha/i), {
      target: { value: mockCanchaData.nombre },
    });
    fireEvent.change(screen.getByLabelText(/ubicación de la cancha/i), {
      target: { value: mockCanchaData.locacion },
    });
    fireEvent.change(screen.getByLabelText(/dirección de la cancha/i), {
      target: { value: mockCanchaData.direccion },
    });
    fireEvent.change(screen.getByLabelText(/descripción de la cancha/i), {
      target: { value: mockCanchaData.descripcion },
    });

    fireEvent.click(screen.getByRole('button', { name: /añadir/i }));
    
    await waitFor(() => {
      expect(api.addCancha).toHaveBeenCalledWith(mockCanchaData);
      expect(mockContextValue.setCanchas).toHaveBeenCalledWith({ id: 1, ...mockCanchaData });
      expect(mockContextValue.notify).toHaveBeenCalledWith("Cancha creada");
    });
  });

  test('handles creation error', async () => {
    const api = require('../../services/api');
    api.addCancha.mockRejectedValueOnce(new Error('Error al crear la cancha'));

    renderAddCancha();
    
    fireEvent.change(screen.getByLabelText(/nombre de la cancha/i), {
      target: { value: 'Test Cancha' },
    });
    fireEvent.change(screen.getByLabelText(/descripción de la cancha/i), {
      target: { value: 'Test Descripción' },
    });
    fireEvent.change(screen.getByLabelText(/ubicación de la cancha/i), {
      target: { value: 'Ubicación Test' },
    });
    fireEvent.change(screen.getByLabelText(/dirección de la cancha/i), {
      target: { value: 'Dirección Test' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /añadir/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/error al añadir cancha/i)).toBeInTheDocument();
    });
  });
});
