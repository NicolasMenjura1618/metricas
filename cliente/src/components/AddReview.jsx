import React, { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import BuscaCanchas from "../apis/BuscaCanchas"; // Import BuscaCanchas

const AddReview = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const [name, setName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState("Rating");

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await BuscaCanchas.post(`/${id}/addReview`, {
        name,
        review: reviewText,
        rating,
      });
      navigate("/"); // Use navigate instead of history.push
      navigate(location.pathname);
    } catch (err) {
      console.error(err); // Log the error for debugging
    }
  };

  return (
    <div className="mb-2">
      <form action="">
        <div className="form-row">
          <div className="form-group col-8">
            <label htmlFor="name">Nombre</label>
            <input
              value={name} // Use name instead of nombre
              onChange={(e) => setName(e.target.value)}
              id="nombre"
              placeholder="nombre"
              type="text"
              className="form-control"
            />
          </div>
          <div className="form-group col-4">
            <label htmlFor="rating">Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              id="rating"
              className="custom-select"
            >
              <option disabled>Rating</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="Review">Review</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            id="Review"
            className="form-control"
          ></textarea>
        </div>
        <button
          type="submit"
          onClick={handleSubmitReview}
          className="btn btn-primary"
        >
          Añadir
        </button>
      </form>
    </div>
  );
};

export default AddReview;
