const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// PostgreSQL Database Connection
const pool = new Pool({
  user: 'postgres',      // replace with your PostgreSQL username
  host: 'localhost',
  database: 'ksrtc_db',
  password: 'your_password',  // replace with your PostgreSQL password
  port: 5432,
});

// Route to fetch bus schedules
app.get('/api/schedules', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM schedules');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching schedules');
  }
});

// Serve static files
app.use(express.static('public'));

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
