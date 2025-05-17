// positionRoutes.js
const express = require('express');
const router = express.Router();
const positionController = require('../controllers/positionController');
const validatePosition = require('../middlewares/PositionMiddelwares'); 


router.get('/', positionController.getAllPositions);
router.get('/:id', positionController.getPositionById);
router.post('/', validatePosition, positionController.createPosition);
router.delete('/:id', positionController.deletePositionHandler);
router.put('/:id', positionController.updatePosition);

module.exports = router;