const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Ruta para el registro de un nuevo usuario
router.post('/login_register', authController.register);


// Ruta para cerrar sesión (opcional)
router.post('/logout', authController.logout);

module.exports = router;
