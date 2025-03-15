const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  const { user_name, user_email, user_password } = req.body;

  // Validar campos requeridos
  if (!user_name || !user_email || !user_password) {
    return res
      .status(400)
      .json({ status: "error", message: "Todos los campos son requeridos" });
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = await db.query(
      "SELECT * FROM users WHERE user_email = $1",
      [user_email]
    );
    if (existingUser.rows.length > 0) {
      return res
        .status(409)
        .json({ status: "error", message: "El usuario ya existe" });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(user_password, 10);

    // Insertar usuario en la base de datos
    const result = await db.query(
      "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
      [user_name, user_email, hashedPassword]
    );

    // Generar token
    const token = jwt.sign(
      { id: result.rows[0].user_id, email: user_email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    console.log("Nuevo Usuario Ingresado:", result.rows[0]);

    return res.status(201).json({
      status: "success",
      data: {
        user: result.rows[0],
        token,
      },
    });
  } catch (err) {
    console.error("Error en la base de datos al crear usuario:", err);
    return res
      .status(500)
      .json({ status: "error", message: "Error interno del servidor" });
  }
};

exports.loginUser = async (req, res) => {
  const { user_email, user_password } = req.body;

  // Validar campos requeridos
  if (!user_email || !user_password) {
    return res
      .status(400)
      .json({ status: "error", message: "Todos los campos son requeridos" });
  }

  try {
    // Verificar si el usuario existe
    const user = await db.query(
      "SELECT * FROM users WHERE user_email = $1",
      [user_email]
    );

    if (user.rows.length === 0) {
      return res
        .status(401)
        .json({ status: "error", message: "Credenciales inválidas" });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(
      user_password,
      user.rows[0].user_password
    );
    if (!isValidPassword) {
      return res
        .status(401)
        .json({ status: "error", message: "Credenciales inválidas" });
    }

    // Generar token
    const token = jwt.sign(
      { id: user.rows[0].user_id, email: user_email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      status: "success",
      data: {
        user: user.rows[0],
        token,
      },
    });
  } catch (err) {
    console.error("Error en la base de datos al iniciar sesión:", err);
    return res
      .status(500)
      .json({ status: "error", message: "Error interno del servidor" });
  }
};
