const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Registrar usuario (rol por defecto: "user")
exports.registerUser = async (req, res) => {
  const { user_name, user_email, user_password } = req.body;

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

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(user_password, 10);

    // Insertar usuario con rol "user"
    const result = await db.query(
      "INSERT INTO users (user_name, user_email, user_password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_name, user_email, hashedPassword, "user"]
    );

    // Generar token JWT
    const token = jwt.sign(
      { id: result.rows[0].user_id, email: user_email, role: result.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    console.log("Nuevo Usuario Registrado:", result.rows[0]);

    return res.status(201).json({
      status: "success",
      data: {
        user: result.rows[0],
        token,
      },
    });
  } catch (err) {
    console.error("Error al registrar usuario:", err);
    return res
      .status(500)
      .json({ status: "error", message: "Error interno del servidor" });
  }
};

// Login de usuario
exports.loginUser = async (req, res) => {
  const { user_email, user_password } = req.body;

  if (!user_email || !user_password) {
    return res
      .status(400)
      .json({ status: "error", message: "Todos los campos son requeridos" });
  }

  try {
    const user = await db.query(
      "SELECT * FROM users WHERE user_email = $1",
      [user_email]
    );

    if (user.rows.length === 0) {
      return res
        .status(401)
        .json({ status: "error", message: "Credenciales inválidas" });
    }

    const isValidPassword = await bcrypt.compare(
      user_password,
      user.rows[0].user_password
    );
    if (!isValidPassword) {
      return res
        .status(401)
        .json({ status: "error", message: "Credenciales inválidas" });
    }

    // Generar token incluyendo el rol del usuario
    const token = jwt.sign(
      { id: user.rows[0].user_id, email: user_email, role: user.rows[0].role },
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
    console.error("Error al iniciar sesión:", err);
    return res
      .status(500)
      .json({ status: "error", message: "Error interno del servidor" });
  }
};
