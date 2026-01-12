// puertoRoutes.js
const express = require('express');
const router = express.Router();
const puertoController = require('../controllers/puertoController');
const asyncHandler = require('../utils/asyncHandler');
const validateId = require('../middleware/validateId');
const { puertoSchemaFull, puertoSchemaPartial } = require('../validators/puertoValidator');
const validateBody = require('../middleware/validateBody');

router.get('/', asyncHandler(puertoController.getPuertos.bind(puertoController)));
router.get('/:id', validateId('id'), asyncHandler(puertoController.getPuertoById.bind(puertoController)));
router.post('/', validateBody(puertoSchemaFull), asyncHandler(puertoController.createPuerto.bind(puertoController)));
router.put('/:id', validateBody(puertoSchemaFull), validateId('id'), asyncHandler(puertoController.updatePuerto.bind(puertoController)));
router.patch('/:id', validateBody(puertoSchemaPartial), validateId('id'), asyncHandler(puertoController.updatePuerto.bind(puertoController)));
router.delete('/:id', validateId('id'), asyncHandler(puertoController.deletePuerto.bind(puertoController)));

module.exports = router;
