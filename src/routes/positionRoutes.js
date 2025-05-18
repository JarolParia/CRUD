const express = require('express');
const router = express.Router();
const positionController = require('../controllers/positionController');
const validatePosition = require('../Validations/PositionValidations');
const { authenticateToken, requireAdmin, requireAdminOrSupervisor } = require('../middlewares/AuthMiddlewares');

// Rutas protegidas - requieren autenticación
router.get('/', authenticateToken, requireAdminOrSupervisor, positionController.getAllPositions);
router.get('/All', authenticateToken, requireAdminOrSupervisor, positionController.getAllPositionsAll);
router.post('/', authenticateToken, requireAdmin, validatePosition, positionController.createPosition);
router.get('/:id', authenticateToken, requireAdminOrSupervisor, positionController.getPositionById);
router.delete('/:id', authenticateToken, requireAdmin, positionController.deletePositionHandler); // Solo admins pueden eliminar
router.put('/:id', authenticateToken, requireAdminOrSupervisor, positionController.updatePosition);

module.exports = router;