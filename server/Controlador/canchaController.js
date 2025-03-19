const pool = require('../db');

// Helper function to check database connection
const checkDatabaseConnection = async () => {
  try {
    await pool.testConnection();
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
};

// Obtener todas las canchas con ratings y número de reviews
const getAllCanchas = async (req, res) => {
  try {
    // Check database connection first
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      return res.status(500).json({ 
        error: 'Database connection error',
        message: 'Error de conexión con la base de datos'
      });
    }

    const result = await pool.query(`
      SELECT 
        c.*,
        COALESCE(AVG(r.rating), 0) as rating,
        COUNT(DISTINCT r.id) as num_reviews
      FROM canchas c
      LEFT JOIN reviews r ON c.id = r.cancha_id
      GROUP BY c.id
      ORDER BY c.id ASC
    `);
    
    return res.status(200).json({ 
      data: result.rows,
      message: 'Canchas obtenidas exitosamente'
    });
  } catch (error) {
    console.error('Error en getAllCanchas:', error);
    // Log detailed error information
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      query: error.query,
      parameters: error.parameters
    });
    return res.status(500).json({ 
      error: error.message,
      message: 'Error al obtener las canchas'
    });
  }
};

// Crear una nueva cancha
const createCancha = async (req, res) => {
  try {
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      return res.status(500).json({ 
        error: 'Database connection error',
        message: 'Error de conexión con la base de datos'
      });
    }

    const { nombre, direccion, description, location  } = req.body;
    const user_id = req.user?.id; // Get user_id from auth middleware

    if (!user_id) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Usuario no autenticado'
      });
    }

    const result = await pool.query(
      `INSERT INTO canchas (
        nombre, 
        description,
        location, 
        direccion, 
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [nombre, description, location, direccion]
    );

    return res.status(201).json({
      data: result.rows[0],
      message: 'Cancha creada exitosamente'
    });
  } catch (error) {
    console.error('Error en createCancha:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      query: error.query,
      parameters: error.parameters
    });
    return res.status(500).json({ 
      error: error.message,
      message: 'Error al crear la cancha'
    });
  }
};

// Obtener una cancha por ID con sus reviews
const getCanchaById = async (req, res) => {
  try {
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      return res.status(500).json({ 
        error: 'Database connection error',
        message: 'Error de conexión con la base de datos'
      });
    }

    const { id } = req.params;
    
    const canchaResult = await pool.query(`
      SELECT 
        c.*,
        COALESCE(AVG(r.rating), 0) as rating,
        COUNT(DISTINCT r.id) as num_reviews
      FROM canchas c
      LEFT JOIN reviews r ON c.id = r.cancha_id
      WHERE c.id = $1
      GROUP BY c.id
    `, [id]);

    if (canchaResult.rows.length === 0) {
      return res.status(404).json({ message: 'Cancha no encontrada' });
    }

    const reviewsResult = await pool.query(`
      SELECT 
        r.*,
        u.user_name
      FROM reviews r
      LEFT JOIN users u ON u.user_name = r.name
      WHERE r.cancha_id = $1
      ORDER BY r.id DESC
    `, [id]);

    const cancha = canchaResult.rows[0];
    cancha.Reviews = reviewsResult.rows;

    return res.status(200).json({ 
      data: cancha,
      message: 'Cancha obtenida exitosamente'
    });
  } catch (error) {
    console.error('Error en getCanchaById:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      query: error.query,
      parameters: error.parameters
    });
    return res.status(500).json({ 
      error: error.message,
      message: 'Error al obtener la cancha'
    });
  }
};

// Actualizar una cancha existente
const updateCancha = async (req, res) => {
  try {
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      return res.status(500).json({ 
        error: 'Database connection error',
        message: 'Error de conexión con la base de datos'
      });
    }

    const { id } = req.params;
    const { nombre, description, location, direccion} = req.body;
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Usuario no autenticado'
      });
    }

    // Verify ownership
    const ownerCheck = await pool.query(
      'SELECT id FROM canchas WHERE id = $1',
      [id]
    );

    if (ownerCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Cancha no encontrada' });
    }

    if (ownerCheck.rows[0].id !== user_id) {
      return res.status(403).json({ message: 'No autorizado para actualizar esta cancha' });
    }

    const result = await pool.query(
      `UPDATE canchas
       SET nombre = $1,
           description = $2,
           location = $3,
           direccion = $4,
       WHERE id = $5
       RETURNING *`,
      [nombre, description, location, direccion,  id]
    );

    return res.status(200).json({
      data: result.rows[0],
      message: 'Cancha actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error en updateCancha:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      query: error.query,
      parameters: error.parameters
    });
    return res.status(500).json({ 
      error: error.message,
      message: 'Error al actualizar la cancha'
    });
  }
};

// Eliminar una cancha
const deleteCancha = async (req, res) => {
  try {
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      return res.status(500).json({ 
        error: 'Database connection error',
        message: 'Error de conexión con la base de datos'
      });
    }

    const { id } = req.params;
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Usuario no autenticado'
      });
    }

    // Verify ownership
    const ownerCheck = await pool.query(
      'SELECT id FROM canchas WHERE id = $1',
      [id]
    );

    if (ownerCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Cancha no encontrada' });
    }

    if (ownerCheck.rows[0].id !== user_id) {
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
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      query: error.query,
      parameters: error.parameters
    });
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
