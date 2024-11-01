const express = require("express");
const router = express.Router();
const link = require("../../config/link");
const conexion = require("../../config/conexion");
const util = require('util');

// Convertir conexion.query a una versión que devuelve promesas
const query = util.promisify(conexion.query).bind(conexion);

router.post("/regUsuario", async (req, res) => {
    try {
        const { userReg, emailReg, passwordReg } = req.body;

        // Validación de entrada
        if (!userReg || !emailReg || !passwordReg) {
            return res.status(400).render("index", { mensaje: "Todos los campos son requeridos", link });
        }

        // Validación del formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailReg)) {
            return res.status(400).render("index", { mensaje: "Formato de email inválido", link });
        }

        // Comprobar si el email ya está registrado
        const existingUser = await query("SELECT * FROM usuarios WHERE email = ?", [emailReg]);
        if (existingUser.length > 0) {
            return res.status(400).render("index", { mensaje: "El email ya está registrado", link });
        }

        // Usar la contraseña directamente sin hashear
        const insertar = "INSERT INTO usuarios (codusu, nombre, email, password, telefono, direccion, foto_perfil, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const values = ['', userReg, emailReg, passwordReg, '', '', '', '']; // Guardar la contraseña directamente

        await query(insertar, values);
        
        console.log("Registro exitoso");
        res.render("index", { mensaje: "Registro exitoso", link });
    } catch (error) {
        console.error("Error inesperado:", error);
        res.status(500).render("index", { mensaje: "Error interno del servidor", link });
    }
});

module.exports = router;
