const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const link = require("../config/link");
const conexion = require("../config/conexion");
const util = require('util');

// Convertir conexion.query a promesas
const query = util.promisify(conexion.query).bind(conexion);

// Validaciones para el registro
const registerValidations = [
    body('userReg')
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('El nombre debe tener entre 3 y 50 caracteres'),
    body('emailReg')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Email inválido'),
    body('passwordReg')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
];

// Validaciones para el login
const loginValidations = [
    body('emailLogin')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Email inválido'),
    body('passwordLogin')
        .notEmpty()
        .withMessage('La contraseña es requerida')
];

// Función helper para generar respuesta de error
const sendErrorResponse = (res, statusCode, message, redirectUrl = '/') => {
    if (req.xhr) {
        return res.status(statusCode).json({ error: message });
    }
    return res.redirect(`${redirectUrl}?error=${encodeURIComponent(message)}`);
};

// Controlador para el registro
const register = async (req, res) => {
    try {
        // Validar entrada
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendErrorResponse(res, 400, errors.array()[0].msg);
        }

        const { userReg, emailReg, passwordReg } = req.body;

        // Verificar si el email ya existe
        const existingUser = await query(
            "SELECT id FROM usuarios WHERE email = ?", 
            [emailReg]
        );

        if (existingUser.length > 0) {
            return sendErrorResponse(res, 400, "El email ya está registrado");
        }

        // Hash de la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(passwordReg, saltRounds);

        // Crear usuario
        const insertar = `
            INSERT INTO usuarios (
                nombre, 
                email, 
                password,
                rol,
                fecha_creacion
            ) VALUES (?, ?, ?, 'usuario', NOW())
        `;

        await query(insertar, [userReg, emailReg, hashedPassword]);
        
        // Respuesta exitosa
        res.redirect('/login?message=Registro exitoso');

    } catch (error) {
        console.error("Error en registro:", error);
        sendErrorResponse(res, 500, "Error interno del servidor");
    }
};

// Controlador para el login
const login = async (req, res) => {
    try {
        // Validar entrada
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendErrorResponse(res, 400, errors.array()[0].msg);
        }

        const { emailLogin, passwordLogin } = req.body;

        // Buscar usuario
        const users = await query(
            "SELECT * FROM usuarios WHERE email = ?", 
            [emailLogin]
        );

        if (users.length === 0) {
            return sendErrorResponse(res, 401, "Credenciales inválidas");
        }

        const user = users[0];

        // Verificar contraseña
        const isValidPassword = await bcrypt.compare(passwordLogin, user.password);
        
        if (!isValidPassword) {
            return sendErrorResponse(res, 401, "Credenciales inválidas");
        }

        // Crear sesión
        req.session.user = {
            id: user.id,
            nombre: user.nombre,
            email: user.email,
            rol: user.rol
        };

        // Redireccionar según el rol
        const redirectPath = user.rol === 'administrador' ? '/admin/dashboard' : '/home';
        res.redirect(redirectPath);

    } catch (error) {
        console.error("Error en login:", error);
        sendErrorResponse(res, 500, "Error interno del servidor");
    }
};

// Controlador para cerrar sesión
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al cerrar sesión:", err);
            return sendErrorResponse(res, 500, "Error al cerrar sesión");
        }
        res.redirect('/');
    });
};

module.exports = {
    register,
    login,
    logout,
    registerValidations,
    loginValidations
};