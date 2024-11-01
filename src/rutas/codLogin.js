const express = require("express");
const router = express.Router();
const link = require("../config/link");
const conexion = require("../config/conexion");
const util = require('util');

// Convertir conexion.query a una versión que devuelve promesas
const query = util.promisify(conexion.query).bind(conexion);

router.post("/codLogin", async function(req, res) {
    const usuario = req.body.emailLogin;
    const pass = req.body.passwordLogin;

    try {
        // Validar si el correo existe
        const validar = "SELECT * FROM usuarios WHERE email = ?";
        const rows = await query(validar, [usuario]);

        if (rows.length < 1) {
            const mensaje = "El correo no existe";
            console.log(mensaje);
            // Cambiar render por redirect con query parameter
            return res.redirect('/?error=' + encodeURIComponent(mensaje));
        }

        // Validar contraseña (comparando directamente, sin hash)
        const user = rows[0];
        if (pass !== user.password) {  // Compara directamente sin hash
            const mensaje = "Contraseña incorrecta";
            console.log(mensaje);
            // Cambiar render por redirect con query parameter
            return res.redirect('/?error=' + encodeURIComponent(mensaje));
        }

        // Login exitoso
        req.session.login = true;
        req.session.codnombre = user.nombre; 
        req.session.codemail = user.email; 
        console.log(req.session);
        
        // Cambiar render por redirect
        res.redirect('/home');

    } catch (error) {
        console.error("Error en el login:", error);
        res.redirect('/registro?error=' + encodeURIComponent("Error en el servidor"));
    }
});

module.exports = router;