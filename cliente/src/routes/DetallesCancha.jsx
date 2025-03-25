import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Alert, CircularProgress, Typography, Container, Button } from '@mui/material';
import Header from '../components/Header';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { canchasAPI } from '../services/api';
import AddReview from '../components/AddReview';
import { reviewsAPI } from '../services/api';
import Reviews from '../components/Reviews';

const DetallesCancha = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canchaSelect, setSelectCancha] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await canchasAPI.getById(id);
        setSelectCancha(response.data);
        console.log("Fetching cancha data for ID:", id);
        const reviewsUrl = `http://localhost:3001/api/canchas/${id}/reviews`;
        console.log(`Requesting reviews from: ${reviewsUrl}`);


        // Fetch reviews for the selected cancha
        const reviewsResponse = await reviewsAPI.getByCancha(id); 

        setSelectCancha((prev) => ({
          ...prev,
          Reviews: reviewsResponse.data,
        }));
      } catch (error) {
        console.error('Error fetching cancha:', error);
        setError("Error al obtener los datos de la cancha o las reseñas.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Header />
      <Box sx={{ flexGrow: 1 }}>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Button
            onClick={() => navigate("/dashboard")}
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            sx={{ mb: 3 }}
          >
            Volver al Inicio
          </Button>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box display="flex" flexDirection="column" alignItems="center" my={5}>
              <CircularProgress />
              <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                Cargando cancha...
              </Typography>
            </Box>
          ) : canchaSelect ? (
            <Box>
              <Typography variant="h4" component="h1" gutterBottom color="primary" textAlign="center">
                {canchaSelect.nombre}
              </Typography>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Detalles de la Cancha
                </Typography>
                <Typography variant="body1">
                  Ubicación: {canchaSelect.ubicacion}
                </Typography>
                <Typography variant="body1">
                  Precio: ${canchaSelect.precio}/hora
                </Typography>
              </Box>

              <AddReview
                cancha={canchaSelect}
                onAddReview={(newReview) => {
                  setSelectCancha((prev) => ({
                    ...prev,
                    Reviews: [newReview, ...prev.Reviews],
                  }));
                }}
              />

              <Reviews
                reviews={canchaSelect.Reviews} // Use reviews directly from canchaSelect
                onDelete={(reviewId) =>
                  setSelectCancha((prev) => ({
                    ...prev,
                    Reviews: prev.Reviews.filter((r) => r.id !== reviewId),
                  }))
                }
              />

            </Box>
          ) : (
            <Typography variant="body1" color="textSecondary">
              No se encontraron datos de la cancha.
            </Typography>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default DetallesCancha;
