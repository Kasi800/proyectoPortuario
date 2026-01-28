/*
 * puertoRoutes.js - Rutas de la API para gestión de puertos
 * Define endpoints CRUD con validaciones y manejo de errores
 */

const express = require('express');
const router = express.Router();
const puertoController = require('../controllers/puertoController');
const asyncHandler = require('../utils/asyncHandler');

// Middlewares de validación
const validateId = require('../middleware/validateId');
const validateBody = require('../middleware/validateBody');
const validateQuery = require('../middleware/validateQuery');

// Esquemas de validación
const { puertoSchemaFull, puertoSchemaPartial } = require('../validators/puertoBodyValidator');
const puertoQueryValidator = require('../validators/puertoQueryValidator');

// ============================================================
// RUTAS - GET
// ============================================================

// Obtener todos los puertos con filtros opcionales
// Middlewares: validateQuery (validación de parámetros)
router.get('/',
    validateQuery(puertoQueryValidator),
    asyncHandler(puertoController.getPuertos)
);

// Obtener un puerto por ID
// Middlewares: validateId (validación del parámetro ID)
router.get('/:id',
    validateId('id'),
    asyncHandler(puertoController.getPuertoById)
);

// ============================================================
// RUTAS - POST
// ============================================================

// Crear un nuevo puerto
// Middlewares: validateBody (validación con schema completo)
router.post('/',
    validateBody(puertoSchemaFull),
    asyncHandler(puertoController.createPuerto)
);

// ============================================================
// RUTAS - PUT / PATCH
// ============================================================

// Actualizar completamente un puerto (PUT)
// Middlewares: validateId, validateBody (schema completo requerido)
router.put('/:id',
    validateId('id'),
    validateBody(puertoSchemaFull),
    asyncHandler(puertoController.updatePuerto)
);

// Actualizar parcialmente un puerto (PATCH)
// Middlewares: validateId, validateBody (schema parcial permite campos opcionales)
router.patch('/:id',
    validateId('id'),
    validateBody(puertoSchemaPartial),
    asyncHandler(puertoController.patchPuerto)
);

// ============================================================
// RUTAS - DELETE
// ============================================================

// Eliminar un puerto
// Middlewares: validateId (validación del parámetro ID)
router.delete('/:id',
    validateId('id'),
    asyncHandler(puertoController.deletePuerto)
);

module.exports = router;
