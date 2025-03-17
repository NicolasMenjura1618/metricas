const pool = require('../db');

// Obtener todas las canchas con ratings y número de reviews
const getAllCanchas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.*,
        COALESCE(AVG(r.rating), 0) as rating,
        COUNT(DISTINCT r.review_id) as num_reviews,
        u.user_name as owner_name
      FROM canchas c
      LEFT JOIN reviews r ON c.id = r.cancha_id
      LEFT JOIN users u ON c.user_id = u.user_id
      GROUP BY c.id, u.user_id, u.user_name
      ORDER BY c.id ASC
    `);
    
    return res.status(200).json({ 
      data: result.rows,
      message: 'Canchas obtenidas exitosamente'
    });
  } catch (error) {
    console.error('Error en getAllCanchas:', error);
    return res.status(500).json({ 
      error: error.message,
      message: 'Error al obtener las canchas'
    });
  }
};

// Crear una nueva cancha
const createCancha = async (req, res) => {
  try {
    const { nombre, direccion, description, location, precio } = req.body;
    const user_id = req.user?.id; // Get user_id from auth middleware

    const result = await pool.query(
      `INSERT INTO canchas (
        nombre, 
        direccion, 
        description, 
        location, 
        precio,
        user_id,
        created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *`,
      [nombre, direccion, description, location, precio, user_id]
    );

    return res.status(201).json({
      data: result.rows[0],
      message: 'Cancha creada exitosamente'
    });
  } catch (error) {
    console.error('Error en createCancha:', error);
    return res.status(500).json({ 
      error: error.message,
      message: 'Error al crear la cancha'
    });
  }
};

// Obtener una cancha por ID con sus reviews
const getCanchaById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const canchaResult = await pool.query(`
      SELECT 
        c.*,
        COALESCE(AVG(r.rating), 0) as rating,
        COUNT(DISTINCT r.review_id) as num_reviews,
        u.user_name as owner_name
      FROM canchas c
      LEFT JOIN reviews r ON c.id = r.cancha_id
      LEFT JOIN users u ON c.user_id = u.user_id
      WHERE c.id = $1
      GROUP BY c.id, u.user_id, u.user_name
    `, [id]);

    if (canchaResult.rows.length === 0) {
      return res.status(404).json({ message: 'Cancha no encontrada' });
    }

    const reviewsResult = await pool.query(`
      SELECT 
        r.*,
        u.user_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.user_id
      WHERE r.cancha_id = $1
      ORDER BY r.created_at DESC
    `, [id]);

    const cancha = canchaResult.rows[0];
    cancha.Reviews = reviewsResult.rows;

    return res.status(200).json({ 
      data: cancha,
      message: 'Cancha obtenida exitosamente'
    });
  } catch (error) {
    console.error('Error en getCanchaById:', error);
    return res.status(500).json({ 
      error: error.message,
      message: 'Error al obtener la cancha'
    });
  }
};

// Actualizar una cancha existente
const updateCancha = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, direccion, description, location, precio } = req.body;
    const user_id = req.user?.id; // Get user_id from auth middleware

    // Verify ownership
    const ownerCheck = await pool.query(
      'SELECT user_id FROM canchas WHERE id = $1',
      [id]
    );

    if (ownerCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Cancha no encontrada' });
    }

    if (ownerCheck.rows[0].user_id !== user_id) {
      return res.status(403).json({ message: 'No autorizado para actualizar esta cancha' });
    }

    const result = await pool.query(
      `UPDATE canchas
       SET nombre = $1,
           direccion = $2,
           description = $3,
           location = $4,
           precio = $5,
           updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [nombre, direccion, description, location, precio, id]
    );

    return res.status(200).json({
      data: result.rows[0],
      message: 'Cancha actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error en updateCancha:', error);
    return res.status(500).json({ 
      error: error.message,
      message: 'Error al actualizar la cancha'
    });
  }
};

// Eliminar una cancha
const deleteCancha = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user?.id; // Get user_id from auth middleware

    // Verify ownership
    const ownerCheck = await pool.query(
      'SELECT user_id FROM canchas WHERE id = $1',
      [id]
    );

    if (ownerCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Cancha no encontrada' });
    }

    if (ownerCheck.rows[0].user_id !== user_id) {
      return res.status(403).json({ message: 'No autorizado para eliminar esta cancha' });
    }

    const result = await pool.query(
      'DELETE FROM canchas WHERE id = $1 RETURNING *',
      [id]
    );

    return res.status(200).json({
      data: result.rows[0],
      message: 'Cancha eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error en deleteCancha:', error);
    return res.status(500).json({ 
      error: error.message,
      message: 'Error al eliminar la cancha'
    });
  }
};

module.exports = {
  getAllCanchas,
  createCancha,
  getCanchaById,
  updateCancha,
  deleteCancha,
};
