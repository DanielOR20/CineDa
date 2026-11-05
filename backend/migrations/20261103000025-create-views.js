'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. vista_funciones_peliculas: Cruce entre funciones, películas, directores, salas, tipo_salas y cines
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE VIEW vista_funciones_peliculas AS
      SELECT
        f.id_funcion,
        f.fecha,
        f.hora_inicio,
        f.precio AS precio_funcion,
        p.id_pelicula,
        p.titulo AS pelicula,
        p.genero,
        p.duracion AS duracion_minutos,
        p.clasificacion,
        d.id_director,
        d.nombre AS director,
        s.id_sala,
        s.numero_sala,
        s.capacidad AS capacidad_sala,
        ts.id_tiposala,
        ts.nombre_tipo AS tipo_sala,
        ts.precio_base AS precio_base_sala,
        c.id_cine,
        c.nombre AS cine,
        c.ubicacion AS ubicacion_cine
      FROM funciones f
      INNER JOIN peliculas p ON f.id_pelicula = p.id_pelicula
      LEFT JOIN directores d ON p.id_director = d.id_director
      INNER JOIN salas s ON f.id_sala = s.id_sala
      INNER JOIN tipo_salas ts ON s.id_tiposala = ts.id_tiposala
      INNER JOIN cines c ON s.id_cine = c.id_cine;
    `);

    // 2. vista_entradas_disponibles: Disponibilidad asiento por asiento para cada función
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE VIEW vista_entradas_disponibles AS
      SELECT
        f.id_funcion,
        f.fecha,
        f.hora_inicio,
        p.titulo AS pelicula,
        s.id_sala,
        s.numero_sala,
        a.id_asiento,
        a.fila,
        a.numero AS numero_asiento,
        a.tipo AS tipo_asiento,
        CASE
          WHEN e.id_entrada IS NOT NULL THEN 'OCUPADO'
          ELSE 'DISPONIBLE'
        END AS disponibilidad,
        e.id_entrada,
        e.estado AS estado_entrada
      FROM funciones f
      INNER JOIN peliculas p ON f.id_pelicula = p.id_pelicula
      INNER JOIN salas s ON f.id_sala = s.id_sala
      INNER JOIN asientos a ON s.id_sala = a.id_sala
      LEFT JOIN entradas e
        ON e.id_funcion = f.id_funcion
        AND e.id_asiento = a.id_asiento
        AND e.estado IN ('valida', 'usada');
    `);

    // 3. vista_facturas_consolidadas: Agrupación de facturas con usuario, cupón, totales y suma de pagos
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE VIEW vista_facturas_consolidadas AS
      SELECT
        fa.id_factura,
        fa.numero_factura,
        fa.fecha_emision,
        u.id_usuario,
        u.nombre AS cliente,
        u.email AS email_cliente,
        cu.id_cupon,
        cu.codigo AS codigo_cupon,
        COALESCE(cu.porcentaje_descuento, 0.00) AS porcentaje_descuento,
        fa.subtotal,
        fa.descuento,
        fa.total,
        COALESCE(SUM(CASE WHEN tp.estado = 'completado' THEN tp.monto ELSE 0 END), 0.00) AS total_pagado,
        COUNT(tp.id_transaccion) AS cantidad_transacciones
      FROM facturas fa
      INNER JOIN usuarios u ON fa.id_usuario = u.id_usuario
      LEFT JOIN cupones cu ON fa.id_cupon = cu.id_cupon
      LEFT JOIN transacciones_pago tp ON fa.id_factura = tp.id_factura
      GROUP BY
        fa.id_factura,
        fa.numero_factura,
        fa.fecha_emision,
        u.id_usuario,
        u.nombre,
        u.email,
        cu.id_cupon,
        cu.codigo,
        cu.porcentaje_descuento,
        fa.subtotal,
        fa.descuento,
        fa.total;
    `);

    // 4. vista_catalogo_dulceria: Listado de productos con su categoría y estado de inventario
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE VIEW vista_catalogo_dulceria AS
      SELECT
        pr.id_producto,
        pr.nombre AS producto,
        pr.precio,
        pr.stock,
        cp.id_categoria,
        cp.nombre AS categoria,
        cp.descripcion AS descripcion_categoria,
        CASE
          WHEN pr.stock <= 5 THEN 'STOCK CRÍTICO'
          WHEN pr.stock <= 20 THEN 'STOCK BAJO'
          ELSE 'EN STOCK'
        END AS estado_inventario
      FROM productos pr
      INNER JOIN categorias_productos cp ON pr.id_categoria = cp.id_categoria;
    `);

    // 5. vista_estado_salas: Resumen por sala con tipo, capacidad, conteo de mantenimientos y última limpieza completada
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE VIEW vista_estado_salas AS
      SELECT
        s.id_sala,
        s.numero_sala,
        s.capacidad,
        c.id_cine,
        c.nombre AS cine,
        ts.id_tiposala,
        ts.nombre_tipo AS tipo_sala,
        COUNT(DISTINCT ms.id_mantenimiento) AS total_mantenimientos,
        MAX(CASE WHEN rl.estado = 'completada' THEN rl.fecha_hora ELSE NULL END) AS ultima_limpieza_completada
      FROM salas s
      INNER JOIN cines c ON s.id_cine = c.id_cine
      INNER JOIN tipo_salas ts ON s.id_tiposala = ts.id_tiposala
      LEFT JOIN mantenimientos_sala ms ON s.id_sala = ms.id_sala
      LEFT JOIN registros_limpieza rl ON s.id_sala = rl.id_sala
      GROUP BY
        s.id_sala,
        s.numero_sala,
        s.capacidad,
        c.id_cine,
        c.nombre,
        ts.id_tiposala,
        ts.nombre_tipo;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('DROP VIEW IF EXISTS vista_estado_salas;');
    await queryInterface.sequelize.query('DROP VIEW IF EXISTS vista_catalogo_dulceria;');
    await queryInterface.sequelize.query('DROP VIEW IF EXISTS vista_facturas_consolidadas;');
    await queryInterface.sequelize.query('DROP VIEW IF EXISTS vista_entradas_disponibles;');
    await queryInterface.sequelize.query('DROP VIEW IF EXISTS vista_funciones_peliculas;');
  }
};

