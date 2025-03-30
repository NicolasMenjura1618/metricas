import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add error handling for network issues
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error('Network Error:', error);
      toast.error('Error de conexión. Por favor, verifique su conexión a internet.');
    }
    return Promise.reject(error);
  }
);

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
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        toast.error('Sesión expirada. Por favor, inicie sesión nuevamente.');
      }
    } else {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export const getCancha = (id) => api.get(`/canchas/${id}`);
export const updateCancha = (id, data) => api.put(`/canchas/${id}`, data);

export const authAPI = {

  login: (credentials) => api.post('/users/login', credentials),
  register: (userData) => api.post('/users', userData),
  getProfile: () => api.get('/users/me'),
};

export const canchasAPI = {
  getAll: () => api.get('/canchas'),
  getById: (id) => api.get(`/canchas/${id}`),
  create: (data) => api.post('/canchas', data),
  update: (id, data) => api.put(`/canchas/${id}`, data),
  delete: (id) => api.delete(`/canchas/${id}`),
  getUserCanchas: () => api.get('/users/me/canchas'),
  getReviewsByCanchaId: (canchaId) => api.get(`/canchas/${canchaId}/reviews`), // Update to the correct endpoint



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
