const express = require('express');
const router = express.Router();
const canchaRoutes = require('./canchaRoutes');
const userRoutes = require('./userRoutes');
const reviewRoutes = require('./reviewRoutes');
const auth = require('../middlewares/auth');

// Public routes
router.use('/users', userRoutes);      // For login/register

// Mount cancha routes - public GET routes and protected other methods
router.use('/canchas', canchaRoutes);  // This will handle both public and protected routes as defined in canchaRoutes.js

// Protected routes for reviews
router.use('/reviews', auth, reviewRoutes);

// Protected user-specific routes
// These routes should be defined in userRoutes and mounted here
router.use('/users/me', auth, userRoutes);

module.exports = router;
