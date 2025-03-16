// server/controladores/userController.js
const pool = require('../db');

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY user_name ASC');
    return res.status(200).json({ data: result.rows });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo usuario
const createUser = async (req, res) => {
  try {
    const { user_name, user_email, user_password } = req.body;

    // Aquí podrías encriptar la contraseña antes de guardarla
    const result = await pool.query(
      `INSERT INTO users (user_id, user_name, user_email, user_password)
       VALUES (gen_random_uuid(), $1, $2, $3)
       RETURNING *`,
      [user_name, user_email, user_password]
    );

    return res.status(201).json({ data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Obtener usuario por ID
const getUserById = async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.status(200).json({ data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Actualizar usuario
const updateUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { user_name, user_email, user_password } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET user_name = $1,
           user_email = $2,
           user_password = $3
       WHERE user_id = $4
       RETURNING *`,
      [user_name, user_email, user_password, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.status(200).json({ data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Eliminar usuario
const deleteUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await pool.query('DELETE FROM users WHERE user_id = $1 RETURNING *', [user_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.status(200).json({ data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};
