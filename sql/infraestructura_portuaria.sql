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

-- ============================================================
--   DATOS INICIALES
-- ============================================================

-- Puertos
INSERT INTO puerto (nombre, ciudad, pais, capacidad_teu, activo, fecha_inauguracion, profundidad_media)
VALUES
('Puerto de Valencia', 'Valencia', 'España', 5500000, TRUE, '1902-05-12', 14.50),
('Puerto de Algeciras', 'Algeciras', 'España', 5100000, TRUE, '1894-03-20', 17.20),
('Puerto de Barcelona', 'Barcelona', 'España', 3400000, FALSE, '1869-09-01', 13.80);

-- Muelles del Puerto de Valencia (id_puerto = 1)
INSERT INTO muelle (id_puerto, nombre, longitud_m, calado_m, operativo, fecha_construccion, tipo)
VALUES
(1, 'Muelle Sur', 1800.00, 16.50, TRUE, '1980-06-15', 'carga'),
(1, 'Muelle Levante', 950.00, 12.00, TRUE, '1995-04-10', 'mixto'),
(1, 'Muelle Pasajeros', 600.00, 10.00, TRUE, '2005-08-22', 'pasajeros');

-- Muelles del Puerto de Algeciras (id_puerto = 2)
INSERT INTO muelle (id_puerto, nombre, longitud_m, calado_m, operativo, fecha_construccion, tipo)
VALUES
(2, 'Muelle Isla Verde', 2100.00, 17.00, TRUE, '1978-11-03', 'carga'),
(2, 'Muelle Norte', 1200.00, 14.00, FALSE, '1988-02-14', 'mixto');

-- Muelles del Puerto de Barcelona (id_puerto = 3)
INSERT INTO muelle (id_puerto, nombre, longitud_m, calado_m, operativo, fecha_construccion, tipo)
VALUES
(3, 'Muelle Adosado', 1500.00, 13.50, TRUE, '1990-07-30', 'pasajeros'),
(3, 'Muelle Sur', 1700.00, 15.00, TRUE, '1975-05-18', 'carga');