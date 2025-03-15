const express = require("express");
const router = express.Router();
const userController = require("../Controlador/userController");
const authMiddleware = require("../middlewares/auth");

// Rutas públicas
router.post("/", userController.registerUser);
router.post("/login", userController.loginUser);

// Ruta protegida: ejemplo de perfil
router.get("/perfil", authMiddleware, (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Acceso autorizado",
    user: req.user,
  });
});

module.exports = router;
