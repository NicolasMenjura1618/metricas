import axios from 'axios';
import { loginUser, registerUser, getCancha, addCancha, updateCancha, deleteCancha } from '../api';

// Mock axios
jest.mock('axios');

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('Authentication', () => {
    test('loginUser makes correct API call and returns data', async () => {
      const mockResponse = {
        data: {
          token: 'fake-token',
          user: { id: 1, email: 'test@test.com' }
        }
      };
      axios.post.mockResolvedValueOnce(mockResponse);

      const credentials = {
        email: 'test@test.com',
        password: 'password123'
      };

      const result = await loginUser(credentials);

      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        credentials
      );
      expect(result).toEqual(mockResponse.data);
    });

    test('loginUser handles API errors', async () => {
      const errorMessage = 'Credenciales inválidas';
      axios.post.mockRejectedValueOnce({ 
        response: { data: { error: errorMessage } }
      });

      await expect(loginUser({
        email: 'wrong@test.com',
        password: 'wrongpass'
      })).rejects.toThrow(errorMessage);
    });

    test('registerUser makes correct API call and returns data', async () => {
      const mockResponse = {
        data: { message: 'Usuario registrado exitosamente' }
      };
      axios.post.mockResolvedValueOnce(mockResponse);

      const userData = {
        nombre: 'Test User',
        email: 'test@test.com',
        password: 'password123'
      };

      const result = await registerUser(userData);

      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/register'),
        userData
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('Cancha Operations', () => {
    test('addCancha handles invalid input data', async () => {
      const invalidCanchaData = {
        nombre: '', // Invalid name
        descripcion: 'Descripción de la cancha',
        precio: -100 // Invalid price
      };

      await expect(addCancha(invalidCanchaData)).rejects.toThrow('Invalid input data');
    });

    test('loginUser handles expired token', async () => {
      const expiredTokenError = { 
        response: { 
          status: 401,
          data: { error: 'Token expirado' }
        }
      };
      axios.post.mockRejectedValueOnce(expiredTokenError);

      await expect(loginUser({
        email: 'test@test.com',
        password: 'password123'
      })).rejects.toThrow('Token expirado');
    });

    test('API calls handle server errors', async () => {
      const serverError = { 
        response: { 
          status: 500,
          data: { error: 'Error del servidor' }
        }
      };
      axios.get.mockRejectedValueOnce(serverError);

      await expect(getCancha()).rejects.toThrow('Error del servidor');
    });

    const token = 'fake-token';
    
    beforeEach(() => {
      localStorage.setItem('token', token);
    });

    test('getCancha makes correct API call with authentication', async () => {
      const mockResponse = {
        data: [{ id: 1, nombre: 'Cancha 1' }]
      };
      axios.get.mockResolvedValueOnce(mockResponse);

      const result = await getCancha();

      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/canchas'),
        expect.objectContaining({
          headers: { Authorization: `Bearer ${token}` }
        })
      );
      expect(result).toEqual(mockResponse.data);
    });

    test('addCancha makes correct API call with data', async () => {
      const mockResponse = {
        data: { id: 1, nombre: 'Nueva Cancha' }
      };
      axios.post.mockResolvedValueOnce(mockResponse);

      const canchaData = {
        nombre: 'Nueva Cancha',
        descripcion: 'Descripción de la cancha',
        precio: 100
      };

      const result = await addCancha(canchaData);

      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/canchas'),
        canchaData,
        expect.objectContaining({
          headers: { Authorization: `Bearer ${token}` }
        })
      );
      expect(result).toEqual(mockResponse.data);
    });

    test('updateCancha makes correct API call with data', async () => {
      const mockResponse = {
        data: { id: 1, nombre: 'Cancha Actualizada' }
      };
      axios.put.mockResolvedValueOnce(mockResponse);

      const canchaId = 1;
      const updateData = {
        nombre: 'Cancha Actualizada',
        precio: 150
      };

      const result = await updateCancha(canchaId, updateData);

      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining(`/canchas/${canchaId}`),
        updateData,
        expect.objectContaining({
          headers: { Authorization: `Bearer ${token}` }
        })
      );
      expect(result).toEqual(mockResponse.data);
    });

    test('deleteCancha makes correct API call', async () => {
      const mockResponse = {
        data: { message: 'Cancha eliminada exitosamente' }
      };
      axios.delete.mockResolvedValueOnce(mockResponse);

      const canchaId = 1;
      const result = await deleteCancha(canchaId);

      expect(axios.delete).toHaveBeenCalledWith(
        expect.stringContaining(`/canchas/${canchaId}`),
        expect.objectContaining({
          headers: { Authorization: `Bearer ${token}` }
        })
      );
      expect(result).toEqual(mockResponse.data);
    });

    test('API calls handle network errors', async () => {
      const networkError = new Error('Network Error');
      axios.get.mockRejectedValueOnce(networkError);

      await expect(getCancha()).rejects.toThrow('Network Error');
    });

    test('API calls handle unauthorized errors', async () => {
      const unauthorizedError = { 
        response: { 
          status: 401,
          data: { error: 'No autorizado' }
        }
      };
      axios.get.mockRejectedValueOnce(unauthorizedError);

      await expect(getCancha()).rejects.toThrow('No autorizado');
    });
  });
});
