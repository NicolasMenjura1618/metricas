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


router.get('/:id/reviews', getReviewsByCanchaId); // GET /api/canchas/:id/reviews




module.exports = router;
