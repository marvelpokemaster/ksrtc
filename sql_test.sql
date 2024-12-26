\c ksrtc_db

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
