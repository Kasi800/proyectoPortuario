// puertoRoutes.js
const express = require('express');
const router = express.Router();
const puertoController = require('../controllers/puertoController');

router.get('/', puertoController.getPuertos);
router.get('/:id', puertoController.getPuertoById);
router.post('/', puertoController.createPuerto);
router.put('/:id', puertoController.updatePuerto);
router.patch('/:id', puertoController.updatePuerto);
router.delete('/:id', puertoController.deletePuerto);

module.exports = router;
