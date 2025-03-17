const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  getAllCanchas,
  createCancha,
  getCanchaById,
  updateCancha,
  deleteCancha
} = require('../Controlador/canchaController');

// Public routes
router.get('/', getAllCanchas);       // GET /api/canchas - List all canchas
router.get('/:id', getCanchaById);    // GET /api/canchas/:id - Get single cancha

// Protected routes - require authentication
router.post('/', auth, createCancha);       // POST /api/canchas - Create new cancha
router.put('/:id', auth, updateCancha);     // PUT /api/canchas/:id - Update cancha
router.delete('/:id', auth, deleteCancha);  // DELETE /api/canchas/:id - Delete cancha

module.exports = router;
