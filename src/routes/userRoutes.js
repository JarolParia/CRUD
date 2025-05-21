const express = require('express'); //Import Express framework
const router = express.Router(); //Create Express router instance
const userController = require('../controllers/UserController'); //Import user controller
const validateUser = require('../Validations/userValidations'); // Fixed import path
const { authenticateToken, requireAdmin, requireAdminOrSupervisor, requireSelfOrAdmin } = require('../middlewares/AuthMiddlewares'); //Import authentication middleware

// Rutas protegidas - requieren autenticación
router.get('/', authenticateToken, requireAdminOrSupervisor, userController.getAllUsers);
router.get('/:id', authenticateToken, requireSelfOrAdmin, userController.getUserById); // Usuario puede ver sus propios datos
router.post('/', authenticateToken, requireAdmin, validateUser, userController.createUser); // Solo admins pueden crear usuarios
router.put('/:id', authenticateToken, requireSelfOrAdmin, userController.updateUser); // Usuario puede actualizar sus propios datos
router.delete('/:id', authenticateToken, requireAdmin, userController.userDelete); // Solo admins pueden eliminar

// Export configured router
module.exports = router;