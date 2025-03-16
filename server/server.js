// server/app.js
const express = require('express');
const cors = require('cors');
const canchaRoutes = require('./rutas/canchaRoutes');
const userRoutes = require('./rutas/userRoutes');
const reviewRoutes = require('./rutas/reviewRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas principales
app.use('/api/canchas', canchaRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de métricas de calidad funcionando');
});

// Inicializar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
