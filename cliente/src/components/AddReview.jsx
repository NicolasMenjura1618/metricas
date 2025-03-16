import React, { useState } from "react";
import BuscaCanchas from "../apis/BuscaCanchas";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { CanchasContext } from "../context/contextCanchas";

const AddReview = ({ cancha, onAddReview }) => {
  const { id } = useParams();
  const { setSelectCancha } = useContext(CanchasContext);

  const [name, setNombre] = useState("");
  const [rating, setRating] = useState(1);
  const [review, setReview] = useState("");

  const handleSubmit = async (e) => {
    console.log("Submitting review for cancha ID:", id);
    e.preventDefault();
    try {
      const response = await BuscaCanchas.post(`/${id}/AddReview`, {
        cancha_id: id,
        name,
        rating,
        review,
      });

      // Construye el objeto de reseña usando el name ingresado
      const newReview = {
        id: response.data.data.id,
        name, // Usa el valor del estado, es decir, el nombre ingresado
        rating,
        review,
      };

      // Notify parent component of the new review
      if (onAddReview) {
        onAddReview(newReview);
      }

      // Limpia el formulario tras enviar la reseña
      setNombre("");
      setRating(1);
      setReview("");
    } catch (error) {
      console.error(
        "Error al enviar la reseña:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="card p-4 shadow-sm">
      <h4 className="text-center text-primary">Agregar Reseña</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Calificación</label>
          <select
            className="form-select"
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
            required
          >
            <option value="1">⭐</option>
            <option value="2">⭐⭐</option>
            <option value="3">⭐⭐⭐</option>
            <option value="4">⭐⭐⭐⭐</option>
            <option value="5">⭐⭐⭐⭐⭐</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Comentario</label>
          <textarea
            className="form-control"
            rows="3"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Enviar Reseña
        </button>
      </form>
    </div>
  );
};

export default AddReview;
