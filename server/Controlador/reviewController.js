const db = require("../db");

// Obtener todas las reseñas de una cancha por ID
exports.getReviewsByCanchaId = async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await db.query(
      "SELECT * FROM reviews WHERE cancha_id = $1",
      [id]
    );

    return res.status(200).json({
      status: "success",
      resultado: resultado.rows.length,
      data: {
        reviews: resultado.rows,
      },
    });
  } catch (err) {
    console.error("Error en la base de datos al obtener reviews:", err);
    return res
      .status(500)
      .json({ status: "error", message: "Error interno del servidor" });
  }
};

// Crear review
exports.createReview = async (req, res) => {
  const { cancha_id, name, review, rating } = req.body;

  // Validación de campos requeridos
  if (!cancha_id || !name || !review || !rating) {
    return res
      .status(400)
      .json({ status: "error", message: "Todos los campos son requeridos" });
  }

  try {
    const resultado = await db.query(
      "INSERT INTO reviews (cancha_id, name, review, rating) VALUES ($1, $2, $3, $4) RETURNING *",
      [cancha_id, name, review, rating]
    );

    console.log("Notification: A new review has been added:", resultado.rows[0]);

    return res.status(201).json({
      status: "success",
      data: {
        Review: resultado.rows[0],
      },
    });
  } catch (err) {
    console.error("Error en la base de datos al crear review:", err);
    return res
      .status(500)
      .json({ status: "error", message: "Error interno del servidor" });
  }
};

// Eliminar una reseña
exports.deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM reviews WHERE id = $1", [id]);
    return res.status(204).send();
  } catch (err) {
    console.error("Error en la base de datos al eliminar reseña:", err);
    return res
      .status(500)
      .json({ status: "error", message: "Error interno del servidor" });
  }
};
