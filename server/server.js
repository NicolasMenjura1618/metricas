require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Obtener todas las canchas
app.get("/api/v1/Canchas", async (req, res) => {
    try {
        const resultado = await db.query("SELECT * FROM canchas");
        res.status(200).json({
            status: "success",
            resultado: resultado.rows.length,
            data: {
                Canchas: resultado.rows,
            },
        });
    } catch (err) {
        console.error("Error en la base de datos:", err);
        res.status(500).json({ status: "error", message: "Error interno del servidor" });
    }
});

// Obtener una cancha por ID
app.get("/api/v1/Canchas/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const canchas = await db.query("SELECT * FROM canchas WHERE id = $1", [id]);

        const reviews = await db.query("SELECT * FROM reviews WHERE id = $1", [id]);
        if (canchas.rows.length === 0) { // Corrected variable
            return res.status(404).json({ status: "error", message: "Cancha no encontrada" });
        }

        res.status(200).json({
            status: "success",
            data: {
                Cancha: canchas.rows[0],
                Reviews: reviews.rows,
            },
        });
    } catch (err) {
        console.error("Error en la base de datos:", err);
        res.status(500).json({ status: "error", message: "Error interno del servidor" });
    }
});

// reviews por ID
app.post("/api/v1/Canchas/:id/AddReview", async (req, res) => {
    try {
        const { id } = req.params;
        const reviews = await db.query("SELECT * FROM reviews WHERE id = $1", [id]);
        if (canchas.rows.length === 0) { // Corrected variable
            return res.status(404).json({ status: "error", message: "Cancha no encontrada" });
        }

        res.status(200).json({
            status: "success",
            data: {
                Cancha: canchas.rows[0],
                Reviews: reviews.rows,
            },
        });
    } catch (err) {
        console.error("Error en la base de datos:", err);
        res.status(500).json({ status: "error", message: "Error interno del servidor" });
    }
});

// Crear una cancha
app.post("/api/v1/Canchas", async (req, res) => {
    const { nombre, descripcion, locacion, direccion } = req.body;

    // Validación de campos requeridos
    if (!nombre || !descripcion || !locacion || !direccion) {
        return res.status(400).json({ status: "error", message: "Todos los campos son requeridos" });
    }

    try {
        const resultado = await db.query(
            "INSERT INTO canchas (nombre, descripcion, locacion, direccion) VALUES ($1, $2, $3, $4) RETURNING *",
            [nombre, descripcion, locacion, direccion]
        );

        // Notify that a cancha has been added
        console.log("Notification: A new cancha has been added:", resultado.rows[0]);
        
        res.status(201).json({
            status: "success",
            data: {
                Cancha: resultado.rows[0],
            },
        });
    } catch (err) {
        console.error("Error en la base de datos:", err);
        res.status(500).json({ status: "error", message: "Error interno del servidor" });
    }
});

// Actualizar una cancha (PUT)
app.put("/api/v1/Canchas/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, locacion, direccion } = req.body;

    if (!nombre || !descripcion || !locacion || !direccion) {
        return res.status(400).json({ status: "error", message: "Todos los campos son requeridos" });
    }

    try {
        const resultado = await db.query(
            "UPDATE canchas SET nombre = $1, descripcion = $2, locacion = $3, direccion = $4 WHERE id = $5 RETURNING *",
            [nombre, descripcion, locacion, direccion, id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({ status: "error", message: "Cancha no encontrada" });
        }

        res.status(200).json({
            status: "success",
            data: {
                Cancha: resultado.rows[0],
            },
        });
    } catch (err) {
        console.error("Error en la base de datos:", err);
        res.status(500).json({ status: "error", message: "Error interno del servidor" });
    }
});

// Eliminar una cancha
app.delete("/api/v1/Canchas/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await db.query("DELETE FROM canchas WHERE id = $1", [id]);

        // Notify that a cancha has been deleted
        console.log("Notification: A cancha has been deleted with ID:", id);
        
        res.status(204).send();

    } catch (err) {
        console.error("Error en la base de datos:", err);
        res.status(500).json({ status: "error", message: "Error interno del servidor" });
    }
});

// Iniciar servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor funcionando en el puerto ${port}`);
});
