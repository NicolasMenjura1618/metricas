const db = require("../db");

// Obtener todas las canchas (accesible para todos)
exports.getAllCanchas = async (req, res) => {
  console.log("Fetching all courts..."); // Log the request for debugging

  try {
    const canchasRating = await db.query(`
      SELECT * 
      FROM canchas 
      LEFT JOIN (
        SELECT 
          cancha_id, 
          COUNT(*) AS count_reviews, 
          TRUNC(AVG(rating),1) AS average_rating 
        FROM reviews 
        GROUP BY cancha_id
      ) reviews 
      ON canchas.id = reviews.cancha_id;
    `);

    res.status(200).json({
      status: "success",
      resultado: canchasRating.rows.length,
      data: {
        Canchas: canchasRating.rows,
      },
    });
  } catch (err) {
    console.error("Error al obtener canchas:", err);
    res
      .status(500)
      .json({ status: "error", message: "Error interno del servidor" });
  }
};

// Obtener una cancha por ID (accesible para todos)
exports.getCanchaById = async (req, res) => {
  try {
    const { id } = req.params;

    const canchas = await db.query(
      `SELECT * 
       FROM canchas 
       LEFT JOIN (
         SELECT 
           cancha_id, 
           COUNT(*) AS count_reviews, 
           TRUNC(AVG(rating),1) AS average_rating 
         FROM reviews 
         GROUP BY cancha_id
       ) reviews 
       ON canchas.id = reviews.cancha_id 
       WHERE id = $1;`,
      [id]
    );

    if (canchas.rows.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Cancha no encontrada" });
    }

    // Obtener reviews asociados
    const reviews = await db.query(
      "SELECT * FROM reviews WHERE cancha_id = $1",
      [id]
    );

    res.status(200).json({
      status: "success",
      data: {
        Cancha: canchas.rows[0],
        Reviews: reviews.rows,
      },
    });
  } catch (err) {
    console.error("Error al obtener cancha:", err);
    res
      .status(500)
      .json({ status: "error", message: "Error interno del servidor" });
  }
};

exports.createCancha = async (req, res) => {
    console.log("Request body:", req.body); // Log the request body

    // Crear una cancha (solo admin)

  const { nombre, descripcion, locacion, direccion } = req.body;

  if (!nombre || !descripcion || !locacion || !direccion) {
    return res
      .status(400)
      .json({ status: "error", message: "Todos los campos son requeridos" });
  }

  try {
    const resultado = await db.query(
      "INSERT INTO canchas (nombre, descripcion, locacion, direccion) VALUES ($1, $2, $3, $4) RETURNING *",
      [nombre, descripcion, locacion, direccion]
    );

    console.log("Nueva cancha creada:", resultado.rows[0]);

    res.status(201).json({
      status: "success",
      data: {
        Cancha: resultado.rows[0],
      },
    });
  } catch (err) {
    console.error("Error al crear cancha:", err);
    res
      .status(500)
      .json({ status: "error", message: "Error interno del servidor" });
  }
};

// Implementing the updateCancha function
exports.updateCancha = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, locacion, direccion } = req.body;

    if (!nombre || !descripcion || !locacion || !direccion) {
        return res
            .status(400)
            .json({ status: "error", message: "Todos los campos son requeridos" });
    }

    try {
        const resultado = await db.query(
            "UPDATE canchas SET nombre = $1, descripcion = $2, locacion = $3, direccion = $4 WHERE id = $5 RETURNING *",
            [nombre, descripcion, locacion, direccion, id]
        );

        if (resultado.rows.length === 0) {
            return res
                .status(404)
                .json({ status: "error", message: "Cancha no encontrada" });
        }

        res.status(200).json({
            status: "success",
            data: {
                Cancha: resultado.rows[0],
            },
        });
    } catch (err) {
        console.error("Error al actualizar cancha:", err);
        res
            .status(500)
            .json({ status: "error", message: "Error interno del servidor" });
    }
};

// Eliminar una cancha (solo admin)
exports.deleteCancha = async (req, res) => {
  const { id } = req.params;

  try {
    // Primero eliminar las reviews asociadas
    await db.query("DELETE FROM reviews WHERE cancha_id = $1", [id]);

    // Luego eliminar la cancha
    await db.query("DELETE FROM canchas WHERE id = $1", [id]);

    return res.status(204).send();
  } catch (err) {
    console.error("Error al eliminar cancha:", err);
    res
      .status(500)
      .json({ status: "error", message: "Error interno del servidor" });
  }
};
module.exports = {
  getAllCanchas: exports.getAllCanchas,
  getCanchaById: exports.getCanchaById,
  createCancha: exports.createCancha,
  updateCancha: exports.updateCancha,
  deleteCancha: exports.deleteCancha
};
