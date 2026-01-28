// puertoRoutes.js
const express = require('express');
const router = express.Router();
const puertoController = require('../controllers/puertoController');
const asyncHandler = require('../utils/asyncHandler');

const validateId = require('../middleware/validateId');
const validateBody = require('../middleware/validateBody');
const { puertoSchemaFull, puertoSchemaPartial } = require('../validators/puertoBodyValidator');
const validateQuery = require('../middleware/validateQuery');
const puertoQueryValidator = require('../validators/puertoQueryValidator');

router.get('/',
    validateQuery(puertoQueryValidator),
    asyncHandler(puertoController.getPuertos)
);
router.get('/:id',
    validateId('id'),
    asyncHandler(puertoController.getPuertoById)
);
router.post('/',
    validateBody(puertoSchemaFull),
    asyncHandler(puertoController.createPuerto)
);
router.put('/:id',
    validateId('id'),
    validateBody(puertoSchemaFull),
    asyncHandler(puertoController.updatePuerto)
);
router.patch('/:id',
    validateId('id'),
    validateBody(puertoSchemaPartial),
    asyncHandler(puertoController.patchPuerto)
);
router.delete('/:id',
    validateId('id'),
    asyncHandler(puertoController.deletePuerto)
);

module.exports = router;
