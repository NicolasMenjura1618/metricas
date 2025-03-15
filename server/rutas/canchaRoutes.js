const express = require("express");
const router = express.Router();
const canchaController = require("../Controlador/canchaController");
const authMiddleware = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/admin");

// Rutas accesibles para todos
router.get("/", canchaController.getAllCanchas);
router.get("/:id", canchaController.getCanchaById);

// Rutas protegidas: solo admin
router.post("/", authMiddleware, adminMiddleware, canchaController.createCancha);
router.put("/:id", authMiddleware, adminMiddleware, canchaController.updateCancha);
router.delete("/:id", authMiddleware, adminMiddleware, canchaController.deleteCancha);

module.exports = router;
