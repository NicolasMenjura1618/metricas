import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  CircularProgress, 
  Tabs, 
  Tab,
  Button // Added Button import
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import ListaCancha from './ListaCancha';
import { canchasAPI, reviewsAPI } from '../services/api'; // Removed userAPI as it is not used

import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [misCanchas, setMisCanchas] = useState([]);
  const [misReviews, setMisReviews] = useState([]);
  const [todasLasCanchas, setTodasLasCanchas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Ensure user is used in the component

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const [canchasResponse, reviewsResponse, todasCanchasResponse] = await Promise.all([
          canchasAPI.getUserCanchas(),
          reviewsAPI.getUserReviews(),
          canchasAPI.getAll()
        ]);
        
        // Acceder correctamente a los datos de la respuesta
        setMisCanchas(canchasResponse.data.data || []);
        setMisReviews(reviewsResponse.data.data || []);
        setTodasLasCanchas(todasCanchasResponse.data.data || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Error al cargar los datos del usuario');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAddCancha = () => {
    navigate('/agregar');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Bienvenido, {user?.username}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddCancha}
          >
            Agregar Cancha
          </Button>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Todas las Canchas" />
            <Tab label="Mis Reseñas" />
          </Tabs>
        </Box>
        
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            {activeTab === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <ListaCancha 
                    canchas={todasLasCanchas} 
                    isOwner={false}
                    emptyMessage="No hay canchas disponibles"
                  />
                </Grid>
              </Grid>
            )}
            {activeTab === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <ListaCancha 
                    canchas={misCanchas} 
                    isOwner={true}
                    emptyMessage="No tienes canchas registradas"
                  />
                </Grid>
              </Grid>
            )}
            {activeTab === 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  {misReviews.length > 0 ? (
                    misReviews.map((review) => (
                      <Box key={review.id} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                        <Typography variant="h6">{review.cancha_nombre}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Calificación: {review.rating}/5
                          </Typography>
                        </Box>
                        <Typography variant="body1">{review.comentario}</Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body1" color="text.secondary" align="center">
                      No has realizado ninguna reseña
                    </Typography>
                  )}
                </Grid>
              </Grid>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;
