const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json({ status: "error", message: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ status: "error", message: "Token inválido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request

    // Check if the user is trying to access their own data
    if (req.params.user_id && req.params.user_id !== decoded.id) {
      return res.status(403).json({ status: "error", message: "Acceso denegado" });
    }

    next(); // Allow access to the next middleware or route handler
  } catch (err) {
    return res
      .status(401)
      .json({ status: "error", message: "Token inválido o expirado" });
  }
};
