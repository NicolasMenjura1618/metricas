const express = require("express");
const router = express.Router();
const reviewController = require("../Controlador/reviewController");


// GET /api/v1/reviews/:id              => Obtener todas las reseñas de la cancha :id
router.get("/:id", reviewController.getReviewsByCanchaId);

// POST /api/v1/reviews/:id/AddReview   => Crear una reseña para la cancha :id
router.post("/:id/AddReview", reviewController.createReview);

// DELETE /api/v1/reviews/:id           => Eliminar reseña con id
router.delete("/:id", reviewController.deleteReview);

module.exports = router;
