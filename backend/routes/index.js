'use strict';
const express = require('express');
const router = express.Router();

// Ruta de bienvenida y catálogo de endpoints disponibles en /api
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenido a la API REST de CineDa',
    version: '1.0.0',
    modulos: {
      capa1_tablas_maestras: [
        '/api/usuarios',
        '/api/cines',
        '/api/tipo-salas',
        '/api/directores',
        '/api/categorias-productos',
        '/api/combos',
        '/api/cupones',
        '/api/metodos-pago',
        '/api/cargos'
      ],
      capa2_primer_nivel_relacional: [
        '/api/peliculas',
        '/api/salas',
        '/api/productos',
        '/api/combo-detalles',
        '/api/empleados',
        '/api/facturas',
        '/api/calificaciones'
      ],
      capa3_operativo_y_financiero: [
        '/api/carteleras',
        '/api/asientos',
        '/api/transacciones-pago',
        '/api/registros-limpieza',
        '/api/mantenimientos-sala'
      ],
      capa4_transacciones_finales: [
        '/api/funciones',
        '/api/detalles-ventas-dulceria',
        '/api/entradas'
      ],
      vistas_sql: [
        'GET /api/operaciones/vistas/funciones-peliculas',
        'GET /api/operaciones/vistas/entradas-disponibles(?id_funcion=)',
        'GET /api/operaciones/vistas/facturas-consolidadas',
        'GET /api/operaciones/vistas/catalogo-dulceria',
        'GET /api/operaciones/vistas/estado-salas'
      ],
      stored_procedures: [
        'POST /api/operaciones/sp/insertar-funcion',
        'PUT /api/operaciones/sp/cambiar-estado-entrada',
        'POST /api/operaciones/sp/comprar-entrada',
        'POST /api/operaciones/sp/vender-producto-dulceria',
        'POST /api/operaciones/sp/procesar-factura-completa'
      ]
    }
  });
});

// Capa 1: Tablas Maestras Independientes
router.use('/usuarios', require('./usuario.routes'));
router.use('/cines', require('./cine.routes'));
router.use('/tipo-salas', require('./tiposala.routes'));
router.use('/directores', require('./director.routes'));
router.use('/categorias-productos', require('./categoriaproducto.routes'));
router.use('/combos', require('./combo.routes'));
router.use('/cupones', require('./cupon.routes'));
router.use('/metodos-pago', require('./metodopago.routes'));
router.use('/cargos', require('./cargo.routes'));

// Capa 2: Primer Nivel Relacional
router.use('/peliculas', require('./pelicula.routes'));
router.use('/salas', require('./sala.routes'));
router.use('/productos', require('./producto.routes'));
router.use('/combo-detalles', require('./combodetalle.routes'));
router.use('/empleados', require('./empleado.routes'));
router.use('/facturas', require('./factura.routes'));
router.use('/calificaciones', require('./calificacion.routes'));

// Capa 3: Segundo Nivel Operativo y Financiero
router.use('/carteleras', require('./cartelera.routes'));
router.use('/asientos', require('./asiento.routes'));
router.use('/transacciones-pago', require('./transaccionpago.routes'));
router.use('/registros-limpieza', require('./registrolimpieza.routes'));
router.use('/mantenimientos-sala', require('./mantenimientosala.routes'));

// Capa 4: Transacciones Finales de Cine y Venta
router.use('/funciones', require('./funcion.routes'));
router.use('/detalles-ventas-dulceria', require('./detalleventadulceria.routes'));
router.use('/entradas', require('./entrada.routes'));

// Vistas y Procedimientos Almacenados
router.use('/operaciones', require('./operaciones.routes'));

// Rutas de Inteligencia Artificial (IA)
router.use('/ai', require('./aiRoutes'));

module.exports = router;

