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
    FareID INT,
    FOREIGN KEY (PassengerID) REFERENCES Passenger(PassengerID),
    FOREIGN KEY (RouteID) REFERENCES Route(RouteID),
    FOREIGN KEY (FareID) REFERENCES Fare(FareID)
);

-- Insert sample data

INSERT INTO BusStand (StandLocation)
VALUES ('Ernakulam Stand'), ('Thrissur Stand'), ('Kozhikode Stand');

INSERT INTO Driver (DriverName)
VALUES ('Suresh Kumar'), ('Ramesh Nair');

INSERT INTO Conductor (ConductorName)
VALUES ('Ajith Menon'), ('Praveen Thomas');

INSERT INTO Assistant (AssistantName)
VALUES ('Biju Varghese'), ('Shaji Mathew');

INSERT INTO Route (Source, Destination, ScheduleDate)
VALUES ('Kochi', 'Trivandrum', '2024-12-29'), ('Kottayam', 'Palakkad', '2024-12-30');

INSERT INTO Bus (BusType, Seats, DriverID, ConductorID, AssistantID)
VALUES ('Fast Passenger', 40, 1, 1, 1), ('Super Deluxe', 30, 2, 2, 2);

INSERT INTO AssignedTo (BusNumber, RouteID)
VALUES (1, 1), (2, 2);

INSERT INTO Halt (RouteID, SequenceNo, ArrivalTime, DepartureTime, StandID)
VALUES (1, 1, '08:00:00', '08:15:00', 1),
       (1, 2, '09:00:00', '09:15:00', 2),
       (2, 1, '10:00:00', '10:15:00', 2),
       (2, 2, '11:00:00', '11:15:00', 3);

INSERT INTO Passenger (PassengerName, Contact)
VALUES ('Anjali Pillai', '9876543210'), ('Rajesh Menon', '8765432109');

INSERT INTO Fare (RouteID, FareAmount)
VALUES (1, 150.00), (2, 200.00);

INSERT INTO Ticket (PassengerID, RouteID, SeatNumber, FareID)
VALUES (1, 1, 5, 1), (2, 2, 10, 2);

-- The schema is now ready and populated with sample data.
