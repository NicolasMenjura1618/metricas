import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';
import { AuthProvider } from '../../context/AuthContext';

// Mock the API service
jest.mock('../../services/api', () => ({
  getCanchas: jest.fn(),
  getReviews: jest.fn()
}));

// Mock data
const mockCanchas = [
  {
    id: 1,
    nombre: 'Cancha 1',
    descripcion: 'Descripción de la cancha 1',
    precio: '100'
  },
  {
    id: 2,
    nombre: 'Cancha 2',
    descripcion: 'Descripción de la cancha 2',
    precio: '200'
  }
];

const mockReviews = [
  {
    id: 1,
    canchaId: 1,
    rating: 5,
    comentario: 'Excelente cancha',
    usuario: 'Usuario 1'
  },
  {
    id: 2,
    canchaId: 1,
    rating: 4,
    comentario: 'Muy buena cancha',
    usuario: 'Usuario 2'
  }
];

// Mock AuthContext
jest.mock('../../context/AuthContext', () => ({
  ...jest.requireActual('../../context/AuthContext'),
  useAuth: () => ({
    isAuthenticated: true,
    user: { id: 1, nombre: 'Test User', role: 'admin' }
  })
}));

const renderDashboard = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const api = require('../../services/api');
    api.getCanchas.mockResolvedValue(mockCanchas);
    api.getReviews.mockResolvedValue(mockReviews);
  });

  test('renders dashboard with canchas and reviews', async () => {
    renderDashboard();

    // Wait for canchas to load
    await waitFor(() => {
      mockCanchas.forEach(cancha => {
        expect(screen.getByText(cancha.nombre)).toBeInTheDocument();
        expect(screen.getByText(cancha.descripcion)).toBeInTheDocument();
        expect(screen.getByText(`$${cancha.precio}`)).toBeInTheDocument();
      });
    });

    // Check for reviews
    await waitFor(() => {
      mockReviews.forEach(review => {
        expect(screen.getByText(review.comentario)).toBeInTheDocument();
        expect(screen.getByText(review.usuario)).toBeInTheDocument();
      });
    });
  });

  test('displays loading state', () => {
    const api = require('../../services/api');
    api.getCanchas.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

    renderDashboard();

    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  test('handles error state', async () => {
    const api = require('../../services/api');
    api.getCanchas.mockRejectedValue(new Error('Failed to fetch canchas'));

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/error al cargar los datos/i)).toBeInTheDocument();
    });
  });

  test('filters canchas by search term', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Cancha 1')).toBeInTheDocument();
      expect(screen.getByText('Cancha 2')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/buscar cancha/i);
    fireEvent.change(searchInput, { target: { value: 'Cancha 1' } });

    expect(screen.getByText('Cancha 1')).toBeInTheDocument();
    expect(screen.queryByText('Cancha 2')).not.toBeInTheDocument();
  });

  test('sorts canchas by price', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getAllByTestId('cancha-item')).toHaveLength(mockCanchas.length);
    });

    const sortButton = screen.getByRole('button', { name: /ordenar por precio/i });
    fireEvent.click(sortButton);

    const canchaElements = screen.getAllByTestId('cancha-item');
    expect(canchaElements[0]).toHaveTextContent('$100');
    expect(canchaElements[1]).toHaveTextContent('$200');

    // Click again to sort in descending order
    fireEvent.click(sortButton);
    expect(canchaElements[0]).toHaveTextContent('$200');
    expect(canchaElements[1]).toHaveTextContent('$100');
  });

  test('displays admin controls for admin users', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/agregar cancha/i)).toBeInTheDocument();
      expect(screen.getAllByText(/editar/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/eliminar/i).length).toBeGreaterThan(0);
    });
  });

  test('navigates to add cancha page', async () => {
    renderDashboard();

    await waitFor(() => {
      const addButton = screen.getByText(/agregar cancha/i);
      fireEvent.click(addButton);
      expect(window.location.pathname).toBe('/agregar');
    });
  });

  test('displays review statistics', async () => {
    renderDashboard();

    await waitFor(() => {
      // Calculate average rating
      const averageRating = mockReviews.reduce((acc, review) => acc + review.rating, 0) / mockReviews.length;
      expect(screen.getByText(new RegExp(`${averageRating.toFixed(1)}`))).toBeInTheDocument();
      expect(screen.getByText(`(${mockReviews.length} reseñas)`)).toBeInTheDocument();
    });
  });

  test('handles pagination', async () => {
    // Mock large dataset
    const largeMockCanchas = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      nombre: `Cancha ${i + 1}`,
      descripcion: `Descripción ${i + 1}`,
      precio: `${(i + 1) * 100}`
    }));

    const api = require('../../services/api');
    api.getCanchas.mockResolvedValue(largeMockCanchas);

    renderDashboard();

    await waitFor(() => {
      // Verify only first page items are shown
      expect(screen.getByText('Cancha 1')).toBeInTheDocument();
      expect(screen.queryByText('Cancha 11')).not.toBeInTheDocument();
    });

    // Navigate to next page
    const nextButton = screen.getByRole('button', { name: /siguiente/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.queryByText('Cancha 1')).not.toBeInTheDocument();
      expect(screen.getByText('Cancha 11')).toBeInTheDocument();
    });
  });
});
