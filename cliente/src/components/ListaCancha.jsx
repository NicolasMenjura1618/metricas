import React, { useContext } from 'react';

import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Grid,
  Rating,
  Box,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { canchasAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CanchasContext } from '../context/contextCanchas'; // Import CanchasContext


const ListaCancha = ({ canchas, isOwner = false, emptyMessage = "No hay canchas disponibles" }) => {
  const navigate = useNavigate();
  const { setCanchas } = useContext(CanchasContext); // Get setCanchas from context

  const { user } = useAuth();

  const handleEdit = (id) => {
    navigate(`/actualizar/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta cancha?')) {
      try {
        await canchasAPI.delete(id);
        toast.success('Cancha eliminada exitosamente');
        // Update the state to remove the deleted cancha
        setCanchas(prevCanchas => prevCanchas.filter(cancha => cancha.id !== id)); // Update context state

        setCanchas(prevCanchas => prevCanchas.filter(cancha => cancha.id !== id));

      } catch (error) {
        toast.error('Error al eliminar la cancha');
      }
    }
  };

  const handleVerDetalles = (id) => {
    navigate(`/canchas/${id}`);
  };

  if (!canchas || !canchas.length) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="textSecondary">
          {emptyMessage}
        </Typography>
        {isOwner && (
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => navigate('/agregar')}
          >
            Agregar Cancha
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {canchas.map((cancha) => (
        <Grid item xs={12} sm={6} md={4} key={cancha.id}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                {cancha.nombre}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                {cancha.ubicacion}
              </Typography>
              <Box display="flex" alignItems="center" mb={1}>
                <Rating value={cancha.rating || 0} readOnly precision={0.5} />
                <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                  ({cancha.num_reviews || 0} reseñas)
                </Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                Precio: ${cancha.precio}/hora
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="primary"
                onClick={() => handleVerDetalles(cancha.id)}
              >
                Ver Detalles
              </Button>
              {(isOwner || cancha.user_id === user?.id) && (
                <>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(cancha.id)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(cancha.id)}
                  >
                    Eliminar
                  </Button>
                </>
              )}
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ListaCancha;
