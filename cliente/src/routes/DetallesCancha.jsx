import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AddReview from "../components/AddReview";
import Reviews from "../components/Reviews";
import BuscaCanchas from "../apis/BuscaCanchas";
import { CanchasContext } from "../context/contextCanchas";

const DetallesCancha = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { canchaSelect, setSelectCancha } = useContext(CanchasContext);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await BuscaCanchas.get(`/${id}`);
        const cancha = response.data;
        setSelectCancha(cancha.data);
      } catch (error) {
        setError("Error al obtener los datos de la cancha.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, setSelectCancha]);

  return (
    <div className="container py-4">
      {/* Botón para volver al inicio */}
      <button
        onClick={() => navigate("/")}
        className="btn btn-primary mb-3"
      >
        Volver al Inicio
      </button>

      {/* Mensaje de error */}
      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {/* Spinner de carga */}
      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2 text-muted">Cargando cancha...</p>
        </div>
      )}

      {/* Contenido principal */}
      {!loading && canchaSelect && (
        <div className="card shadow">
          <div className="card-body">
            <h1 className="card-title text-center text-primary fw-bold mb-4">
              {canchaSelect.name}
            </h1>

            {/* Sección para añadir reseña */}
            <div className="mb-4">
              <AddReview
                cancha={canchaSelect}
                onAddReview={(newReview) => {
                  setSelectCancha((prev) => ({
                    ...prev,
                    Reviews: [newReview, ...prev.Reviews],
                  }));
                }}
              />
            </div>

            {/* Listado de reseñas */}
            <Reviews
              reviews={canchaSelect.Reviews}
              onDelete={(reviewId) =>
                setSelectCancha((prev) => ({
                  ...prev,
                  Reviews: prev.Reviews.filter((r) => r.id !== reviewId),
                }))
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DetallesCancha;
