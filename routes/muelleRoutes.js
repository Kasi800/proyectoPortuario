// muelleRoutes.js
const express = require('express');
const router = express.Router();
const muelleController = require('../controllers/muelleController');
const asyncHandler = require('../utils/asyncHandler');
const validateId = require('../middleware/validateId');
const { muelleSchemaFull, muelleSchemaPartial } = require('../validators/muelleValidator');
const validateBody = require('../middleware/validateBody');

router.get('/', asyncHandler(muelleController.getMuelle.bind(muelleController)));
router.get('/:id', validateId('id'), asyncHandler(muelleController.getMuelleById.bind(muelleController)));
router.post('/', validateBody(muelleSchemaFull), asyncHandler(muelleController.createMuelle.bind(muelleController)));
router.put('/:id', validateBody(muelleSchemaFull), validateId('id'), asyncHandler(muelleController.updateMuelle.bind(muelleController)));
router.patch('/:id', validateBody(muelleSchemaPartial), validateId('id'), asyncHandler(muelleController.updateMuelle.bind(muelleController)));
router.delete('/:id', validateId('id'), asyncHandler(muelleController.deleteMuelle.bind(muelleController)));

module.exports = router;