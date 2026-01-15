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