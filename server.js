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
    const { source, destination, date, includeBusDetails } = req.query;

    let query = `
        SELECT r.RouteID, r.Source, r.Destination, r.ScheduleDate`;

    let queryParams = [source, destination, date];

    if (includeBusDetails === 'true') {
        query += `,
            a.BusNumber, 
            c.ConductorID, c.ConductorName, 
            d.DriverID, d.DriverName`;
    }

    query += `
        FROM Route r
        LEFT JOIN AssignedTo a ON r.RouteID = a.RouteID
        LEFT JOIN Bus b ON a.BusNumber = b.BusNumber
        LEFT JOIN Conductor c ON b.ConductorID = c.ConductorID
        LEFT JOIN Driver d ON b.DriverID = d.DriverID
        WHERE r.Source = $1 AND r.Destination = $2 AND r.ScheduleDate = $3`;

    try {
        const result = await pool.query(query, queryParams);
        
        // Debugging: Log the raw result to inspect how the data is returned
        console.log('Raw result:', result.rows);

        // Optional: Process the result to handle undefined or null values
        const formattedResults = result.rows.map(row => {
            return {
                ...row,
                BusNumber: row.BusNumber || 'No Bus Assigned',  // Check if BusNumber exists
                ConductorName: row.ConductorName || 'No Conductor Assigned',  // Default if null
                DriverName: row.DriverName || 'No Driver Assigned'  // Default if null
            };
        });

        res.json(formattedResults);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});


// Endpoint to book a ticket
app.post('/book', async (req, res) => {
    const { routeId, passengerName, contact, seatNumber, busNumber } = req.body;
    try {
        const passengerResult = await pool.query(
            'INSERT INTO Passenger (PassengerName, Contact) VALUES ($1, $2) RETURNING PassengerID',
            [passengerName, contact]
        );
        const passengerId = passengerResult.rows[0].passengerid;

        const ticketResult = await pool.query(
            'INSERT INTO Ticket (RouteID, PassengerID, SeatNumber, BusNumber) VALUES ($1, $2, $3, $4) RETURNING TicketID',
            [routeId, passengerId, seatNumber, busNumber]
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

// Endpoint to fetch route details with halts
app.get('/route-details/:id', async (req, res) => {
    const routeId = req.params.id;

    try {
        // Query to fetch route details
        const routeDetailsResult = await pool.query(
            `SELECT r.RouteID, r.Source, r.Destination, r.ScheduleDate, c.ConductorName, d.DriverName, b.BusNumber
             FROM Route r
             LEFT JOIN AssignedTo a ON r.RouteID = a.RouteID
             LEFT JOIN Bus b ON a.BusNumber = b.BusNumber
             LEFT JOIN Conductor c ON b.ConductorID = c.ConductorID
             LEFT JOIN Driver d ON b.DriverID = d.DriverID
             WHERE r.RouteID = $1`,
            [routeId]
        );

        // Query to fetch halts for the route
        const haltsResult = await pool.query(
            `SELECT haltid FROM halt WHERE RouteID = $1`,
            [routeId]
        );
        

        // Respond with route details and halts
        res.json({
            // success: true,
            routeDetails: routeDetailsResult.rows
            // halts: haltsResult.rows,
        });
    } catch (error) {
        // Log the error and respond with a database error message
        console.error('Database error:', error);
        res.json({ success: false, error: 'Database error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
