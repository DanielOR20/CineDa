'use strict';
const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// GET /api/ai/reporte -> aiReporteService
router.get('/reporte', aiController.getReporte);

// POST /api/ai/pelicula -> aiPeliculaService
router.post('/pelicula', aiController.postPelicula);

// POST /api/ai/copilot -> aiCopilotService
router.post('/copilot', aiController.postCopilot);

module.exports = router;

