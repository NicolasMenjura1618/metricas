import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { CanchasContext } from "../context/contextCanchas";
import { reviewsAPI } from '../services/api';
import { 
  Box,
  TextField,
  Button,
  Typography,
  Rating,
  Paper
} from '@mui/material';
import { toast } from 'react-toastify';

const AddReview = ({ cancha, onAddReview }) => {
  const { id } = useParams();
  const { setSelectCancha } = useContext(CanchasContext);

  const [name, setNombre] = useState("");
  const [rating, setRating] = useState(1);
  const [review, setReview] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await reviewsAPI.create(id, {
        name,
        rating,
        comentario: review,
      });

      const newReview = {
        id: response.data.id,
        name,
        rating,
        comentario: review,
        fecha: new Date().toISOString()
      };

      if (onAddReview) {
        onAddReview(newReview);
      }

      toast.success('Reseña agregada exitosamente');

      // Reset form
      setNombre("");
      setRating(1);
      setReview("");
    } catch (error) {
      console.error("Error al enviar la reseña:", error);
      toast.error('Error al agregar la reseña');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom color="primary">
        Agregar Reseña
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Nombre"
          value={name}
          onChange={(e) => setNombre(e.target.value)}
          required
          margin="normal"
        />

        <Box sx={{ my: 2 }}>
          <Typography component="legend">Calificación</Typography>
          <Rating
            name="rating"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          />
        </Box>

        <TextField
          fullWidth
          label="Comentario"
          multiline
          rows={4}
          value={review}
          onChange={(e) => setReview(e.target.value)}
          required
          margin="normal"
        />

        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          fullWidth 
          sx={{ mt: 2 }}
        >
          Enviar Reseña
        </Button>
      </Box>
    </Paper>
  );
};

export default AddReview;
