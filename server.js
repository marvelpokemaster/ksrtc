const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// PostgreSQL pool setup
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ksrtc_db',
    password: 'password',
    port: 5432,
});

// Endpoint to fetch all available source and destination locations for dropdown
app.get('/locations', async (req, res) => {
    try {
        const result = await pool.query('SELECT DISTINCT Source FROM Route');
        const sources = result.rows.map(row => row.source);

        const destinationResult = await pool.query('SELECT DISTINCT Destination FROM Route');
        const destinations = destinationResult.rows.map(row => row.destination);

        res.json({ sources, destinations });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Endpoint to search routes based on source, destination, and date
app.get('/routes', async (req, res) => {
    const { source, destination, date } = req.query;
    try {
        const result = await pool.query(
            `SELECT * FROM Route WHERE Source = $1 AND Destination = $2 AND ScheduleDate = $3`,
            [source, destination, date]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Endpoint to book a ticket
app.post('/book', async (req, res) => {
    const { routeId, passengerName, contact, seatNumber, fare } = req.body;
    try {
        const passengerResult = await pool.query(
            'INSERT INTO Passenger (PassengerName, Contact) VALUES ($1, $2) RETURNING PassengerID',
            [passengerName, contact]
        );
        const passengerId = passengerResult.rows[0].passengerid;

        await pool.query(
            'INSERT INTO Ticket (TicketID, PassengerID, RouteID, SeatNumber, Fare) VALUES (DEFAULT, $1, $2, $3, $4)',
            [passengerId, routeId, seatNumber, fare]
        );
        res.json({ success: true, message: 'Ticket booked successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
