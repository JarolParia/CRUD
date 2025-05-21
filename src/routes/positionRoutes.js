const express = require('express'); // Import Express framework
const router = express.Router(); // Create Express router instance
const positionController = require('../controllers/positionController'); //Import position controller
const validatePosition = require('../Validations/PositionValidations'); //Import position validation middleware
const { authenticateToken, requireAdmin, requireAdminOrSupervisor } = require('../middlewares/AuthMiddlewares'); //Import position validiation middleware

// Rutas protegidas - requieren autenticación
router.get('/', authenticateToken, requireAdminOrSupervisor, positionController.getAllPositions);
router.get('/All', authenticateToken, requireAdminOrSupervisor, positionController.getAllPositionsAll);
router.post('/', authenticateToken, requireAdmin, validatePosition, positionController.createPosition);
router.get('/:id', authenticateToken, requireAdminOrSupervisor, positionController.getPositionById);
router.delete('/:id', authenticateToken, requireAdmin, positionController.deletePositionHandler); 
router.put('/:id', authenticateToken, requireAdminOrSupervisor, positionController.updatePosition);

module.exports = router;