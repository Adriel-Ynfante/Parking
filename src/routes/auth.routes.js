const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Middleware para verificar si el usuario está autenticado
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login?error=Debe iniciar sesión');
    }
};

// Middleware para verificar si el usuario es administrador
const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.rol === 'administrador') {
        next();
    } else {
        res.redirect('/home?error=No tiene permisos de administrador');
    }
};

// Rutas públicas
router.post('/register', authController.registerValidations, authController.register);
router.post('/login', authController.loginValidations, authController.login);

// Ruta protegida para cerrar sesión
router.post('/logout', isAuthenticated, authController.logout);

// Rutas del administrador (ejemplo)
router.get('/admin/dashboard', isAuthenticated, isAdmin, (req, res) => {
    res.render('admin/dashboard');
});

module.exports = router;