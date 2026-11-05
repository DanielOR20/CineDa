'use strict';
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas públicas de autenticación
router.post('/register', authController.register);
router.post('/login', authController.login);

// Ruta protegida para consultar el usuario actual
router.get('/me', authMiddleware, authController.me);

module.exports = router;

