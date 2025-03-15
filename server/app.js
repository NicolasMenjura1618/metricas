const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Importar rutas
const userRoutes = require("./rutas/userRoutes");

const canchaRoutes = require("./rutas/canchaRoutes");

const reviewRoutes = require("./rutas/reviewRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/canchas", canchaRoutes);
app.use("/api/v1/reviews", reviewRoutes);

module.exports = app;
