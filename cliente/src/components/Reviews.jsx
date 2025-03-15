import React from "react";
import PropTypes from "prop-types";
import StarRating from "./starRating";
import BuscaCanchas from "../apis/BuscaCanchas";

const Reviews = ({ reviews, onDelete }) => {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return <p className="text-muted">No hay reseñas aún.</p>;
  }

  const handleDelete = async (reviewId) => {
    try {
      await BuscaCanchas.delete(`/reviews/${reviewId}`);
      onDelete(reviewId);
    } catch (error) {
      console.error("Error al eliminar la reseña:", error);
    }
  };

  return (
    <div className="row">
      {reviews
        .slice()
        .sort((a, b) => b.id - a.id) // Ordena de la más reciente a la más antigua
        .map((review) => (
          <div key={review.id} className="col-12 mb-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h4 className="card-title mb-2">
                  {review.name || "Usuario anónimo"}
                </h4>

                {/* Componente de estrellas */}
                <StarRating rating={review.rating} />

                {/* Texto de la reseña */}
                {review.review && (
                  <p className="card-text text-secondary mt-2">
                    {review.review}
                  </p>
                )}

                {/* Botón para eliminar reseña */}
                <button
                  onClick={() => handleDelete(review.id)}
                  className="btn btn-danger btn-sm mt-2"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

Reviews.propTypes = {
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      rating: PropTypes.number.isRequired,
      review: PropTypes.string,
    })
  ),
  onDelete: PropTypes.func.isRequired,
};

export default Reviews;
