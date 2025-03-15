// server/app.js
const express = require('express');
const dotenv = require('dotenv');
const app = express();

// Carga variables de entorno
dotenv.config();

// Middlewares globales
app.use(express.json());

// Importa y usa rutas (ajusta la ruta según tus carpetas)
const rutasAPI = require('./rutas');  // Asegúrate de que el archivo index.js en 'rutas/' exporte las rutas correctamente
app.use('/api', rutasAPI);

// Si deseas servir el front-end (estático) desde el servidor:
app.use(express.static('./cliente/public'));


module.exports = app;
