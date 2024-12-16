CREATE DATABASE ksrtc_db;
\c ksrtc_db
CREATE TABLE schedules (
  id SERIAL PRIMARY KEY,
  bus_number VARCHAR(10),
  route VARCHAR(100),
  departure_time TIME,
  arrival_time TIME
);
INSERT INTO schedules (bus_number, route, departure_time, arrival_time) 
VALUES 
('123', 'Trivandrum to Kochi', '08:00:00', '10:00:00'),
('124', 'Kochi to Calicut', '09:00:00', '12:00:00');
