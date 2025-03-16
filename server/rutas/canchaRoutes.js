const express = require('express');
const router = express.Router();
const {
  getAllCanchas,
  createCancha,
  getCanchaById,
  updateCancha,
  deleteCancha
} = require('../Controlador/canchaController');


// CRUD Canchas
router.get('/', getAllCanchas);       // GET /api/canchas
router.post('/', createCancha);       // POST /api/canchas
router.get('/:id', getCanchaById);    // GET /api/canchas/:id
router.put('/:id', updateCancha);     // PUT /api/canchas/:id
router.delete('/:id', deleteCancha);  // DELETE /api/canchas/:id

module.exports = router;
