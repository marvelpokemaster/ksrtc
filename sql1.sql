-- Connect to the default database (postgres) and drop the existing database if necessary
DROP DATABASE IF EXISTS ksrtc_db;
-- Create the new ksrtc_db database
CREATE DATABASE ksrtc_db;

-- Connect to the newly created ksrtc_db
\c ksrtc_db;

-- Create tables
CREATE TABLE BusStand (
    StandID SERIAL PRIMARY KEY,
    StandLocation VARCHAR(50)
);

CREATE TABLE Driver (
    DriverID SERIAL PRIMARY KEY,
    DriverName VARCHAR(50)
);

CREATE TABLE Conductor (
    ConductorID SERIAL PRIMARY KEY,
    ConductorName VARCHAR(50)
);

CREATE TABLE Assistant (
    AssistantID SERIAL PRIMARY KEY,
    AssistantName VARCHAR(50)
);

CREATE TABLE Route (
    RouteID SERIAL PRIMARY KEY,
    Source VARCHAR(50),
    Destination VARCHAR(50),
    ScheduleDate DATE
);

CREATE TABLE Bus (
    BusNumber SERIAL PRIMARY KEY,
    BusType VARCHAR(50),
    Seats INT,
    DriverID INT,
    ConductorID INT,
    AssistantID INT,
    FOREIGN KEY (DriverID) REFERENCES Driver(DriverID),
    FOREIGN KEY (ConductorID) REFERENCES Conductor(ConductorID),
    FOREIGN KEY (AssistantID) REFERENCES Assistant(AssistantID)
);

CREATE TABLE AssignedTo (
    BusNumber INT,
    RouteID INT,
    PRIMARY KEY (BusNumber, RouteID),
    FOREIGN KEY (BusNumber) REFERENCES Bus(BusNumber),
    FOREIGN KEY (RouteID) REFERENCES Route(RouteID)
);

CREATE TABLE Halt (
    HaltID SERIAL PRIMARY KEY,
    RouteID INT,
    SequenceNo INT,
    ArrivalTime TIME,
    DepartureTime TIME,
    StandID INT,
    FOREIGN KEY (RouteID) REFERENCES Route(RouteID),
    FOREIGN KEY (StandID) REFERENCES BusStand(StandID)
);

CREATE TABLE Passenger (
    PassengerID SERIAL PRIMARY KEY,
    PassengerName VARCHAR(50),
    Contact VARCHAR(15)
);

CREATE TABLE Fare (
    FareID SERIAL PRIMARY KEY,
    RouteID INT,
    FareAmount DECIMAL(10, 2),
    FOREIGN KEY (RouteID) REFERENCES Route(RouteID)
);

CREATE TABLE Ticket (
    TicketID SERIAL PRIMARY KEY,
    PassengerID INT,
    RouteID INT,
    SeatNumber INT,
    BusNumber INT
    FareID INT,
    FOREIGN KEY (PassengerID) REFERENCES Passenger(PassengerID),
    FOREIGN KEY (RouteID) REFERENCES Route(RouteID),
    FOREIGN KEY (FareID) REFERENCES Fare(FareID),
    FOREIGN KEY (BusNumber) REFERENCES Bus(BusNumber),
    UNIQUE (BusNumber,SeatNumber)
);

-- Insert sample data
INSERT INTO BusStand (StandLocation)
VALUES 
    ('Ernakulam Stand'),
    ('Thrissur Stand'),
    ('Kozhikode Stand');

INSERT INTO Driver (DriverName)
VALUES 
    ('Suresh Kumar'),
    ('Ramesh Nair');

INSERT INTO Conductor (ConductorName)
VALUES 
    ('Ajith Menon'),
    ('Praveen Thomas');

INSERT INTO Assistant (AssistantName)
VALUES 
    ('Biju Varghese'),
    ('Shaji Mathew');

INSERT INTO Route (Source, Destination, ScheduleDate)
VALUES 
    ('Kochi', 'Trivandrum', '2024-12-29'),
    ('Kottayam', 'Palakkad', '2024-12-30'),
    ('Kannur', 'Kasaragod', '2024-12-31'),
    ('Alappuzha', 'Ernakulam', '2025-01-01'),
    ('Thrissur', 'Malappuram', '2025-01-02'),
    ('Kochi', 'Bangalore', '2025-01-03'),
    ('Palakkad', 'Mysore', '2025-01-04');

INSERT INTO Bus (BusType, Seats, DriverID, ConductorID, AssistantID)
VALUES 
    ('Fast Passenger', 40, 1, 1, 1),
    ('Super Deluxe', 30, 2, 2, 2),
    ('Express', 50, 1, 2, 1),
    ('Super Fast', 45, 2, 1, 2),
    ('Luxury', 30, 1, 2, 1),
    ('Sleeper', 20, 2, 1, 2),
    ('Air Conditioned', 35, 1, 1, 2);

INSERT INTO AssignedTo (BusNumber, RouteID)
VALUES 
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4),
    (5, 5),
    (6, 6),
    (7, 7);

INSERT INTO Halt (RouteID, SequenceNo, ArrivalTime, DepartureTime, StandID)
VALUES 
    (1, 1, '08:00:00', '08:15:00', 1),
    (1, 2, '09:00:00', '09:15:00', 2),
    (2, 1, '10:00:00', '10:15:00', 2),
    (2, 2, '11:00:00', '11:15:00', 3),
    (3, 1, '07:00:00', '07:15:00', 1),
    (3, 2, '08:30:00', '08:45:00', 2),
    (4, 1, '09:00:00', '09:15:00', 3),
    (4, 2, '10:30:00', '10:45:00', 1),
    (5, 1, '06:00:00', '06:15:00', 2),
    (5, 2, '07:45:00', '08:00:00', 3),
    (6, 1, '05:00:00', '05:15:00', 1),
    (6, 2, '07:30:00', '07:45:00', 3),
    (7, 1, '03:00:00', '03:15:00', 2),
    (7, 2, '05:30:00', '05:45:00', 1);

INSERT INTO Passenger (PassengerName, Contact)
VALUES 
    ('Anjali Pillai', '9876543210'),
    ('Rajesh Menon', '8765432109'),
    ('Deepa Nair', '9988776655'),
    ('Arjun Das', '8877665544'),
    ('Meera Krishnan', '7766554433'),
    ('Adarsh Binu', '9876567893');

-- Insert Fare data corresponding to routes
INSERT INTO Fare (RouteID, FareAmount)
VALUES 
    (1, 150.00),
    (2, 200.00),
    (3, 250.00),
    (4, 180.00),
    (5, 160.00),
    (6, 500.00),
    (7, 450.00);

-- Insert into Ticket (ensure matching PassengerID, RouteID, SeatNumber, and FareID)
-- This ensures that tickets are linked correctly with passengers and fares.
-- For example, for Route 1, the FareID is 1, for Route 2 it's 2, and so on.

-- Ticket for Anjali Pillai (Route 1, Seat 5, FareID 1)
INSERT INTO Ticket (PassengerID, RouteID, SeatNumber, FareID)
SELECT 1, 1, 5, f.FareID FROM Fare f WHERE f.RouteID = 1;

-- Ticket for Rajesh Menon (Route 2, Seat 10, FareID 2)
INSERT INTO Ticket (PassengerID, RouteID, SeatNumber, FareID)
SELECT 2, 2, 10, f.FareID FROM Fare f WHERE f.RouteID = 2;

-- Ticket for Deepa Nair (Route 3, Seat 3, FareID 3)
INSERT INTO Ticket (PassengerID, RouteID, SeatNumber, FareID)
SELECT 3, 3, 3, f.FareID FROM Fare f WHERE f.RouteID = 3;

-- Ticket for Arjun Das (Route 4, Seat 4, FareID 4)
INSERT INTO Ticket (PassengerID, RouteID, SeatNumber, FareID)
SELECT 4, 4, 4, f.FareID FROM Fare f WHERE f.RouteID = 4;

-- Ticket for Meera Krishnan (Route 5, Seat 5, FareID 5)
INSERT INTO Ticket (PassengerID, RouteID, SeatNumber, FareID)
SELECT 5, 5, 5, f.FareID FROM Fare f WHERE f.RouteID = 5;
