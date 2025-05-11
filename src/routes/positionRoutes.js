const express = require('express');
const router = express.Router();
const positionController = require('../controllers/positionController');


router.get('/', positionController.getAllPositions);
router.get('/:id', positionController.getPositionById);
router.post('/create', positionController.createPosition);
router.delete('/delete/:id', positionController.deletePositionHandler);

module.exports = router;