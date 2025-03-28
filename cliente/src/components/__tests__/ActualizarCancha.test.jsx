import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ActualizarCancha from '../ActualizarCancha';

// Mock the API service
jest.mock('../../services/api', () => ({
  getCancha: jest.fn(),
  updateCancha: jest.fn()
}));

// Mock react-router-dom hooks
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' })
}));

// Mock data
const mockCancha = {
  id: 1,
  nombre: 'Cancha Test',
  descripcion: 'Descripción de prueba',
  precio: '100',
  estado: 'disponible'
};

const renderActualizarCancha = () => {
  return render(
    <BrowserRouter>
      <ActualizarCancha />
    </BrowserRouter>
  );
};

describe('ActualizarCancha Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const api = require('../../services/api');
    api.getCancha.mockResolvedValue(mockCancha);
  });

  test('loads and displays cancha data', async () => {
    renderActualizarCancha();

    await waitFor(() => {
      expect(screen.getByLabelText(/nombre/i)).toHaveValue(mockCancha.nombre);
      expect(screen.getByLabelText(/descripción/i)).toHaveValue(mockCancha.descripcion);
      expect(screen.getByLabelText(/precio/i)).toHaveValue(mockCancha.precio);
      expect(screen.getByLabelText(/estado/i)).toHaveValue(mockCancha.estado);
    });
  });

  test('handles loading state', () => {
    const api = require('../../services/api');
    api.getCancha.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

    renderActualizarCancha();

    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  test('handles load error with network timeout', async () => {
    const api = require('../../services/api');
    api.getCancha.mockImplementation(() => new Promise((_, reject) => setTimeout(() => reject(new Error('Network timeout')), 1000)));


    renderActualizarCancha();

    await waitFor(() => {
      expect(screen.getByText(/error al cargar la cancha/i)).toBeInTheDocument();
    });
  });

  test('validates required fields with malformed data', async () => {

    renderActualizarCancha();

    await waitFor(() => {
      expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /actualizar/i });
    
    // Clear fields
    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/descripción/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/precio/i), { target: { value: '' } });
    
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/el nombre es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/la descripción es requerida/i)).toBeInTheDocument();
      expect(screen.getByText(/el precio es requerido/i)).toBeInTheDocument();
    });
  });

  test('validates price format', async () => {
    renderActualizarCancha();

    await waitFor(() => {
      expect(screen.getByLabelText(/precio/i)).toBeInTheDocument();
    });

    const precioInput = screen.getByLabelText(/precio/i);
    fireEvent.change(precioInput, { target: { value: 'invalid-price' } });
    fireEvent.blur(precioInput);

    expect(screen.getByText(/el precio debe ser un número válido/i)).toBeInTheDocument();
  });

  test('handles successful update with malformed response', async () => {

    const api = require('../../services/api');
    api.updateCancha.mockResolvedValueOnce({ ...mockCancha, nombre: 'Cancha Actualizada' });

    renderActualizarCancha();

    await waitFor(() => {
      expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    });

    // Update name field
    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { value: 'Cancha Actualizada' }
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /actualizar/i }));

    await waitFor(() => {
      expect(api.updateCancha).toHaveBeenCalledWith(mockCancha.id, {
        ...mockCancha,
        nombre: 'Cancha Actualizada'
      });
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('handles update error with network failure', async () => {

    const api = require('../../services/api');
    api.updateCancha.mockRejectedValueOnce(new Error('Error al actualizar la cancha'));

    renderActualizarCancha();

    await waitFor(() => {
      expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /actualizar/i }));

    await waitFor(() => {
      expect(screen.getByText(/error al actualizar la cancha/i)).toBeInTheDocument();
    });
  });

  test('navigates back on cancel', async () => {
    renderActualizarCancha();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  test('handles form state changes', async () => {
    renderActualizarCancha();

    await waitFor(() => {
      expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    });

    // Test each field update
    const updates = {
      nombre: 'Nuevo Nombre',
      descripcion: 'Nueva Descripción',
      precio: '200',
      estado: 'mantenimiento'
    };

    Object.entries(updates).forEach(([field, value]) => {
      fireEvent.change(screen.getByLabelText(new RegExp(field, 'i')), {
        target: { value }
      });
    });

    // Verify all fields were updated
    Object.values(updates).forEach(value => {
      expect(screen.getByDisplayValue(value)).toBeInTheDocument();
    });
  });

  test('preserves original data when form is reset', async () => {
    renderActualizarCancha();

    await waitFor(() => {
      expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    });

    // Change a field
    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { value: 'Nombre Temporal' }
    });

    // Click reset button
    fireEvent.click(screen.getByRole('button', { name: /restablecer/i }));

    // Verify original data is restored
    expect(screen.getByLabelText(/nombre/i)).toHaveValue(mockCancha.nombre);
  });
});
