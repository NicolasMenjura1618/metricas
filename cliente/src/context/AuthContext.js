import React, { createContext, useState, useContext, useEffect } from 'react';
import api, { authAPI } from '../services/api';
import axios from 'axios'; // Importing axios

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    if (token && userData) {
      // Set default axios header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      
      const { token, user: userData } = response.data;
      
      // Guardar token y datos del usuario
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Configurar header de autorización
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Actualizar estado
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al iniciar sesión'
      };
    }
  };

  const logout = () => {
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    
    // Limpiar header de autorización
    delete api.defaults.headers.common['Authorization'];
    
    // Limpiar estado
    setUser(null);
  };

const register = async (userData) => {
  try {
    const response = await authAPI.register(userData);
    const { token, user } = response.data;

    // Save token and user data to localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('userData', JSON.stringify(user));

    // Set authorization header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Update user state
    setUser(user);
    
    return { success: true };
  } catch (error) {
    console.error('Error in registration:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Error during registration'
    };
  }
};

const value = {
  register,

    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
