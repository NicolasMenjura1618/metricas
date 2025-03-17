// server/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// Test database connection
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Export pool with connection test function
module.exports = {
  query: (...args) => pool.query(...args),
  testConnection: async () => {
    try {
      const client = await pool.connect();
      console.log('Database connection successful');
      client.release();
      return true;
    } catch (err) {
      console.error('Database connection error:', err);
      return false;
    }
  }
};
