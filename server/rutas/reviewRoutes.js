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


router.get('/cancha/:cancha_id', getReviewsByCanchaId); // GET /api/reviews/cancha/:cancha_id


module.exports = router;
