const express = require('express');
const router = express.Router();
const canchaRoutes = require('./canchaRoutes');

// Use the cancha routes
router.use('/cancha', canchaRoutes);

module.exports = router;
