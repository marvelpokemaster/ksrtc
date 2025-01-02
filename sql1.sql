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
    DriverName VARCHAR(50),
    Contact VARCHAR(15)
);

CREATE TABLE Conductor (
    ConductorID SERIAL PRIMARY KEY,
    ConductorName VARCHAR(50),
    Contact VARCHAR(15)
);

CREATE TABLE Assistant (
    AssistantID SERIAL PRIMARY KEY,
    AssistantName VARCHAR(50),
    Contact VARCHAR(15)
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
    FareID INT,
    FOREIGN KEY (PassengerID) REFERENCES Passenger(PassengerID),
    FOREIGN KEY (RouteID) REFERENCES Route(RouteID),
    FOREIGN KEY (FareID) REFERENCES Fare(FareID)
);

-- Insert sample data
INSERT INTO BusStand (StandLocation)
VALUES 
    ('Ernakulam Stand'),
    ('Thrissur Stand'),
    ('Kozhikode Stand');

INSERT INTO Driver (DriverName, Contact)
VALUES 
    ('Suresh Kumar', '9999988888'),
    ('Ramesh Nair', '8888877777'),
    ('Anil Kumar', '7777766666'),
    ('Prakash Pillai', '6666655555'),
    ('George Mathew', '5555544444');

INSERT INTO Conductor (ConductorName, Contact)
VALUES 
    ('Ajith Menon', '4444433333'),
    ('Praveen Thomas', '3333322222'),
    ('Manoj Kumar', '2222211111'),
    ('Hari Das', '1111100000'),
    ('Kiran John', '0000099999');

INSERT INTO Assistant (AssistantName, Contact)
VALUES 
    ('Biju Varghese', '9898989898'),
    ('Shaji Mathew', '9797979797'),
    ('Vijay Kumar', '9696969696'),
    ('Arun Joseph', '9595959595');

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
    ('Express', 50, 3, 3, 3),
    ('Super Fast', 45, 4, 4, 4),
    ('Luxury', 30, 5, 5, 1),
    ('Sleeper', 20, 1, 2, 2),
    ('Air Conditioned', 35, 2, 3, 3);

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

-- Insert tickets
INSERT INTO Ticket (PassengerID, RouteID, SeatNumber, FareID)
SELECT 1, 1, 5, f.FareID FROM Fare f WHERE f.RouteID = 1;

INSERT INTO Ticket (PassengerID, RouteID, SeatNumber, FareID)
SELECT 2, 2, 10, f.FareID FROM Fare f WHERE f.RouteID = 2;

INSERT INTO Ticket (PassengerID, RouteID, SeatNumber, FareID)
SELECT 3, 3, 3, f.FareID FROM Fare f WHERE f.RouteID = 3;

INSERT INTO Ticket (PassengerID, RouteID, SeatNumber, FareID)
SELECT 4, 4, 4, f.FareID FROM Fare f WHERE f.RouteID = 4;

INSERT INTO Ticket (PassengerID, RouteID, SeatNumber, FareID)
SELECT 5, 5, 5, f.FareID FROM Fare f WHERE f.RouteID = 5;