const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Extraer el header Authorization (se espera el formato "Bearer <token>")
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json({ status: "error", message: "Token no proporcionado" });
  }

  // Extraer el token del header
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ status: "error", message: "Token inválido" });
  }

  try {
    // Verificar y decodificar el token usando la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Agregar la información decodificada a req para usarla en rutas protegidas
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ status: "error", message: "Token inválido o expirado" });
  }
};
