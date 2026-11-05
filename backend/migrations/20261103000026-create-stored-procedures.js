'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. InsertarFuncion: Valida que la película exista y que no haya solapamiento de horario en la misma sala
    await queryInterface.sequelize.query('DROP PROCEDURE IF EXISTS InsertarFuncion;');
    await queryInterface.sequelize.query(`
      CREATE PROCEDURE InsertarFuncion(
        IN p_id_sala INT,
        IN p_id_pelicula INT,
        IN p_id_cartelera INT,
        IN p_fecha DATE,
        IN p_hora_inicio TIME,
        IN p_precio DECIMAL(10,2)
      )
      BEGIN
        DECLARE v_duracion INT;
        DECLARE v_hora_fin TIME;
        DECLARE v_conflictos INT DEFAULT 0;

        SELECT duracion INTO v_duracion
        FROM peliculas
        WHERE id_pelicula = p_id_pelicula
        LIMIT 1;

        IF v_duracion IS NULL THEN
          SIGNAL SQLSTATE '45000'
          SET MESSAGE_TEXT = 'Error: La pelicula especificada no existe.';
        END IF;

        SET v_hora_fin = ADDTIME(p_hora_inicio, SEC_TO_TIME(v_duracion * 60));

        SELECT COUNT(*) INTO v_conflictos
        FROM funciones f
        INNER JOIN peliculas p ON f.id_pelicula = p.id_pelicula
        WHERE f.id_sala = p_id_sala
          AND f.fecha = p_fecha
          AND p_hora_inicio < ADDTIME(f.hora_inicio, SEC_TO_TIME(p.duracion * 60))
          AND v_hora_fin > f.hora_inicio;

        IF v_conflictos > 0 THEN
          SIGNAL SQLSTATE '45000'
          SET MESSAGE_TEXT = 'Error: La funcion se solapa en horario con otra funcion programada en la misma sala.';
        END IF;

        INSERT INTO funciones (id_sala, id_pelicula, id_cartelera, fecha, hora_inicio, precio, createdAt, updatedAt)
        VALUES (p_id_sala, p_id_pelicula, p_id_cartelera, p_fecha, p_hora_inicio, p_precio, NOW(), NOW());
      END
    `);

    // 2. CambiarEstadoEntrada: Actualiza el estado ('valida', 'usada', 'cancelada') de una entrada
    await queryInterface.sequelize.query('DROP PROCEDURE IF EXISTS CambiarEstadoEntrada;');
    await queryInterface.sequelize.query(`
      CREATE PROCEDURE CambiarEstadoEntrada(
        IN p_id_entrada INT,
        IN p_nuevo_estado VARCHAR(20)
      )
      BEGIN
        DECLARE v_existe INT DEFAULT 0;

        IF p_nuevo_estado NOT IN ('valida', 'usada', 'cancelada') THEN
          SIGNAL SQLSTATE '45000'
          SET MESSAGE_TEXT = 'Error: Estado de entrada no valido. Valores permitidos: valida, usada, cancelada.';
        END IF;

        SELECT COUNT(*) INTO v_existe
        FROM entradas
        WHERE id_entrada = p_id_entrada;

        IF v_existe = 0 THEN
          SIGNAL SQLSTATE '45000'
          SET MESSAGE_TEXT = 'Error: La entrada especificada no existe.';
        END IF;

        UPDATE entradas
        SET estado = p_nuevo_estado,
            updatedAt = NOW()
        WHERE id_entrada = p_id_entrada;
      END
    `);

    // 3. ComprarEntrada: Procedimiento transaccional con bloqueo FOR UPDATE para verificar disponibilidad de asiento
    await queryInterface.sequelize.query('DROP PROCEDURE IF EXISTS ComprarEntrada;');
    await queryInterface.sequelize.query(`
      CREATE PROCEDURE ComprarEntrada(
        IN p_id_factura INT,
        IN p_id_funcion INT,
        IN p_id_asiento INT,
        IN p_precio_pagado DECIMAL(10,2)
      )
      BEGIN
        DECLARE v_ocupado INT DEFAULT 0;
        DECLARE v_asiento_valido INT DEFAULT 0;

        DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
          ROLLBACK;
          RESIGNAL;
        END;

        START TRANSACTION;

        SELECT COUNT(*) INTO v_asiento_valido
        FROM funciones f
        INNER JOIN asientos a ON f.id_sala = a.id_sala
        WHERE f.id_funcion = p_id_funcion
          AND a.id_asiento = p_id_asiento
        FOR UPDATE;

        IF v_asiento_valido = 0 THEN
          SIGNAL SQLSTATE '45000'
          SET MESSAGE_TEXT = 'Error: El asiento no pertenece a la sala de la funcion indicada.';
        END IF;

        SELECT COUNT(*) INTO v_ocupado
        FROM entradas
        WHERE id_funcion = p_id_funcion
          AND id_asiento = p_id_asiento
          AND estado IN ('valida', 'usada')
        FOR UPDATE;

        IF v_ocupado > 0 THEN
          SIGNAL SQLSTATE '45000'
          SET MESSAGE_TEXT = 'Error: El asiento seleccionado ya se encuentra ocupado para esta funcion.';
        END IF;

        INSERT INTO entradas (id_factura, id_funcion, id_asiento, precio_pagado, estado, createdAt, updatedAt)
        VALUES (p_id_factura, p_id_funcion, p_id_asiento, p_precio_pagado, 'valida', NOW(), NOW());

        COMMIT;
      END
    `);

    // 4. VenderProductoDulceria: Transaccional que valida stock, descuenta inventario e inserta en detalles_ventas_dulceria
    await queryInterface.sequelize.query('DROP PROCEDURE IF EXISTS VenderProductoDulceria;');
    await queryInterface.sequelize.query(`
      CREATE PROCEDURE VenderProductoDulceria(
        IN p_id_factura INT,
        IN p_id_producto INT,
        IN p_cantidad INT
      )
      BEGIN
        DECLARE v_stock INT;
        DECLARE v_precio DECIMAL(10,2);
        DECLARE v_subtotal DECIMAL(10,2);

        DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
          ROLLBACK;
          RESIGNAL;
        END;

        IF p_cantidad <= 0 THEN
          SIGNAL SQLSTATE '45000'
          SET MESSAGE_TEXT = 'Error: La cantidad debe ser mayor a cero.';
        END IF;

        START TRANSACTION;

        SELECT stock, precio INTO v_stock, v_precio
        FROM productos
        WHERE id_producto = p_id_producto
        FOR UPDATE;

        IF v_precio IS NULL THEN
          SIGNAL SQLSTATE '45000'
          SET MESSAGE_TEXT = 'Error: El producto especificado no existe.';
        END IF;

        IF v_stock < p_cantidad THEN
          SIGNAL SQLSTATE '45000'
          SET MESSAGE_TEXT = 'Error: Stock insuficiente en dulceria para realizar la venta.';
        END IF;

        SET v_subtotal = v_precio * p_cantidad;

        UPDATE productos
        SET stock = stock - p_cantidad,
            updatedAt = NOW()
        WHERE id_producto = p_id_producto;

        INSERT INTO detalles_ventas_dulceria (id_factura, id_producto, id_combo, cantidad, subtotal, createdAt, updatedAt)
        VALUES (p_id_factura, p_id_producto, NULL, p_cantidad, v_subtotal, NOW(), NOW());

        COMMIT;
      END
    `);

    // 5. ProcesarFacturaCompleta: Valida cupón, calcula descuentos, genera factura y registra transacción de pago
    await queryInterface.sequelize.query('DROP PROCEDURE IF EXISTS ProcesarFacturaCompleta;');
    await queryInterface.sequelize.query(`
      CREATE PROCEDURE ProcesarFacturaCompleta(
        IN p_id_usuario INT,
        IN p_codigo_cupon VARCHAR(50),
        IN p_numero_factura VARCHAR(50),
        IN p_subtotal DECIMAL(10,2),
        IN p_id_metodo_pago INT,
        IN p_referencia_bancaria VARCHAR(255)
      )
      BEGIN
        DECLARE v_id_cupon INT DEFAULT NULL;
        DECLARE v_porcentaje DECIMAL(5,2) DEFAULT 0.00;
        DECLARE v_fecha_vencimiento DATE;
        DECLARE v_activo TINYINT(1);
        DECLARE v_descuento DECIMAL(10,2) DEFAULT 0.00;
        DECLARE v_total DECIMAL(10,2);
        DECLARE v_id_factura INT;

        DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
          ROLLBACK;
          RESIGNAL;
        END;

        START TRANSACTION;

        IF p_codigo_cupon IS NOT NULL AND TRIM(p_codigo_cupon) <> '' THEN
          SELECT id_cupon, porcentaje_descuento, fecha_vencimiento, activo
          INTO v_id_cupon, v_porcentaje, v_fecha_vencimiento, v_activo
          FROM cupones
          WHERE codigo = p_codigo_cupon
          FOR UPDATE;

          IF v_id_cupon IS NULL THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Error: El cupon ingresado no existe.';
          END IF;

          IF v_activo = 0 OR v_fecha_vencimiento < CURDATE() THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Error: El cupon ingresado se encuentra inactivo o vencido.';
          END IF;

          SET v_descuento = ROUND(p_subtotal * (v_porcentaje / 100), 2);
        END IF;

        SET v_total = p_subtotal - v_descuento;

        INSERT INTO facturas (
          id_usuario,
          id_cupon,
          numero_factura,
          subtotal,
          descuento,
          total,
          fecha_emision,
          createdAt,
          updatedAt
        ) VALUES (
          p_id_usuario,
          v_id_cupon,
          p_numero_factura,
          p_subtotal,
          v_descuento,
          v_total,
          NOW(),
          NOW(),
          NOW()
        );

        SET v_id_factura = LAST_INSERT_ID();

        INSERT INTO transacciones_pago (
          id_factura,
          id_metodo_pago,
          monto,
          estado,
          referencia_bancaria,
          createdAt,
          updatedAt
        ) VALUES (
          v_id_factura,
          p_id_metodo_pago,
          v_total,
          'completado',
          p_referencia_bancaria,
          NOW(),
          NOW()
        );

        COMMIT;
      END
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('DROP PROCEDURE IF EXISTS ProcesarFacturaCompleta;');
    await queryInterface.sequelize.query('DROP PROCEDURE IF EXISTS VenderProductoDulceria;');
    await queryInterface.sequelize.query('DROP PROCEDURE IF EXISTS ComprarEntrada;');
    await queryInterface.sequelize.query('DROP PROCEDURE IF EXISTS CambiarEstadoEntrada;');
    await queryInterface.sequelize.query('DROP PROCEDURE IF EXISTS InsertarFuncion;');
  }
};

