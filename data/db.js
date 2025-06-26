const { Pool } = require('pg');

// Centralised PostgreSQL connection pool used by data scripts.
const pool = new Pool({
  host: 'localhost',
  port: 5433,
  user: 'dvf',
  password: 'dvfpass',
  database: 'dvfdb',
});

module.exports = pool;
