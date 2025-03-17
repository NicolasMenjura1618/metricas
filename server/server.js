const express = require('express');
const cors = require('cors');
const routes = require('./rutas');
const db = require('./db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection before starting server
const startServer = async () => {
  try {
    // Test database connection
    const isConnected = await db.testConnection();
    if (!isConnected) {
      console.error('Failed to connect to database. Server will not start.');
      process.exit(1);
    }
    console.log('Database connection successful');

    // Mount all routes under /api
    app.use('/api', routes);

    // Ruta de prueba
    app.get('/', (req, res) => {
      res.send('API de métricas de calidad funcionando');
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error('Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        query: req.query,
        body: req.body
      });

      res.status(500).json({
        message: 'Ha ocurrido un error en el servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      process.exit(1);
    });

    // Inicializar servidor
    const PORT = 3001;  // Changed to match frontend configuration
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });

  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
