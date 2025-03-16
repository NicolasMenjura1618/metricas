const express = require('express');
const router = express.Router();
const {
  getAllReviews,
  createReview,
  getReviewById,
  updateReview,
  deleteReview
} = require('../Controlador/reviewController');


// CRUD Reviews
router.get('/', getAllReviews);        // GET /api/reviews
router.post('/', createReview);        // POST /api/reviews
router.get('/:id', getReviewById);     // GET /api/reviews/:id
router.put('/:id', updateReview);      // PUT /api/reviews/:id
router.delete('/:id', deleteReview);   // DELETE /api/reviews/:id

module.exports = router;
