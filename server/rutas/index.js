const express = require('express');
const router = express.Router();
const canchaRoutes = require('./canchaRoutes');
const userRoutes = require('./userRoutes');
const reviewRoutes = require('./reviewRoutes');
const auth = require('../middlewares/auth');

// Public routes
router.use('/canchas', canchaRoutes);  // Allow public access to canchas listing
router.use('/users', userRoutes);      // For login/register

// Protected routes that require authentication
router.use('/users/me', auth, (req, res, next) => {
  if (req.path === '/canchas') {
    return userRoutes.getUserCanchas(req, res, next);
  } else if (req.path === '/reviews') {
    return userRoutes.getUserReviews(req, res, next);
  }
  next();
});

// Protected routes for reviews
router.use('/reviews', auth, reviewRoutes);

// Protected routes for cancha operations (create, update, delete)
router.use('/canchas/:id', auth, (req, res, next) => {
  if (req.method !== 'GET') {  // Allow GET requests without auth
    return canchaRoutes.router(req, res, next);
  }
  next();
});

module.exports = router;
