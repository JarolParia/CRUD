// userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const validateUser = require('../middlewares/userMiddlewares'); 

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/create', validateUser, userController.createUser);

module.exports = router;