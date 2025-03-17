const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Funciones de validación
const validateUsername = (username) => {
  if (!username) return 'El nombre de usuario es requerido';
  if (username.length < 4) return 'El nombre de usuario debe tener al menos 4 caracteres';
  if (username.length > 20) return 'El nombre de usuario no puede tener más de 20 caracteres';
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'El nombre de usuario solo puede contener letras, números y guiones bajos';
  }
  return null;
};

const validateEmail = (email) => {
  if (!email) return 'El email es requerido';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Por favor ingrese un email válido';
  return null;
};

const validatePassword = (password) => {
  if (!password) return 'La contraseña es requerida';
  return null;
};

// Create user
const createUser = async (req, res) => {
  const { user_name, user_email, user_password } = req.body;

  try {
    // Validaciones
    const usernameError = validateUsername(user_name);
    if (usernameError) return res.status(400).json({ message: usernameError });

    const emailError = validateEmail(user_email);
    if (emailError) return res.status(400).json({ message: emailError });

    const passwordError = validatePassword(user_password);
    if (passwordError) return res.status(400).json({ message: passwordError });

    // Verificar si el usuario ya existe
    const userExists = await db.query(
      'SELECT * FROM users WHERE user_name = $1 OR user_email = $2', 
      [user_name, user_email]
    );

    if (userExists.rows.length > 0) {
      const existingUser = userExists.rows[0];
      if (existingUser.user_name === user_name) {
        return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
      }
      if (existingUser.user_email === user_email) {
        return res.status(400).json({ message: 'El email ya está registrado' });
      }
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(user_password, 10);


    const result = await db.query(
      'INSERT INTO users (user_name, user_password, user_email) VALUES ($1, $2, $3) RETURNING user_id, user_name, user_email',
      [user_name, hashedPassword, user_email]
    );

    return res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return res.status(500).json({ message: 'Error al crear el usuario' });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Test database connection first
    const isConnected = await db.testConnection();
    if (!isConnected) {
      console.error('Database connection failed during login attempt');
      return res.status(500).json({ 
        message: 'Error de conexión con la base de datos',
        error: 'DATABASE_CONNECTION_ERROR'
      });
    }

    // Validaciones básicas
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Correo electrónico y contraseña son requeridos',
        error: 'VALIDATION_ERROR'
      });
    }

    // Buscar usuario
    const result = await db.query('SELECT * FROM users WHERE user_email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ 
        message: 'Correo electrónico o contraseña incorrectos',
        error: 'INVALID_CREDENTIALS'
      });
    }

    // Verificar que existe contraseña
    if (!user.user_password) {
      console.error('Usuario encontrado sin contraseña:', email);
      return res.status(401).json({ 
        message: 'Error en la autenticación',
        error: 'INVALID_USER_DATA'
      });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.user_password);
    if (!validPassword) {
      return res.status(401).json({ 
        message: 'Correo electrónico o contraseña incorrectos',
        error: 'INVALID_CREDENTIALS'
      });
    }

    // Verificar JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET no está configurado');
      return res.status(500).json({ 
        message: 'Error en la configuración del servidor',
        error: 'SERVER_CONFIG_ERROR'
      });
    }

    // Generar JWT token
    const token = jwt.sign(
      { 
        id: user.user_id, 
        username: user.user_name,
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    return res.status(200).json({ 
      token,
      user: {
        id: user.user_id,
        username: user.user_name,
        email: user.user_email
      }
    });
  } catch (error) {
    console.error('Error detallado en login:', {
      error: error.message,
      stack: error.stack,
      email: email // Log email for debugging
    });

    // Determinar tipo de error
    if (error.code === '28P01') {
      return res.status(500).json({ 
        message: 'Error de autenticación con la base de datos',
        error: 'DB_AUTH_ERROR'
      });
    }

    return res.status(500).json({ 
      message: 'Error al iniciar sesión',
      error: 'SERVER_ERROR'
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      'SELECT user_id, user_name, user_email FROM users WHERE user_id = $1', 
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return res.status(500).json({ message: 'Error al obtener el usuario' });
  }
};

// Update user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { user_name, user_password, user_email } = req.body;

  try {
    // Validaciones si se proporcionan los campos
    if (user_name) {
      const usernameError = validateUsername(user_name);
      if (usernameError) return res.status(400).json({ message: usernameError });
    }

    if (user_email) {
      const emailError = validateEmail(user_email);
      if (emailError) return res.status(400).json({ message: emailError });
    }

    if (user_password) {
      const passwordError = validatePassword(user_password);
      if (passwordError) return res.status(400).json({ message: passwordError });
    }

    let hashedPassword = user_password;
    if (user_password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(user_password, salt);
    }

    const result = await db.query(
      'UPDATE users SET user_name = $1, user_password = $2, user_email = $3 WHERE user_id = $4 RETURNING user_id, user_name, user_email',
      [user_name, hashedPassword, user_email, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM users WHERE user_id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    return res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const result = await db.query('SELECT user_id, user_name, user_email FROM users');
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT user_id, user_name, user_email FROM users WHERE user_id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    return res.status(500).json({ message: 'Error al obtener el perfil' });
  }
};

// Get user's canchas
const getUserCanchas = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT c.*, 
        COALESCE(AVG(r.rating), 0) as rating,
        COUNT(r.review_id) as num_reviews
      FROM canchas c
      LEFT JOIN reviews r ON c.id = r.cancha_id
      WHERE c.user_id = $1
      GROUP BY c.id`,
      [req.user.id]
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener canchas del usuario:', error);
    return res.status(500).json({ message: 'Error al obtener las canchas' });
  }
};

// Get user's reviews
const getUserReviews = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT r.*, c.nombre as cancha_nombre
      FROM reviews r
      JOIN canchas c ON r.cancha_id = c.id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC`,
      [req.user.id]
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener reseñas del usuario:', error);
    return res.status(500).json({ message: 'Error al obtener las reseñas' });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  getUserProfile,
  getUserCanchas,
  getUserReviews,
};
