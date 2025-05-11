// userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const validateUser = require('../middlewares/userMiddlewares'); // Importación corregida

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/create', validateUser, userController.createUser);
router.delete('/delete/:id', userController.deleteUser);

module.exports = router;