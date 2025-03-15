const express = require("express");
const router = express.Router();
const userController = require("../Controlador/userController");


// POST /api/v1/users/  => Crear usuario
router.post("/", userController.registerUser);

// POST /api/v1/users/login  => Iniciar sesión
router.post("/login", userController.loginUser);

module.exports = router;
