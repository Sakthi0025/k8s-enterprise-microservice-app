const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'postgres-service',
  database: process.env.DB_NAME || 'startupdb',
  password: process.env.DB_PASSWORD || 'secretpassword',
  port: 5432,
});

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running smoothly' });
});

// Database test endpoint
app.get('/api/users', async (req, res) => {
  try {
    // Attempting to query the DB
    const result = await pool.query('SELECT current_timestamp;');
    res.json({
      message: 'Successfully connected to PostgreSQL',
      timestamp: result.rows[0].current_timestamp,
      users: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ]
    });
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.listen(port, () => {
  console.log(`Backend service listening on port ${port}`);
});
