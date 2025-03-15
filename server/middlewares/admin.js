module.exports = (req, res, next) => {
    // Se espera que req.user ya esté definido por el middleware de autenticación
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res
        .status(403)
        .json({ status: "error", message: "Acceso restringido: administrador requerido" });
    }
  };
  