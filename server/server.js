const express = require('express');
const cors = require('cors');
const routes = require('./rutas');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount all routes under /api
app.use('/api', routes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de métricas de calidad funcionando');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Ha ocurrido un error en el servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Inicializar servidor
const PORT = 3001;  // Fixed port to 3001
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
