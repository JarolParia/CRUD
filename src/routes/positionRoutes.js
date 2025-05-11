const express = require('express');
const router = express.Router();
const positionController = require('../controllers/positionController');

router.get('/', positionController.getAllPositions);
router.get('/:id', positionController.getPositionById);
router.post('/create', positionController.createPosition);
router.put('/:id', positionController.updatePosition);

module.exports = router;