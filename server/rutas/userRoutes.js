const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  getUserProfile,
  getUserCanchas,
  getUserReviews
} = require('../Controlador/userController');
const auth = require('../middlewares/auth');

// Autenticación
router.post('/login', loginUser);               // POST /api/users/login

// Rutas protegidas (requieren autenticación)
router.get('/me', auth, getUserProfile);        // GET /api/users/me
router.get('/me/canchas', auth, getUserCanchas); // GET /api/users/me/canchas
router.get('/me/reviews', auth, getUserReviews); // GET /api/users/me/reviews

// CRUD Usuarios
router.get('/', getAllUsers);                   // GET /api/users
router.post('/', createUser);                   // POST /api/users
router.get('/:user_id', getUserById);           // GET /api/users/:user_id
router.put('/:user_id', updateUser);            // PUT /api/users/:user_id
router.delete('/:user_id', deleteUser);         // DELETE /api/users/:user_id

module.exports = router;
