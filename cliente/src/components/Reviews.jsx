import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Rating, 
  IconButton,
  List,
  ListItem,
  Divider
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { reviewsAPI } from '../services/api';
import { toast } from 'react-toastify';

const Reviews = ({ reviews = [], onDelete }) => {
  const { user } = useAuth();

  const handleDelete = async (canchaId, reviewId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta reseña?')) {
      try {
        await reviewsAPI.delete(canchaId, reviewId);
        onDelete(reviewId);
        toast.success('Reseña eliminada exitosamente');
      } catch (error) {
        console.error('Error deleting review:', error);
        toast.error('Error al eliminar la reseña');
      }
    }
  };

  if (!reviews.length) {
    return (
      <Paper elevation={1} sx={{ p: 3, mt: 3 }}>
        <Typography variant="body1" color="textSecondary" align="center">
          No hay reseñas disponibles
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={1} sx={{ mt: 3 }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Reseñas
        </Typography>
      </Box>
      <List>
        {reviews.map((review, index) => (
          <React.Fragment key={review.id}>
            <ListItem
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                py: 2,
              }}
            >
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
                    {review.name}
                  </Typography>
                  <Rating value={review.rating} readOnly size="small" />
                </Box>
                {user && (user.id === review.user_id || user.isAdmin) && (
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(review.cancha_id, review.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {review.comentario}
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                {new Date(review.fecha).toLocaleDateString()}
              </Typography>
            </ListItem>
            {index < reviews.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default Reviews;
