import React, { useContext, useEffect } from "react";
import StarRating from "./starRating"; // Import StarRating component

import { useNavigate } from "react-router-dom";
import BuscaCanchas from "../apis/BuscaCanchas";
import { CanchasContext } from "../context/contextCanchas";

const ListaCancha = () => {
  const { canchas, setCanchas, notify } = useContext(CanchasContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCanchas = async () => {
      try {
        const { data } = await BuscaCanchas.get("/");
        console.log("API Response:", data);
        setCanchas(data.data.Canchas);
      } catch (error) {
        console.error("Error al obtener canchas:", error);
      }
    };

    fetchCanchas();
  }, [setCanchas]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      const response = await BuscaCanchas.delete(`/${id}`);
      setCanchas(canchas.filter((cancha) => cancha.id !== id));
      notify("Cancha Eliminada!");
      console.log("Cancha deleted.", response);
      alert("Cancha Eliminada");
    } catch (error) {
      console.error("Error al eliminar la cancha:", error);
      alert("Error al eliminar la cancha. Inténtalo de nuevo.");
    }
  };

  const handleUpdate = (e, id) => {
    e.stopPropagation();
    navigate(`/canchas/${id}/actualizar`);
  };

  const handleSelect = (id, e) => {
    navigate(`/canchas/${id}`);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center text-primary mb-4">Lista de Canchas</h2>
      {canchas && canchas.length > 0 ? (
        <div className="row">
          {canchas.map((cancha) => (
            <div
              key={cancha.id}
              className="col-md-4 mb-4"
              onClick={(e) => handleSelect(cancha.id, e)}
              style={{ cursor: "pointer" }}
            >
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary">{cancha.nombre}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    {cancha.locacion}
                  </h6>
                  <p className="card-text">
                    <strong>Dirección:</strong> {cancha.direccion}
                  </p>
                  <p className="card-text">
                    <strong>Descripción:</strong> {cancha.descripcion}
                  </p>
                  <p className="card-text">
<strong>Ranking:</strong> <StarRating rating={cancha.average_rating || 0} />

                  </p>
                  <p className="card-text">
                    <strong>Votos:</strong> {cancha.count || 0} 
                  </p>
                </div>
                <div className="card-footer bg-transparent border-top-0 d-flex justify-content-between">
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={(e) => handleUpdate(e, cancha.id)}
                  >
                    Actualizar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={(e) => handleDelete(e, cancha.id)}
                  >
                    Borrar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info text-center">
          No hay canchas disponibles
        </div>
      )}
    </div>
  );
};

export default ListaCancha;
