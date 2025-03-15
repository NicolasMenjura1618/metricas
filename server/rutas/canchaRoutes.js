const express = require("express");
const router = express.Router();
const canchaController = require("../Controlador/canchaController");


// GET /api/v1/canchas/        => Obtener todas las canchas
router.get("/", canchaController.getAllCanchas);

// GET /api/v1/canchas/:id     => Obtener cancha por ID
router.get("/:id", canchaController.getCanchaById);

// POST /api/v1/canchas/       => Crear cancha
router.post("/", canchaController.createCancha);

// PUT /api/v1/canchas/:id     => Actualizar cancha
router.put("/:id", canchaController.updateCancha);

// DELETE /api/v1/canchas/:id  => Eliminar cancha
router.delete("/:id", canchaController.deleteCancha);

module.exports = router;
