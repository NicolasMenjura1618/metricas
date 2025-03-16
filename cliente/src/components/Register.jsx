import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Link
} from '@mui/material';

import { toast } from 'react-toastify';

const API_URL = 'http://localhost:3000/api';

const Register = () => {
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    user_password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Validación nombre de usuario
    if (!formData.user_name) {
      newErrors.user_name = 'El nombre de usuario es requerido';
    } else if (formData.user_name.length < 4) {
      newErrors.user_name = 'El nombre de usuario debe tener al menos 4 caracteres';
    } else if (formData.user_name.length > 20) {
      newErrors.user_name = 'El nombre de usuario no puede tener más de 20 caracteres';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.user_name)) {
      newErrors.user_name = 'El nombre de usuario solo puede contener letras, números y guiones bajos';
    }

    // Validación email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.user_email) {
      newErrors.user_email = 'El email es requerido';
    } else if (!emailRegex.test(formData.user_email)) {
      newErrors.user_email = 'Por favor ingrese un email válido';
    }

    // Validación contraseña
    if (!formData.user_password) {
      newErrors.user_password = 'La contraseña es requerida';
    } else if (formData.user_password.length < 8) {
      newErrors.user_password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(formData.user_password)) {
      newErrors.user_password = 'La contraseña debe contener al menos una mayúscula, una minúscula y un número';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validar formulario
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/users`, formData);
      
      if (response.data) {
        toast.success('¡Registro exitoso! Ahora puedes iniciar sesión.');
        navigate('/login');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error en el registro.';
      toast.error(errorMessage);
      console.error('Error en registro:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5">
            Crear Cuenta
          </Typography>
          <Box component="form" onSubmit={handleRegister} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="user_name"
              label="Nombre de Usuario"
              name="user_name"
              autoComplete="username"
              autoFocus
              value={formData.user_name}
              onChange={handleChange}
              disabled={loading}
              error={!!errors.user_name}
              helperText={errors.user_name || 'Use letras, números y guiones bajos (4-20 caracteres)'}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="user_email"
              label="Correo Electrónico"
              name="user_email"
              autoComplete="email"
              type="email"
              value={formData.user_email}
              onChange={handleChange}
              disabled={loading}
              error={!!errors.user_email}
              helperText={errors.user_email || 'Ingrese un email válido'}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="user_password"
              label="Contraseña"
              type="password"
              id="user_password"
              autoComplete="new-password"
              value={formData.user_password}
              onChange={handleChange}
              disabled={loading}
              error={!!errors.user_password}
              helperText={errors.user_password || 'Mínimo 8 caracteres, una mayúscula, una minúscula y un número'}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Registrarse'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/login')}
              >
                ¿Ya tienes una cuenta? Inicia sesión
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
