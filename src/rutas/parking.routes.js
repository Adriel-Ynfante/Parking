const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parking.controller');
const authMiddleware = require('../middleware/auth.middleware');
const companyMiddleware = require('../middleware/company.middleware');

router.get('/', authMiddleware, parkingController.getAllParkings);
router.get('/create', authMiddleware, companyMiddleware, parkingController.createForm);
router.post('/create', authMiddleware, companyMiddleware, parkingController.createParking);
router.get('/:id', authMiddleware, parkingController.getParkingDetails);

module.exports = router;