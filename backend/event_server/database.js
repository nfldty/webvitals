const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
// pooling is likely sufficient for handling multiple requests per second per client for now; may need to optimize/scale later

pool.connect()
.then(client => {
  console.log('Connected to PostgreSQL');
  client.release();
})
.catch(err => console.error('Connection error', err.stack));

module.exports = pool;
