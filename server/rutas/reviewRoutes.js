const express = require('express');
const router = express.Router();
const {
  getReviewsByCanchaId,
  getAllReviews,
  createReview,
  getReviewById,
  updateReview,
  deleteReview
} = require('../Controlador/reviewController');


router.get('/cancha/:id', getReviewsByCanchaId); // GET /api/reviews/cancha/:id



module.exports = router;
