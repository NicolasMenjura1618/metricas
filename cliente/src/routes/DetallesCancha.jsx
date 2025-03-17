import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

import AddReview from "../components/AddReview";
import Reviews from "../components/Reviews";
import { canchasAPI } from '../services/api';
import { CanchasContext } from "../context/contextCanchas";
import Header from "../components/Header";

const DetallesCancha = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { canchaSelect, setSelectCancha } = useContext(CanchasContext);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await canchasAPI.getById(id);
        setSelectCancha(response.data);
      } catch (error) {
        console.error('Error fetching cancha:', error);
        setError("Error al obtener los datos de la cancha.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, setSelectCancha]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Button
          onClick={() => navigate("/")}
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
        ) : canchaSelect && (
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
              reviews={canchaSelect.Reviews || []}
              onDelete={(reviewId) =>
                setSelectCancha((prev) => ({
                  ...prev,
                  Reviews: prev.Reviews.filter((r) => r.id !== reviewId),
                }))
              }
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default DetallesCancha;
