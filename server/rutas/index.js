const express = require('express');
const router = express.Router();
const canchaRoutes = require('./canchaRoutes');

// Use the cancha routes
router.use('/canchas', canchaRoutes);

module.exports = router;
