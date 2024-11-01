const express = require("express");
const session = require("express-session");
const path = require("path");
const link = require("./src/config/link"); // Importa el enlace
const errorHandler = require("./src/middleware/error.middleware"); // Middleware de error
const checkSession = require("./src/middleware/session.middleware"); // Middleware de sesión
const app = express(); 

// Configuraciones iniciales
app.use(express.static(path.join(__dirname, 'src', 'public'))); // Ruta para archivos estáticos
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

// Configuración de sesiones
app.use(session({
    secret: 'tu_secreto_aqui',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// Aplicar middleware de sesión a todas las rutas
app.use(checkSession);

// Configuración de vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

// Rutas
app.use(require("./src/routes/index"));
app.use(require("./src/routes/auth.routes"));
app.use(require("./src/routes/home"));
app.use(require("./src/routes/reservar"));
app.use(require("./src/routes/usuario"));

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).render('errors/404', { 
        message: 'Página no encontrada',
        datos: req.session
    });
});

// Manejo de errores generales
app.use(errorHandler); // Usa el middleware de error

// Variables de entorno
const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en: ${link}`);
});

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
    console.error('Error no capturado:', err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('Promesa rechazada no manejada:', err);
    process.exit(1);
});
