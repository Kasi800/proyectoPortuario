// muelleRoutes.js
const express = require('express');
const router = express.Router();
const muelleController = require('../controllers/muelleController');
const asyncHandler = require('../utils/asyncHandler');

const validateId = require('../middleware/validateId');
const validateBody = require('../middleware/validateBody');
const { muelleSchemaFull, muelleSchemaPartial } = require('../validators/muelleBodyValidator');
const validateQuery = require('../middleware/validateQuery');
const muelleQueryValidator = require('../validators/muelleQueryValidator');

router.get('/',
    validateQuery(muelleQueryValidator),
    asyncHandler(muelleController.getMuelle)
);
router.get('/:id',
    validateId('id'),
    asyncHandler(muelleController.getMuelleById)
);
router.post('/',
    validateBody(muelleSchemaFull),
    asyncHandler(muelleController.createMuelle)
);
router.put('/:id',
    validateId('id'),
    validateBody(muelleSchemaFull),
    asyncHandler(muelleController.updateMuelle)
);
router.patch('/:id',
    validateId('id'),
    validateBody(muelleSchemaPartial),
    asyncHandler(muelleController.patchMuelle)
);
router.delete('/:id',
    validateId('id'),
    asyncHandler(muelleController.deleteMuelle)
);

module.exports = router;