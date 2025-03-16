const pool = require('../db');
const jwt = require('jsonwebtoken');

// Existing functions...

// Login user
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE user_name = $1', [username]);
    const user = result.rows[0];

    if (!user || user.user_password !== password) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ token });
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
  loginUser, // Export the new login function
};
