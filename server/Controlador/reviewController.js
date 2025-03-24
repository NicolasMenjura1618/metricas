const pool = require('../db');

// Obtener todas las reviews
const getAllReviews = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reviews ORDER BY id ASC');
    return res.status(200).json({ data: result.rows });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Crear una nueva review
const createReview = async (reviewData) => {
  console.log('Received review data:', reviewData); // Log incoming review data

  try {
    const { cancha_id, name, review, rating } = reviewData;

    const result = await pool.query(
      `INSERT INTO reviews (cancha_id, name, review, rating)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [cancha_id, name, review, rating]
    );

    return { data: result.rows[0] };
  } catch (error) {
    console.error('Error in createReview:', error);
    return null;
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
    const { name, review, rating } = req.body;

    const result = await pool.query(
      `UPDATE reviews
       SET name = $1,
           review = $2,
           rating = $3
       WHERE id = $4
       RETURNING *`,
      [name, review, rating, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review no encontrada' });
    }

    return res.status(200).json({ data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Eliminar review
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM reviews WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review no encontrada' });
    }

    return res.status(200).json({ data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllReviews,
  createReview,
  getReviewById,
  updateReview,
  deleteReview,
};
