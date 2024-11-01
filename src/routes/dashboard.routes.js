const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Ruta para la vista del dashboard de admin
router.get('/admin', authMiddleware.verifyAdmin, dashboardController.adminDashboard);

// Ruta para la vista del dashboard de empresa
router.get('/company', authMiddleware.verifyCompany, dashboardController.companyDashboard);

module.exports = router;
