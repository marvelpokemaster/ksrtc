\c ksrtc_db;

DROP TABLE IF EXISTS Ticket, Passenger, Halt, AssignedTo, Bus, Route, Assistant, Conductor, Driver, BusStand CASCADE;

CREATE TABLE BusStand (
    StandID INT PRIMARY KEY,
    StandLocation VARCHAR(50)
);

CREATE TABLE Driver (
    DriverID INT PRIMARY KEY,
    DriverName VARCHAR(50)
);

CREATE TABLE Conductor (
    ConductorID INT PRIMARY KEY,
    ConductorName VARCHAR(50)
);

CREATE TABLE Assistant (
    AssistantID INT PRIMARY KEY,
    AssistantName VARCHAR(50)
);

CREATE TABLE Route (
    RouteID INT PRIMARY KEY,
    Source VARCHAR(50),
    Destination VARCHAR(50),
    ScheduleDate DATE
);

CREATE TABLE Bus (
    BusNumber INT PRIMARY KEY,
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
    HaltID INT PRIMARY KEY,
    RouteID INT,
    SequenceNo INT,
    ArrivalTime TIME,
    DepartureTime TIME,
    StandID INT,
    FOREIGN KEY (RouteID) REFERENCES Route(RouteID),
    FOREIGN KEY (StandID) REFERENCES BusStand(StandID)
);

CREATE TABLE Passenger (
    PassengerID INT PRIMARY KEY,
    PassengerName VARCHAR(50),
    Contact VARCHAR(15)
);

CREATE TABLE Ticket (
    TicketID INT,
    PassengerID INT,
    RouteID INT,
    SeatNumber INT,
    Fare DECIMAL(10, 2),
    PRIMARY KEY (TicketID, PassengerID, RouteID),
    FOREIGN KEY (PassengerID) REFERENCES Passenger(PassengerID),
    FOREIGN KEY (RouteID) REFERENCES Route(RouteID)
);

-- Insert data
INSERT INTO BusStand (StandID, StandLocation)
VALUES (1, 'Ernakulam Stand'), (2, 'Thrissur Stand'), (3, 'Kozhikode Stand');

INSERT INTO Driver (DriverID, DriverName)
VALUES (1, 'Suresh Kumar'), (2, 'Ramesh Nair');

INSERT INTO Conductor (ConductorID, ConductorName)
VALUES (1, 'Ajith Menon'), (2, 'Praveen Thomas');

INSERT INTO Assistant (AssistantID, AssistantName)
VALUES (1, 'Biju Varghese'), (2, 'Shaji Mathew');

INSERT INTO Route (RouteID, Source, Destination, ScheduleDate)
VALUES (1, 'Kochi', 'Trivandrum', '2024-12-29'), (2, 'Kottayam', 'Palakkad', '2024-12-30');

INSERT INTO Bus (BusNumber, BusType, Seats, DriverID, ConductorID, AssistantID)
VALUES (101, 'Fast Passenger', 40, 1, 1, 1), (102, 'Super Deluxe', 30, 2, 2, 2);

INSERT INTO AssignedTo (BusNumber, RouteID)
VALUES (101, 1), (102, 2);

INSERT INTO Halt (HaltID, RouteID, SequenceNo, ArrivalTime, DepartureTime, StandID)
VALUES (1, 1, 1, '08:00:00', '08:15:00', 1), (2, 1, 2, '09:00:00', '09:15:00', 2),
       (3, 2, 1, '10:00:00', '10:15:00', 2), (4, 2, 2, '11:00:00', '11:15:00', 3);

INSERT INTO Passenger (PassengerID, PassengerName, Contact)
VALUES (1, 'Anjali Pillai', '9876543210'), (2, 'Rajesh Menon', '8765432109');

INSERT INTO Ticket (TicketID, PassengerID, RouteID, SeatNumber, Fare)
VALUES (1, 1, 1, 5, 150.00), (2, 2, 2, 10, 200.00);
