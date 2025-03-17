import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import Header from '../components/Header';
import ListaCancha from '../components/ListaCancha';
import { canchasAPI } from '../services/api';

const Home = () => {
  const [canchas, setCanchas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCanchas = async () => {
      try {
        setLoading(true);
        const response = await canchasAPI.getAll();
        if (response.data && response.data.data) {
          setCanchas(response.data.data);
        } else {
          setError('No se pudieron cargar las canchas');
        }
      } catch (error) {
        console.error('Error fetching canchas:', error);
        setError('Error al cargar las canchas. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchCanchas();
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Canchas Disponibles
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <ListaCancha canchas={canchas} />
        )}
      </Container>
    </Box>
  );
};

export default Home;
