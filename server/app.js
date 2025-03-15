const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./rutas/userRoutes");

const canchaRoutes = require("./routes/canchaRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/canchas", canchaRoutes);
app.use("/api/v1/reviews", reviewRoutes);

module.exports = app;
