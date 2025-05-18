const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const { validateLoginMiddleware } = require('../Validations/AuthValidation');

// Ruta para login
router.post('/login', validateLoginMiddleware, authController.login);

// Ruta para validar token (opcional)
router.get('/validate', authController.validateToken);

// Ruta para logout (opcional)
router.post('/logout', authController.logout);

module.exports = router;