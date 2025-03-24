const pool = require('../db');

const getAllReviews = async (req, res) => {
  const { cancha_id } = req.query; // Get cancha_id from query parameters
  try {
    const query = cancha_id 
      ? 'SELECT * FROM reviews WHERE cancha_id = $1 ORDER BY id ASC' 
      : 'SELECT * FROM reviews ORDER BY id ASC';
    const params = cancha_id ? [cancha_id] : [];
    const result = await pool.query(query, params);

    return res.status(200).json({ data: result.rows });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Crear una nueva review
const createReview = async (req, res) => {
  const { cancha_id, rating, review } = req.body;

  try {
    const user_id = req.user.id; // Get user_id from auth middleware

    const result = await pool.query(
      `INSERT INTO reviews (cancha_id, user_id, rating, review) 
      VALUES ($1, $2, $3, $4) RETURNING *`,
      [cancha_id, user_id, rating, review]
    );

    return res.status(201).json({
      data: result.rows[0],
      message: 'Review created successfully'
    });
  } catch (error) {
    console.error('Error in createReview:', error);
    return res.status(500).json({ 
      error: error.message,
      message: 'Error creating review'
    });
  }
};

// Obtener review por ID
const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM reviews WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review no encontrada' });
    }

    return res.status(200).json({ data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Actualizar review
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comentario } = req.body;

    const user_id = req.user.id;

    // Verify ownership
    const ownerCheck = await pool.query(
      'SELECT user_id FROM reviews WHERE id = $1',
      [id]
    );

    if (ownerCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (ownerCheck.rows[0].user_id !== user_id) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    const result = await pool.query(
      `UPDATE reviews SET rating = $1, comentario = $2 WHERE id = $3 RETURNING *`,
      [rating, comentario, id]
    );

    return res.status(200).json({
      data: result.rows[0],
      message: 'Review updated successfully'
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Eliminar review
const deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    const user_id = req.user.id;

    // Verify ownership
    const ownerCheck = await pool.query(
      'SELECT user_id FROM reviews WHERE id = $1',
      [id]
    );

    if (ownerCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (ownerCheck.rows[0].user_id !== user_id) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    const result = await pool.query(
      'DELETE FROM reviews WHERE id = $1 RETURNING *',
      [id]
    );

    return res.status(200).json({
      data: result.rows[0],
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteReview:', error);
    return res.status(500).json({ 
      error: error.message,
      message: 'Error deleting review'
    });
  }
};

module.exports = {
  getAllReviews,
  createReview,
  getReviewById,
  updateReview,
  deleteReview,
};
