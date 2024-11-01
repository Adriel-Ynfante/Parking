const express = require("express");
const router = express.Router();
const link = require("../config/link");
const conexion = require("../config/conexion");
const multer = require("multer");
const path = require("path");

// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Agregar timestamp al nombre del archivo
    }
});

const upload = multer({ storage: storage });

// Función de autenticación
function isAuthenticated(req, res, next) {
    if (req.session && req.session.codusu) {
        return next(); // Usuario autenticado, continuar con la siguiente función
    }
    res.status(401).json({ message: "No autorizado" }); // Usuario no autenticado
}

// Obtener perfil de usuario
router.get("/usuario", (req, res) => {
    try {
        const userId = req.session.codusu;
        // Obtener datos del usuario, tarjetas y vehículos
        const queryUser = `
            SELECT u.*, 
                   c.numero_tarjeta, c.fecha_expiracion,
                   v.marca, v.modelo, v.placa
            FROM usuarios u
            LEFT JOIN tarjetas_credito c ON u.codusu = c.codusu
            LEFT JOIN vehiculos v ON u.codusu = v.codusu
            WHERE u.codusu = ?`;

        conexion.query(queryUser, [userId], (err, results) => {
            if (err) throw err;
            
            // Organizar los datos
            const userData = results[0] || {};
            const tarjetas = results.map(row => ({
                numero: row.numero_tarjeta,
                expiracion: row.fecha_expiracion
            })).filter(card => card.numero);
            
            const vehiculos = results.map(row => ({
                marca: row.marca,
                modelo: row.modelo,
                placa: row.placa
            })).filter(vehicle => vehicle.marca);

            res.render("usuario", {
                datos: req.session,
                usuario: userData,
                tarjetas,
                vehiculos,
                link
            });
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Actualizar perfil de usuario
router.post("/usuario/actualizar", isAuthenticated, (req, res) => {
    try {
        const userId = "1";
        const { nombre, email, telefono, direccion } = req.body;

        const query = `
            UPDATE usuarios 
            SET nombre = ?, email = ?, telefono = ?, direccion = ?
            WHERE codusu = ?`;

        conexion.query(query, [nombre, email, telefono, direccion, userId], (err, result) => {
            if (err) throw err;
            res.json({ success: true, message: "Perfil actualizado exitosamente" });
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Agregar tarjeta de crédito
router.post("/usuario/tarjeta", isAuthenticated, (req, res) => {
    try {
        const userId = "1";
        const { numero, expiracion } = req.body;

        const query = `
            INSERT INTO tarjetas_credito (codusu, numero_tarjeta, fecha_expiracion)
            VALUES (?, ?, ?)`; 

        conexion.query(query, [userId, numero, expiracion], (err, result) => {
            if (err) throw err;
            res.json({ success: true, message: "Tarjeta agregada exitosamente" });
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Agregar vehículo
router.post("/usuario/vehiculo", isAuthenticated, (req, res) => {
    try {
        const userId = "1";
        const { marca, modelo, placa } = req.body;

        const query = `
            INSERT INTO vehiculos (id, codusu, marca, modelo, placa, fecha_creacion)
            VALUES ('', ?, ?, ?, ?, ?)`; 

        conexion.query(query, [userId, marca, modelo, placa], (err, result) => {
            if (err) throw err;
            res.json({ success: true, message: "Vehículo agregado exitosamente" });
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Actualizar foto de perfil
router.post("/usuario/foto", isAuthenticated, upload.single('foto'), (req, res) => {
    try {
        const userId = "1";
        const foto = req.file.path; // Ruta del archivo guardado

        const query = `
            UPDATE usuarios 
            SET foto_perfil = ?
            WHERE codusu = ?`;

        conexion.query(query, [foto, userId], (err, result) => {
            if (err) throw err;
            res.json({ success: true, message: "Foto actualizada exitosamente" });
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
