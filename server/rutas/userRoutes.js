const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser
} = require('../Controlador/userController');


// CRUD Usuarios
router.get('/', getAllUsers);                   // GET /api/users
router.post('/', createUser);                   // POST /api/users
router.get('/:user_id', getUserById);           // GET /api/users/:user_id
router.put('/:user_id', updateUser);            // PUT /api/users/:user_id
router.delete('/:user_id', deleteUser);         // DELETE /api/users/:user_id

module.exports = router;
