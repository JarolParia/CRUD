const express = require('express'); // Import Express framework
const router = express.Router(); // Create Express router instance
const authController = require('../controllers/AuthController');
const { validateLoginMiddleware } = require('../Validations/AuthValidation');

// route logIn
router.post('/login', validateLoginMiddleware, authController.login);

// Route to validate token (optional)
router.get('/validate', authController.validateToken);

// Route  logout (optional)
router.post('/logout', authController.logout);

// Export configured router
module.exports = router; 