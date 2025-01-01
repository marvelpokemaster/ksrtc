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

        console.log({ sources, destinations });

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
            `SELECT r.*, f.FareID, f.FareAmount 
            FROM Route r
            LEFT JOIN Fare f ON r.RouteID = f.RouteID
            WHERE r.Source = $1 AND r.Destination = $2 AND r.ScheduleDate = $3`,
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
    const { routeId, passengerName, contact, seatNumber, fareId } = req.body;
    try {
        // Insert passenger
        const passengerResult = await pool.query(
            'INSERT INTO Passenger (PassengerName, Contact) VALUES ($1, $2) RETURNING PassengerID',
            [passengerName, contact]
        );
        const passengerId = passengerResult.rows[0].passengerid;

        // Insert ticket
        const ticketResult = await pool.query(
            'INSERT INTO Ticket (RouteID, PassengerID, SeatNumber, FareID) VALUES ($1, $2, $3, $4) RETURNING TicketID',
            [routeId, passengerId, seatNumber, fareId]
        );

        res.json({ success: true, message: 'Ticket booked successfully!', ticketId: ticketResult.rows[0].ticketid });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Endpoint to fetch all bookings
app.get('/bookings', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT t.TicketID, t.SeatNumber, p.PassengerName, p.Contact, r.Source, r.Destination, r.ScheduleDate, f.FareAmount
            FROM Ticket t
            JOIN Passenger p ON t.PassengerID = p.PassengerID
            JOIN Route r ON t.RouteID = r.RouteID
            JOIN Fare f ON t.FareID = f.FareID
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Endpoint to fetch route details
app.get('/route-details/:id', async (req, res) => {
    const routeId = req.params.id;
    try {
        // Query to fetch route details (with updated join query)
        const result = await pool.query(
            `SELECT r.RouteID, r.Source, r.Destination, r.ScheduleDate, c.ConductorName, d.DriverName, b.BusNumber
            FROM Route r
            LEFT JOIN AssignedTo a ON r.RouteID = a.RouteID
            LEFT JOIN Bus b ON a.BusNumber = b.BusNumber
            LEFT JOIN Conductor c ON b.ConductorID = c.ConductorID
            LEFT JOIN Driver d ON b.DriverID = d.DriverID
            WHERE r.RouteID = $1`,
            [routeId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Route details not found" });
        }

        res.json({ success: true, details: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
