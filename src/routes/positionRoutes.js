// positionRoutes.js
const express = require('express');
const router = express.Router();
const positionController = require('../controllers/positionController');
const validatePosition = require('../middlewares/PositionMiddelwares'); // Importación corregida


router.get('/', positionController.getAllPositions);
router.get('/:id', positionController.getPositionById);
router.post('/create', validatePosition, positionController.createPosition);
router.delete('/delete/:id', positionController.deletePositionHandler);
router.put('/:id', positionController.updatePosition);

module.exports = router;