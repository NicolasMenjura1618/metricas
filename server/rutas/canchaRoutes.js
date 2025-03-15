const express = require("express");
const router = express.Router();
const canchaController = require("../Controlador/canchaController");
const authMiddleware = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/admin");

// Log the canchaController object to inspect its contents
console.log("canchaController:", canchaController);

// Rutas accesibles para todos
router.get("/", canchaController.getAllCanchas);
router.get("/:id", canchaController.getCanchaById);

// Test route
router.get("/test", (req, res) => {
  res.status(200).json({ message: "Test route works!" });
});

// Rutas protegidas: solo admin
router.post("/", canchaController.createCancha); // Temporarily removed middlewares

router.put("/:id", authMiddleware, adminMiddleware, canchaController.updateCancha);
router.delete("/:id", authMiddleware, adminMiddleware, canchaController.deleteCancha);

router.post("/:id/AddReview", authMiddleware, canchaController.addReview);

module.exports = router;
