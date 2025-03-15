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

    console.log("API Response:", canchasRating.rows); // Log the response from the database
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

// Other functions remain unchanged...
