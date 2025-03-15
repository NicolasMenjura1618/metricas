const express = require("express");
const router = express.Router();
const reviewController = require("../Controlador/reviewController");
const authMiddleware = require("../middlewares/auth");

// Obtener reseñas de una cancha (accesible para todos)
router.get("/:id", reviewController.getReviewsByCanchaId);

// Crear reseña (usuarios autenticados)
router.post("/:id/AddReview", authMiddleware, reviewController.createReview);

// Eliminar reseña (aquí se podría agregar lógica adicional para verificar si el usuario es creador o admin)
router.delete("/:id", authMiddleware, reviewController.deleteReview);

module.exports = router;
