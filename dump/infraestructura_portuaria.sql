-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: db
-- Tiempo de generación: 10-12-2025 a las 13:59:32
-- Versión del servidor: 8.0.39
-- Versión de PHP: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- ============================================================
--   BASE DE DATOS: Infraestructura Portuaria
--   Incluye entero, real, texto, booleano y fecha
-- ============================================================

CREATE DATABASE IF NOT EXISTS infraestructura_portuaria;
USE infraestructura_portuaria;

-- ============================================================
--   TABLA: puerto
-- ============================================================
CREATE TABLE puerto (
    id_puerto        INT AUTO_INCREMENT PRIMARY KEY,      -- entero
    nombre           VARCHAR(100) NOT NULL,               -- texto
    ciudad           VARCHAR(100) NOT NULL,               -- texto
    pais             VARCHAR(100) NOT NULL,               -- texto
    capacidad_teu    INT NOT NULL,                        -- entero
    activo           BOOLEAN NOT NULL DEFAULT TRUE,       -- booleano
    fecha_inauguracion DATE NOT NULL,                     -- fecha
    profundidad_media DECIMAL(5,2) NOT NULL               -- real
);

-- ============================================================
--   TABLA: muelle
-- ============================================================
CREATE TABLE muelle (
    id_muelle      INT AUTO_INCREMENT PRIMARY KEY,        -- entero
    id_puerto      INT NOT NULL,
    nombre         VARCHAR(100) NOT NULL,                 -- texto
    longitud_m     DECIMAL(10,2) NOT NULL,                -- real
    calado_m       DECIMAL(5,2) NOT NULL,                 -- real
    operativo      BOOLEAN NOT NULL DEFAULT TRUE,         -- booleano
    fecha_construccion DATE NOT NULL,                     -- fecha
    tipo           VARCHAR(50) NOT NULL,                  -- texto

    FOREIGN KEY (id_puerto) REFERENCES puerto(id_puerto)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

USE infraestructura_portuaria;

-- ============================================================
--   INSERTAR PUERTOS (30 registros)
-- ============================================================

INSERT INTO puerto (nombre, ciudad, pais, capacidad_teu, activo, fecha_inauguracion, profundidad_media)
VALUES
('Puerto de Algeciras', 'Algeciras', 'España', 5500000, TRUE, '1985-06-12', 17.5),
('Puerto de Valencia', 'Valencia', 'España', 5200000, TRUE, '1982-04-20', 16.2),
('Puerto de Barcelona', 'Barcelona', 'España', 3400000, TRUE, '1978-09-15', 15.8),
('Puerto de Bilbao', 'Bilbao', 'España', 1000000, TRUE, '1990-03-10', 14.3),
('Puerto de Las Palmas', 'Las Palmas', 'España', 1300000, FALSE, '1988-11-05', 15.0),
('Puerto de Rotterdam', 'Rotterdam', 'Países Bajos', 15000000, TRUE, '1965-07-01', 23.5),
('Puerto de Amberes', 'Amberes', 'Bélgica', 12000000, TRUE, '1970-05-22', 20.1),
('Puerto de Hamburgo', 'Hamburgo', 'Alemania', 9000000, TRUE, '1975-08-30', 18.4),
('Puerto de Marsella', 'Marsella', 'Francia', 1500000, TRUE, '1980-02-14', 14.9),
('Puerto de Génova', 'Génova', 'Italia', 2500000, TRUE, '1972-10-10', 15.6),
('Puerto de Lisboa', 'Lisboa', 'Portugal', 800000, FALSE, '1983-01-18', 13.2),
('Puerto de Sines', 'Sines', 'Portugal', 2000000, TRUE, '1986-12-01', 19.0),
('Puerto de Nueva York', 'Nueva York', 'EEUU', 7000000, FALSE, '1960-04-25', 17.8),
('Puerto de Los Ángeles', 'Los Ángeles', 'EEUU', 10000000, TRUE, '1955-09-12', 20.0),
('Puerto de Shanghái', 'Shanghái', 'China', 43000000, TRUE, '1995-03-03', 22.5),
('Puerto de Singapur', 'Singapur', 'Singapur', 37000000, TRUE, '1990-07-07', 21.3),
('Puerto de Busan', 'Busan', 'Corea del Sur', 22000000, TRUE, '1988-05-19', 20.7),
('Puerto de Dubái', 'Dubái', 'EAU', 15000000, TRUE, '1992-11-11', 18.9),
('Puerto de Santos', 'Santos', 'Brasil', 4500000, TRUE, '1976-06-06', 14.7),
('Puerto de Buenos Aires', 'Buenos Aires', 'Argentina', 1200000, FALSE, '1981-03-21', 13.9),
('Puerto de Tokio', 'Tokio', 'Japón', 9000000, FALSE, '1974-08-08', 18.2),
('Puerto de Yokohama', 'Yokohama', 'Japón', 7000000, TRUE, '1979-12-12', 17.4),
('Puerto de Vancouver', 'Vancouver', 'Canadá', 3500000, TRUE, '1985-05-05', 16.8),
('Puerto de Melbourne', 'Melbourne', 'Australia', 3000000, TRUE, '1987-10-01', 15.5),
('Puerto de Durban', 'Durban', 'Sudáfrica', 2800000, TRUE, '1984-02-02', 14.4),
('Puerto de Tánger Med', 'Tánger', 'Marruecos', 9000000, TRUE, '2007-07-07', 18.0),
('Puerto de El Pireo', 'Atenas', 'Grecia', 5000000, FALSE, '1973-09-09', 15.9),
('Puerto de Estambul', 'Estambul', 'Turquía', 2500000, TRUE, '1982-11-30', 14.6),
('Puerto de Colombo', 'Colombo', 'Sri Lanka', 7000000, TRUE, '1991-04-04', 17.1),
('Puerto de Manila', 'Manila', 'Filipinas', 6000000, FALSE, '1989-06-16', 16.4);

-- ============================================================
--   INSERTAR MUELLES (120 registros)
-- ============================================================

INSERT INTO muelle (id_puerto, nombre, longitud_m, calado_m, operativo, fecha_construccion, tipo)
VALUES
-- Puerto 1
(1, 'Muelle A1', 350.50, 14.2, TRUE, '1990-05-10', 'carga'),
(1, 'Muelle A2', 420.00, 15.0, FALSE, '1995-03-22', 'carga'),
(1, 'Muelle A3', 300.00, 12.5, TRUE, '2000-07-14', 'pasajeros'),
(1, 'Muelle A4', 500.00, 16.0, TRUE, '2005-09-01', 'granel'),

-- Puerto 2
(2, 'Muelle V1', 500.00, 15.8, TRUE, '1992-04-18', 'carga'),
(2, 'Muelle V2', 600.00, 17.0, TRUE, '1998-06-20', 'granel'),
(2, 'Muelle V3', 250.00, 10.5, TRUE, '2001-11-11', 'pasajeros'),
(2, 'Muelle V4', 450.00, 14.0, TRUE, '2008-02-02', 'carga'),

-- Puerto 3
(3, 'Muelle B1', 380.00, 13.2, TRUE, '1993-03-03', 'carga'),
(3, 'Muelle B2', 450.00, 14.8, TRUE, '1997-08-08', 'granel'),
(3, 'Muelle B3', 270.00, 11.0, FALSE, '2002-10-10', 'pasajeros'),
(3, 'Muelle B4', 520.00, 15.5, TRUE, '2006-12-12', 'carga'),

-- Puerto 4
(4, 'Muelle BI1', 300.00, 12.0, TRUE, '1991-01-01', 'carga'),
(4, 'Muelle BI2', 500.00, 15.2, TRUE, '1999-09-09', 'granel'),
(4, 'Muelle BI3', 200.00, 10.0, TRUE, '2003-03-03', 'pasajeros'),
(4, 'Muelle BI4', 450.00, 14.3, FALSE, '2007-07-07', 'carga'),

-- Puerto 5
(5, 'Muelle LP1', 400.00, 13.5, TRUE, '1994-04-04', 'carga'),
(5, 'Muelle LP2', 550.00, 16.0, TRUE, '1996-06-06', 'granel'),
(5, 'Muelle LP3', 260.00, 11.2, TRUE, '2004-04-04', 'pasajeros'),
(5, 'Muelle LP4', 480.00, 14.7, TRUE, '2009-09-09', 'carga'),

-- Puerto 6
(6, 'Muelle R1', 700.00, 18.0, TRUE, '1988-08-08', 'carga'),
(6, 'Muelle R2', 800.00, 19.5, TRUE, '1993-03-03', 'granel'),
(6, 'Muelle R3', 350.00, 12.8, TRUE, '2001-01-01', 'pasajeros'),
(6, 'Muelle R4', 900.00, 20.0, TRUE, '2010-10-10', 'carga'),

-- Puerto 7
(7, 'Muelle A1', 600.00, 17.0, FALSE, '1990-05-05', 'carga'),
(7, 'Muelle A2', 650.00, 18.0, TRUE, '1998-08-08', 'granel'),
(7, 'Muelle A3', 300.00, 12.0, TRUE, '2005-05-05', 'pasajeros'),
(7, 'Muelle A4', 720.00, 19.0, TRUE, '2012-12-12', 'carga'),

-- Puerto 8
(8, 'Muelle H1', 550.00, 16.5, TRUE, '1991-09-09', 'carga'),
(8, 'Muelle H2', 620.00, 17.8, TRUE, '1997-07-07', 'granel'),
(8, 'Muelle H3', 280.00, 11.5, TRUE, '2003-03-03', 'pasajeros'),
(8, 'Muelle H4', 700.00, 18.5, TRUE, '2011-11-11', 'carga'),

-- Puerto 9
(9, 'Muelle M1', 450.00, 14.0, TRUE, '1992-02-02', 'carga'),
(9, 'Muelle M2', 500.00, 15.0, TRUE, '1999-09-09', 'granel'),
(9, 'Muelle M3', 240.00, 10.2, TRUE, '2004-04-04', 'pasajeros'),
(9, 'Muelle M4', 520.00, 15.8, TRUE, '2013-03-03', 'carga'),

-- Puerto 10
(10, 'Muelle G1', 480.00, 14.5, TRUE, '1993-03-03', 'carga'),
(10, 'Muelle G2', 520.00, 15.3, TRUE, '1998-08-08', 'granel'),
(10, 'Muelle G3', 260.00, 11.0, TRUE, '2006-06-06', 'pasajeros'),
(10, 'Muelle G4', 600.00, 16.2, TRUE, '2014-04-04', 'carga'),

-- Puerto 11
(11, 'Muelle L1', 300.00, 12.0, TRUE, '1990-01-01', 'carga'),
(11, 'Muelle L2', 350.00, 13.0, FALSE, '1995-05-05', 'granel'),
(11, 'Muelle L3', 200.00, 10.0, TRUE, '2000-10-10', 'pasajeros'),
(11, 'Muelle L4', 420.00, 14.0, TRUE, '2010-10-10', 'carga'),

-- Puerto 12
(12, 'Muelle S1', 550.00, 16.0, TRUE, '1992-02-02', 'carga'),
(12, 'Muelle S2', 600.00, 17.0, FALSE, '1998-08-08', 'granel'),
(12, 'Muelle S3', 280.00, 11.0, TRUE, '2004-04-04', 'pasajeros'),
(12, 'Muelle S4', 650.00, 18.0, TRUE, '2015-05-05', 'carga'),

-- Puerto 13
(13, 'Muelle NY1', 700.00, 17.5, TRUE, '1985-05-05', 'carga'),
(13, 'Muelle NY2', 750.00, 18.0, FALSE, '1990-10-10', 'granel'),
(13, 'Muelle NY3', 350.00, 12.0, FALSE, '2000-01-01', 'pasajeros'),
(13, 'Muelle NY4', 820.00, 19.0, TRUE, '2018-08-08', 'carga'),

-- Puerto 14
(14, 'Muelle LA1', 800.00, 18.5, TRUE, '1980-08-08', 'carga'),
(14, 'Muelle LA2', 850.00, 19.0, TRUE, '1995-05-05', 'granel'),
(14, 'Muelle LA3', 400.00, 13.0, TRUE, '2005-05-05', 'pasajeros'),
(14, 'Muelle LA4', 900.00, 20.0, TRUE, '2020-10-10', 'carga'),

-- Puerto 15
(15, 'Muelle SH1', 900.00, 20.0, TRUE, '1995-03-03', 'carga'),
(15, 'Muelle SH2', 950.00, 21.0, TRUE, '2000-06-06', 'granel'),
(15, 'Muelle SH3', 450.00, 14.0, TRUE, '2008-08-08', 'pasajeros'),
(15, 'Muelle SH4', 1000.00, 22.0, TRUE, '2019-09-09', 'carga'),

-- Puerto 16
(16, 'Muelle SG1', 850.00, 19.0, TRUE, '1994-04-04', 'carga'),
(16, 'Muelle SG2', 900.00, 20.0, TRUE, '1999-09-09', 'granel'),
(16, 'Muelle SG3', 420.00, 13.0, TRUE, '2007-07-07', 'pasajeros'),
(16, 'Muelle SG4', 950.00, 21.0, TRUE, '2021-01-01', 'carga'),

-- Puerto 17
(17, 'Muelle B1', 700.00, 18.0, TRUE, '1990-02-02', 'carga'),
(17, 'Muelle B2', 750.00, 19.0, TRUE, '1998-08-08', 'granel'),
(17, 'Muelle B3', 360.00, 12.0, TRUE, '2006-06-06', 'pasajeros'),
(17, 'Muelle B4', 820.00, 20.0, TRUE, '2016-06-06', 'carga'),

-- Puerto 18
(18, 'Muelle D1', 800.00, 19.0, TRUE, '1991-01-01', 'carga'),
(18, 'Muelle D2', 850.00, 20.0, TRUE, '1999-09-09', 'granel'),
(18, 'Muelle D3', 380.00, 13.0, TRUE, '2008-08-08', 'pasajeros'),
(18, 'Muelle D4', 900.00, 21.0, TRUE, '2017-07-07', 'carga'),

-- Puerto 19
(19, 'Muelle SA1', 600.00, 16.0, TRUE, '1993-03-03', 'carga'),
(19, 'Muelle SA2', 650.00, 17.0, TRUE, '2000-10-10', 'granel'),
(19, 'Muelle SA3', 300.00, 11.0, TRUE, '2009-09-09', 'pasajeros'),
(19, 'Muelle SA4', 700.00, 18.0, TRUE, '2020-02-02', 'carga'),

-- Puerto 20
(20, 'Muelle BA1', 500.00, 15.0, FALSE, '1994-04-04', 'carga'),
(20, 'Muelle BA2', 550.00, 16.0, FALSE, '2001-01-01', 'granel'),
(20, 'Muelle BA3', 260.00, 10.5, FALSE, '2007-07-07', 'pasajeros'),
(20, 'Muelle BA4', 600.00, 17.0, FALSE, '2018-08-08', 'carga'),

-- Puerto 21
(21, 'Muelle T1', 480.00, 14.0, TRUE, '1990-05-05', 'carga'),
(21, 'Muelle T2', 520.00, 15.0, TRUE, '1998-08-08', 'granel'),
(21, 'Muelle T3', 240.00, 10.0, TRUE, '2006-06-06', 'pasajeros'),
(21, 'Muelle T4', 580.00, 16.0, TRUE, '2014-04-04', 'carga'),

-- Puerto 22
(22, 'Muelle Y1', 500.00, 15.2, TRUE, '1992-02-02', 'carga'),
(22, 'Muelle Y2', 550.00, 16.3, TRUE, '1999-09-09', 'granel'),
(22, 'Muelle Y3', 260.00, 11.0, TRUE, '2008-08-08', 'pasajeros'),
(22, 'Muelle Y4', 620.00, 17.2, TRUE, '2019-09-09', 'carga'),

-- Puerto 23
(23, 'Muelle V1', 450.00, 14.0, TRUE, '1993-03-03', 'carga'),
(23, 'Muelle V2', 500.00, 15.0, TRUE, '2000-10-10', 'granel'),
(23, 'Muelle V3', 230.00, 10.0, TRUE, '2009-09-09', 'pasajeros'),
(23, 'Muelle V4', 560.00, 16.0, TRUE, '2021-01-01', 'carga'),

-- Puerto 24
(24, 'Muelle M1', 470.00, 14.3, TRUE, '1994-04-04', 'carga'),
(24, 'Muelle M2', 520.00, 15.5, TRUE, '2001-01-01', 'granel'),
(24, 'Muelle M3', 250.00, 10.8, TRUE, '2007-07-07', 'pasajeros'),
(24, 'Muelle M4', 600.00, 16.8, TRUE, '2018-08-08', 'carga'),

-- Puerto 25
(25, 'Muelle D1', 480.00, 14.5, TRUE, '1995-05-05', 'carga'),
(25, 'Muelle D2', 530.00, 15.7, TRUE, '2002-02-02', 'granel'),
(25, 'Muelle D3', 260.00, 11.2, TRUE, '2009-09-09', 'pasajeros'),
(25, 'Muelle D4', 620.00, 17.0, FALSE, '2020-10-10', 'carga'),

-- Puerto 26
(26, 'Muelle TM1', 700.00, 18.0, TRUE, '2007-07-07', 'carga'),
(26, 'Muelle TM2', 750.00, 19.0, TRUE, '2010-10-10', 'granel'),
(26, 'Muelle TM3', 350.00, 12.0, TRUE, '2015-05-05', 'pasajeros'),
(26, 'Muelle TM4', 820.00, 20.0, TRUE, '2022-02-02', 'carga'),

-- Puerto 27
(27, 'Muelle P1', 460.00, 14.0, TRUE, '1993-03-03', 'carga'),
(27, 'Muelle P2', 510.00, 15.0, TRUE, '2000-10-10', 'granel'),
(27, 'Muelle P3', 240.00, 10.0, TRUE, '2008-08-08', 'pasajeros'),
(27, 'Muelle P4', 580.00, 16.0, TRUE, '2019-09-09', 'carga'),

-- Puerto 28
(28, 'Muelle E1', 480.00, 14.5, TRUE, '1994-04-04', 'carga'),
(28, 'Muelle E2', 530.00, 15.8, TRUE, '2001-01-01', 'granel'),
(28, 'Muelle E3', 260.00, 11.0, TRUE, '2007-07-07', 'pasajeros'),
(28, 'Muelle E4', 600.00, 16.5, TRUE, '2018-08-08', 'carga'),

-- Puerto 29
(29, 'Muelle C1', 500.00, 15.0, TRUE, '1995-05-05', 'carga'),
(29, 'Muelle C2', 550.00, 16.0, TRUE, '2002-02-02', 'granel'),
(29, 'Muelle C3', 280.00, 11.0, TRUE, '2009-09-09', 'pasajeros'),
(29, 'Muelle C4', 650.00, 17.0, TRUE, '2020-10-10', 'carga'),

-- Puerto 30
(30, 'Muelle M1', 600.00, 16.0, FALSE, '1996-06-06', 'carga'),
(30, 'Muelle M2', 650.00, 17.0, TRUE, '2003-03-03', 'granel'),
(30, 'Muelle M3', 300.00, 11.0, TRUE, '2010-10-10', 'pasajeros'),
(30, 'Muelle M4', 700.00, 18.0, FALSE, '2021-01-01', 'carga');