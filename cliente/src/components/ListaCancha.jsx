import React from 'react';
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
import { Edit as EditIcon, Delete as DeleteIcon, RateReview as RateReviewIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { canchasAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ListaCancha = ({ canchas = [], isOwner = false, emptyMessage = "No hay canchas disponibles" }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleEdit = (id) => {
    navigate(`/actualizar/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta cancha?')) {
      try {
        await canchasAPI.delete(id);
        toast.success('Cancha eliminada exitosamente');
        // Refresh the page to get updated list
        window.location.reload();
      } catch (error) {
        toast.error('Error al eliminar la cancha');
      }
    }
  };

  const handleVerDetalles = (id) => {
    navigate(`/canchas/${id}`);
  };

  const handleAddReview = (id) => {
    if (!user) {
      toast.info('Debes iniciar sesión para dejar una reseña');
      navigate('/login');
      return;
    }
    navigate(`/canchas/${id}`);
  };

  if (!canchas || !canchas.length) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="textSecondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {canchas.map((cancha) => (
        <Grid item xs={12} sm={6} md={4} key={cancha.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h5" component="div" gutterBottom>
                {cancha.nombre}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                {cancha.direccion || cancha.location}
              </Typography>
              <Box display="flex" alignItems="center" mb={1}>
                <Rating value={Number(cancha.rating) || 0} readOnly precision={0.5} />
                <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                  ({cancha.num_reviews || 0} reseñas)
                </Typography>
              </Box>
              {cancha.owner_name && (
                <Typography variant="body2" color="textSecondary">
                  Propietario: {cancha.owner_name}
                </Typography>
              )}
              <Typography variant="body2" color="textSecondary">
                Precio: ${cancha.precio || 'No especificado'}/hora
              </Typography>
              {cancha.description && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {cancha.description}
                </Typography>
              )}
            </CardContent>
            <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
              <Box>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleVerDetalles(cancha.id)}
                >
                  Ver Detalles
                </Button>
                <Button
                  size="small"
                  color="secondary"
                  startIcon={<RateReviewIcon />}
                  onClick={() => handleAddReview(cancha.id)}
                >
                  Dejar Reseña
                </Button>
              </Box>
              {user && (isOwner || cancha.user_id === user.id) && (
                <Box>
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
                </Box>
              )}
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ListaCancha;
