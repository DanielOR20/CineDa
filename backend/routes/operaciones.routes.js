'use strict';
const express = require('express');
const router = express.Router();
const controller = require('../controllers/operaciones.controller');

// Rutas para consultar las 5 Vistas SQL
router.get('/vistas/funciones-peliculas', controller.getVistaFuncionesPeliculas);
router.get('/vistas/entradas-disponibles', controller.getVistaEntradasDisponibles);
router.get('/vistas/facturas-consolidadas', controller.getVistaFacturasConsolidadas);
router.get('/vistas/catalogo-dulceria', controller.getVistaCatalogoDulceria);
router.get('/vistas/estado-salas', controller.getVistaEstadoSalas);

// Rutas para ejecutar los 5 Stored Procedures
router.post('/sp/insertar-funcion', controller.spInsertarFuncion);
router.put('/sp/cambiar-estado-entrada', controller.spCambiarEstadoEntrada);
router.post('/sp/comprar-entrada', controller.spComprarEntrada);
router.post('/sp/vender-producto-dulceria', controller.spVenderProductoDulceria);
router.post('/sp/procesar-factura-completa', controller.spProcesarFacturaCompleta);

module.exports = router;

