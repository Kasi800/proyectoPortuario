/*
 * muelleRoutes.js - Rutas de la API para gestión de muelles
 * Define endpoints CRUD con validaciones y manejo de errores
 */

const express = require('express');
const router = express.Router();
const muelleController = require('../controllers/muelleController');
const asyncHandler = require('../utils/asyncHandler');

// Middlewares de validación
const validateId = require('../middleware/validateId');
const validateBody = require('../middleware/validateBody');
const validateQuery = require('../middleware/validateQuery');

// Esquemas de validación
const { muelleSchemaFull, muelleSchemaPartial } = require('../validators/muelleBodyValidator');
const muelleQueryValidator = require('../validators/muelleQueryValidator');

// ============================================================
// RUTAS - GET
// ============================================================

/**
 * GET / - Obtener todos los muelles con filtros opcionales
 * Middlewares: validateQuery (validación de parámetros)
 */
router.get('/',
    validateQuery(muelleQueryValidator),
    asyncHandler(muelleController.getMuelle)
);

// GET /:id - Obtener un muelle por ID
// Middlewares: validateId (validación del parámetro ID)
router.get('/:id',
    validateId('id'),
    asyncHandler(muelleController.getMuelleById)
);

// ============================================================
// RUTAS - POST
// ============================================================

// POST / - Crear un nuevo muelle
// Middlewares: validateBody (validación con schema completo)
router.post('/',
    validateBody(muelleSchemaFull),
    asyncHandler(muelleController.createMuelle)
);

// ============================================================
// RUTAS - PUT / PATCH
// ============================================================

// PUT /:id - Actualizar completamente un muelle
// Middlewares: validateId, validateBody (schema completo requerido)
router.put('/:id',
    validateId('id'),
    validateBody(muelleSchemaFull),
    asyncHandler(muelleController.updateMuelle)
);

// PATCH /:id - Actualizar parcialmente un muelle
// Middlewares: validateId, validateBody (schema parcial permite campos opcionales)
router.patch('/:id',
    validateId('id'),
    validateBody(muelleSchemaPartial),
    asyncHandler(muelleController.patchMuelle)
);

// ============================================================
// RUTAS - DELETE
// ============================================================

// DELETE /:id - Eliminar un muelle
// Middlewares: validateId (validación del parámetro ID)
router.delete('/:id',
    validateId('id'),
    asyncHandler(muelleController.deleteMuelle)
);

module.exports = router;