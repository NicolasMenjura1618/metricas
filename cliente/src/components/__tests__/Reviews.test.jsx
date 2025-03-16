import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Reviews from '../Reviews';

// Mock the api service
jest.mock('../../services/api', () => ({
  getReviews: jest.fn(),
  addReview: jest.fn(),
  deleteReview: jest.fn()
}));

// Mock data
const mockReviews = [
  {
    id: 1,
    rating: 5,
    comentario: 'Excelente cancha',
    usuario: 'Usuario 1',
    fecha: '2023-08-01'
  },
  {
    id: 2,
    rating: 4,
    comentario: 'Muy buena cancha',
    usuario: 'Usuario 2',
    fecha: '2023-08-02'
  }
];

// Mock AuthContext
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1, nombre: 'Test User' },
    isAuthenticated: true
  })
}));

const renderReviews = (canchaId = '1') => {
  return render(
    <BrowserRouter>
      <Reviews canchaId={canchaId} />
    </BrowserRouter>
  );
};

describe('Reviews Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const api = require('../../services/api');
    api.getReviews.mockResolvedValue(mockReviews);
  });

  test('renders reviews list', async () => {
    renderReviews();
    
    await waitFor(() => {
      mockReviews.forEach(review => {
        expect(screen.getByText(review.comentario)).toBeInTheDocument();
        expect(screen.getByText(review.usuario)).toBeInTheDocument();
        expect(screen.getByText(new RegExp(review.fecha))).toBeInTheDocument();
      });
    });
  });

  test('displays star ratings correctly', async () => {
    renderReviews();
    
    await waitFor(() => {
      mockReviews.forEach(review => {
        const stars = screen.getAllByTestId(`star-rating-${review.id}`);
        const filledStars = stars.filter(star => star.classList.contains('filled'));
        expect(filledStars.length).toBe(review.rating);
      });
    });
  });

  test('handles adding new review', async () => {
    const api = require('../../services/api');
    const newReview = {
      rating: 4,
      comentario: 'Nueva reseña de prueba',
      canchaId: '1'
    };
    
    api.addReview.mockResolvedValueOnce({
      id: 3,
      ...newReview,
      usuario: 'Test User',
      fecha: '2023-08-03'
    });

    renderReviews();
    
    // Open review form
    fireEvent.click(screen.getByText(/escribir reseña/i));
    
    // Fill form
    const ratingStars = screen.getAllByTestId(/star-input/);
    fireEvent.click(ratingStars[3]); // Select 4 stars
    
    const comentarioInput = screen.getByPlaceholderText(/escribe tu comentario/i);
    fireEvent.change(comentarioInput, {
      target: { value: newReview.comentario }
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /enviar reseña/i }));
    
    await waitFor(() => {
      expect(api.addReview).toHaveBeenCalledWith(newReview);
      expect(screen.getByText(newReview.comentario)).toBeInTheDocument();
    });
  });

  test('validates review form submission', async () => {
    renderReviews();
    
    fireEvent.click(screen.getByText(/escribir reseña/i));
    fireEvent.click(screen.getByRole('button', { name: /enviar reseña/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/debes seleccionar una calificación/i)).toBeInTheDocument();
      expect(screen.getByText(/el comentario es requerido/i)).toBeInTheDocument();
    });
  });

  test('handles review deletion', async () => {
    const api = require('../../services/api');
    api.deleteReview.mockResolvedValueOnce({ message: 'Reseña eliminada exitosamente' });

    renderReviews();
    
    await waitFor(() => {
      const deleteButtons = screen.getAllByRole('button', { name: /eliminar reseña/i });
      fireEvent.click(deleteButtons[0]);
    });
    
    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /confirmar/i });
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(api.deleteReview).toHaveBeenCalledWith(mockReviews[0].id);
      expect(screen.queryByText(mockReviews[0].comentario)).not.toBeInTheDocument();
    });
  });

  test('handles error when fetching reviews', async () => {
    const api = require('../../services/api');
    api.getReviews.mockRejectedValueOnce(new Error('Error al cargar las reseñas'));

    renderReviews();
    
    await waitFor(() => {
      expect(screen.getByText(/error al cargar las reseñas/i)).toBeInTheDocument();
    });
  });

  test('calculates and displays average rating', async () => {
    renderReviews();
    
    await waitFor(() => {
      const averageRating = (mockReviews.reduce((acc, review) => acc + review.rating, 0) / mockReviews.length).toFixed(1);
      expect(screen.getByText(new RegExp(`${averageRating}`))).toBeInTheDocument();
    });
  });

  test('sorts reviews by date', async () => {
    renderReviews();
    
    await waitFor(() => {
      const sortButton = screen.getByRole('button', { name: /ordenar por fecha/i });
      fireEvent.click(sortButton);
      
      const reviewElements = screen.getAllByTestId(/review-/);
      expect(reviewElements[0]).toHaveTextContent(mockReviews[1].fecha);
      expect(reviewElements[1]).toHaveTextContent(mockReviews[0].fecha);
    });
  });
});
