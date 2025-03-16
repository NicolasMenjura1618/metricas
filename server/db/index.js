// server/db.js
const { Pool } = require('pg');

// Ajusta estos datos a tu configuración local
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'rank',
  password: '1618',
  port: 5432,
});

module.exports = pool;