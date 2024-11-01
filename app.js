const express = require("express");
const session = require("express-session");
const path = require("path");
const app = express();

// Middleware para manejar errores
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

// Middleware para verificar sesión
const checkSession = (req, res, next) => {
    if (req.session && req.session.codusu) {
        res.locals.userSession = req.session;
    }
    next();
};

// Configuraciones iniciales
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

// Configuración de sesiones
app.use(session({
    secret: "tu_contraseña",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // true en producción
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// Aplicar middleware de sesión a todas las rutas
app.use(checkSession);

// Configuración de vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// Rutas
app.use(require("./src/rutas/index"));
app.use(require("./src/rutas/regUsuario"));
app.use(require("./src/rutas/codLogin"));
app.use(require("./src/rutas/home"));
app.use(require("./src/rutas/reservar"));
app.use(require("./src/rutas/usuario"));

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).render('errors/404', { 
        message: 'Página no encontrada',
        datos: req.session
    });
});

// Manejo de errores generales
app.use(errorHandler);

// Variables de entorno
const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en: ${
        PORT === 3000 
            ? "http://localhost:3000" 
            : `el puerto ${PORT}`
    }`);
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
