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
const { createReview } = require('../Controlador/reviewController');

// Public routes
router.get('/', getAllCanchas);       // GET /api/canchas - List all canchas
router.get('/:id', getCanchaById);    // GET /api/canchas/:id - Get single cancha

// Protected routes - require authentication
router.post('/', auth, createCancha);       // POST /api/canchas - Create new cancha
router.put('/:id', auth, updateCancha);     // PUT /api/canchas/:id - Update cancha
router.delete('/:id', auth, deleteCancha);  // DELETE /api/canchas/:id - Delete cancha

// Reviews routes
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const cancha_id = req.params.id;
    const { name, rating, comentario } = req.body;
    
    // Validate required fields
    if (!name || !rating || !comentario) {
      return res.status(400).json({ 
        error: 'Nombre, rating y comentario son requeridos' 
      });
    }

    // Create review with the validated data
    const result = await createReview({
      cancha_id,
      name,
      rating,
      comentario
    });
    
    if (!result) {
      return res.status(500).json({ 
        error: 'Error al crear la reseña' 
      });
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error('Error creating review:', error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
