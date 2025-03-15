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
        
        const canchasRating = await db.query("SELECT * from canchas left join (select cancha_id, COUNT (*),TRUNC(AVG(rating),1) as Average_rating from reviews group by cancha_id) reviews on canchas.id = reviews.cancha_id;");
        res.status(200).json({
            status: "success",
            resultado: canchasRating.rows.length,
            data: {
                Canchas: canchasRating.rows,
            },
        });
    } catch (err) {
        console.error("Error en la base de datos al obtener canchas:", err);
        res.status(500).json({ status: "error", message: "Error interno del servidor" });
    }
});

// Obtener una cancha por ID
app.get("/api/v1/Canchas/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const canchas = await db.query("SELECT * from canchas left join (select cancha_id, COUNT (*),TRUNC(AVG(rating),1) as Average_rating from reviews group by cancha_id) reviews on canchas.id = reviews.cancha_id WHERE id = $1;", [id]);

        const reviews = await db.query("SELECT * FROM reviews WHERE cancha_id = $1", [id]);
        
        if (canchas.rows.length === 0) {
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
        console.error("Error en la base de datos al obtener cancha:", err);
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

        console.log("Notification: A new cancha has been added:", resultado.rows[0]);
        
        res.status(201).json({
            status: "success",
            data: {
                Cancha: resultado.rows[0],
            },
        });
    } catch (err) {
        console.error("Error en la base de datos al crear cancha:", err);
        res.status(500).json({ status: "error", message: "Error interno del servidor" });
    }
});
// Obtener todas las reseñas de la cancha por ID
app.get("/api/v1/Canchas/reviews/:id", async (req, res) => {
    try {
        const resultado = await db.query("SELECT * FROM reviews where cancha_id = $1", [req.params.id]);
        res.status(200).json({
            status: "success",
            resultado: resultado.rows.length,
            data: {
                reviews: resultado.rows,
            },
        });
    } catch (err) {
        console.error("Error en la base de datos al obtener reviews:", err);
        
    }
});
// crear review
app.post("/api/v1/Canchas/:id/AddReview", async (req, res) => {
    const { cancha_id, name, review, rating } = req.body;

    // Validación de campos requeridos
    if (!cancha_id || !name || !review || !rating) {
        return res.status(400).json({ status: "error", message: "Todos los campos son requeridos" });
    }

    try {
        const resultado = await db.query(
            "INSERT INTO reviews (cancha_id, name, review, rating) VALUES ($1, $2, $3, $4) RETURNING *",
            [cancha_id, name, review, rating]
        );

        console.log("Notification: A new review has been added:", resultado.rows[0]);
        
        res.status(201).json({
            status: "success",
            data: {
                Review: resultado.rows[0],
            },
        });
    } catch (err) {
        console.error("Error en la base de datos al crear review:", err); // Detailed error logging
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
        console.error("Error en la base de datos al actualizar cancha:", err);
        res.status(500).json({ status: "error", message: "Error interno del servidor" });
    }
});

// Eliminar una cancha

app.delete("/api/v1/Canchas/:id", async (req, res) => {
    const { id } = req.params;
    try {
        // First delete associated reviews
        await db.query("DELETE FROM reviews WHERE cancha_id = $1", [id]);
        // Then delete the cancha
        await db.query("DELETE FROM canchas WHERE id = $1", [id]);
        res.status(204).send();
    } catch (err) {
        console.error("Error en la base de datos al eliminar cancha:", err);
        res.status(500).json({ status: "error", message: "Error interno del servidor" });
    }
});

// Eliminar una reseña
app.delete("/api/v1/Canchas/reviews/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM reviews WHERE id = $1", [id]);
        res.status(204).send();
    } catch (err) {
        console.error("Error en la base de datos al eliminar reseña:", err);
        res.status(500).json({ status: "error", message: "Error interno del servidor" });
    }
});

// Iniciar servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor funcionando en el puerto ${port}`);
});
