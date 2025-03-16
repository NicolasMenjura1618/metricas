// server/controladores/canchaController.js
const pool = require('../db');

// Obtener todas las canchas
const getAllCanchas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM canchas ORDER BY id ASC');
    return res.status(200).json({ data: result.rows });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Crear una nueva cancha
const createCancha = async (req, res) => {
  try {
    const { nombre, direccion, description, location } = req.body;

    // Ajusta campos según tu tabla 'canchas'
    const result = await pool.query(
      `INSERT INTO canchas (nombre, direccion, description, location, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *`,
      [nombre, direccion, description, location]
    );

    return res.status(201).json({ data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Obtener una cancha por ID
const getCanchaById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM canchas WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cancha no encontrada' });
    }

    return res.status(200).json({ data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Actualizar una cancha existente
const updateCancha = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, direccion, description, location } = req.body;

    // Ajusta para permitir actualizaciones parciales, si deseas
    const result = await pool.query(
      `UPDATE canchas
       SET nombre = $1,
           direccion = $2,
           description = $3,
           location = $4,
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [nombre, direccion, description, location, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cancha no encontrada' });
    }

    return res.status(200).json({ data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Eliminar una cancha
const deleteCancha = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM canchas WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cancha no encontrada' });
    }

    return res.status(200).json({ data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCanchas,
  createCancha,
  getCanchaById,
  updateCancha,
  deleteCancha,
};
