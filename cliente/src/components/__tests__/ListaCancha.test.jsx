import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ListaCancha from '../ListaCancha';

// Mock the api service
jest.mock('../../services/api', () => ({
  getCanchas: jest.fn(),
  deleteCancha: jest.fn()
}));

// Mock the context
const mockCanchas = [
  {
    id: 1,
    nombre: 'Cancha 1',
    descripcion: 'Descripción 1',
  },
  {
    id: 2,
    nombre: 'Cancha 2',
    descripcion: 'Descripción 2',
  }
];

jest.mock('../../context/contextCanchas', () => ({
  useCancha: () => ({
    canchas: mockCanchas,
    setCanchas: jest.fn(),
    deleteCancha: jest.fn()
  })
}));

const renderListaCancha = () => {
  return render(
    <BrowserRouter>
      <ListaCancha />
    </BrowserRouter>
  );
};

describe('ListaCancha Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders list of canchas', () => {
    renderListaCancha();
    
    mockCanchas.forEach(cancha => {
      expect(screen.getByText(cancha.nombre)).toBeInTheDocument();
      expect(screen.getByText(cancha.descripcion)).toBeInTheDocument();
    });
  });

  test('renders empty state when no canchas available', () => {
    jest.mock('../../context/contextCanchas', () => ({
      useCancha: () => ({
        canchas: [],
        setCanchas: jest.fn(),
        deleteCancha: jest.fn()
      })
    }));
    
    renderListaCancha();
    expect(screen.getByText(/no hay canchas disponibles/i)).toBeInTheDocument();
  });

  test('handles load error with network timeout', async () => {
    const api = require('../../services/api');
    api.getCanchas.mockImplementation(() => new Promise((_, reject) => setTimeout(() => reject(new Error('Network timeout')), 1000)));
    
    renderListaCancha();
    
    await waitFor(() => {
      expect(screen.getByText(/error al cargar las canchas/i)).toBeInTheDocument();
    });
  });

  test('handles cancha deletion', async () => {
    const api = require('../../services/api');
    api.deleteCancha.mockResolvedValueOnce({ message: 'Cancha eliminada exitosamente' });

    renderListaCancha();
    
    const deleteButtons = screen.getAllByRole('button', { name: /eliminar/i });
    fireEvent.click(deleteButtons[0]);
    
    expect(screen.getByText(/¿está seguro de eliminar esta cancha?/i)).toBeInTheDocument();
    
    const confirmButton = screen.getByRole('button', { name: /confirmar/i });
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(api.deleteCancha).toHaveBeenCalledWith(mockCanchas[0].id);
    });
  });

  test('handles deletion error with network failure', async () => {
    const api = require('../../services/api');
    api.deleteCancha.mockRejectedValueOnce(new Error('Network failure during deletion'));

    renderListaCancha();
    
    const deleteButtons = screen.getAllByRole('button', { name: /eliminar/i });
    fireEvent.click(deleteButtons[0]);
    
    const confirmButton = screen.getByRole('button', { name: /confirmar/i });
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(screen.getByText(/error al eliminar la cancha/i)).toBeInTheDocument();
    });
  });

  test('navigates to update page when edit button is clicked', () => {
    renderListaCancha();
    
    const editButtons = screen.getAllByRole('button', { name: /editar/i });
    fireEvent.click(editButtons[0]);
    
    expect(window.location.pathname).toContain(`/actualizar/${mockCanchas[0].id}`);
  });

  test('displays cancha details correctly', () => {
    renderListaCancha();
    
    mockCanchas.forEach(cancha => {
      const canchaElement = screen.getByTestId(`cancha-${cancha.id}`);
      expect(canchaElement).toHaveTextContent(cancha.nombre);
      expect(canchaElement).toHaveTextContent(cancha.descripcion);
    });
  });

  test('filters canchas by search term', () => {
    renderListaCancha();
    
    const searchInput = screen.getByPlaceholderText(/buscar cancha/i);
    fireEvent.change(searchInput, { target: { value: 'Cancha 1' } });
    
    expect(screen.getByText('Cancha 1')).toBeInTheDocument();
    expect(screen.queryByText('Cancha 2')).not.toBeInTheDocument();
  });

  test('sorts canchas by price', () => {
    renderListaCancha();
    
    const sortButton = screen.getByRole('button', { name: /ordenar por precio/i });
    fireEvent.click(sortButton);
    
    const canchaElements = screen.getAllByTestId(/cancha-/);
    expect(canchaElements[0]).toHaveTextContent('$100');
    expect(canchaElements[1]).toHaveTextContent('$200');
    
    fireEvent.click(sortButton);
    expect(canchaElements[0]).toHaveTextContent('$200');
    expect(canchaElements[1]).toHaveTextContent('$100');
  });
});
