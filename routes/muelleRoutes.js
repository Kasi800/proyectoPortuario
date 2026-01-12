// muelleRoutes.js
const express = require('express');
const router = express.Router();
const muelleController = require('../controllers/muelleController');
const asyncHandler = require('../utils/asyncHandler');
const validateId = require('../middleware/validateId');

router.get('/', asyncHandler(muelleController.getMuelle.bind(muelleController)));
router.get('/:id', validateId('id'), asyncHandler(muelleController.getMuelleById.bind(muelleController)));
router.post('/', asyncHandler(muelleController.createMuelle.bind(muelleController)));
router.put('/:id', validateId('id'), asyncHandler(muelleController.updateMuelle.bind(muelleController)));
router.patch('/:id', validateId('id'), asyncHandler(muelleController.updateMuelle.bind(muelleController)));
router.delete('/:id', validateId('id'), asyncHandler(muelleController.deleteMuelle.bind(muelleController)));

module.exports = router;