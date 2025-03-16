import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Ha ocurrido un error';
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      toast.error('Sesión expirada. Por favor, inicie sesión nuevamente.');
    } else {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/users/login', credentials),
  // Add other auth-related endpoints here
};

export const canchasAPI = {
  getAll: () => api.get('/canchas'),
  getById: (id) => api.get(`/canchas/${id}`),
  create: (data) => api.post('/canchas', data),
  update: (id, data) => api.put(`/canchas/${id}`, data),
  delete: (id) => api.delete(`/canchas/${id}`),
  getUserCanchas: () => api.get('/users/me/canchas'),
};

export const reviewsAPI = {
  getByCancha: (canchaId) => api.get(`/canchas/${canchaId}/reviews`),
  create: (canchaId, data) => api.post(`/canchas/${canchaId}/reviews`, data),
  update: (canchaId, reviewId, data) => api.put(`/canchas/${canchaId}/reviews/${reviewId}`, data),
  delete: (canchaId, reviewId) => api.delete(`/canchas/${canchaId}/reviews/${reviewId}`),
  getUserReviews: () => api.get('/users/me/reviews'),
};

export const userAPI = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
};

export default api;
