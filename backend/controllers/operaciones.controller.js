'use strict';
const { sequelize, Sequelize } = require('../models');

module.exports = {
  // ================= VISTAS SQL =================
  async getVistaFuncionesPeliculas(req, res) {
    try {
      const data = await sequelize.query('SELECT * FROM vista_funciones_peliculas', {
        type: Sequelize.QueryTypes.SELECT
      });
      return res.status(200).json({
        success: true,
        message: 'Vista vista_funciones_peliculas consultada exitosamente',
        data
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async getVistaEntradasDisponibles(req, res) {
    try {
      const { id_funcion } = req.query;
      const sql = id_funcion
        ? 'SELECT * FROM vista_entradas_disponibles WHERE id_funcion = :id_funcion'
        : 'SELECT * FROM vista_entradas_disponibles';
      const data = await sequelize.query(sql, {
        replacements: { id_funcion },
        type: Sequelize.QueryTypes.SELECT
      });
      return res.status(200).json({
        success: true,
        message: 'Vista vista_entradas_disponibles consultada exitosamente',
        data
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async getVistaFacturasConsolidadas(req, res) {
    try {
      const data = await sequelize.query('SELECT * FROM vista_facturas_consolidadas', {
        type: Sequelize.QueryTypes.SELECT
      });
      return res.status(200).json({
        success: true,
        message: 'Vista vista_facturas_consolidadas consultada exitosamente',
        data
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async getVistaCatalogoDulceria(req, res) {
    try {
      const data = await sequelize.query('SELECT * FROM vista_catalogo_dulceria', {
        type: Sequelize.QueryTypes.SELECT
      });
      return res.status(200).json({
        success: true,
        message: 'Vista vista_catalogo_dulceria consultada exitosamente',
        data
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async getVistaEstadoSalas(req, res) {
    try {
      const data = await sequelize.query('SELECT * FROM vista_estado_salas', {
        type: Sequelize.QueryTypes.SELECT
      });
      return res.status(200).json({
        success: true,
        message: 'Vista vista_estado_salas consultada exitosamente',
        data
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // ================= STORED PROCEDURES =================
  async spInsertarFuncion(req, res) {
    try {
      const { id_sala, id_pelicula, id_cartelera, fecha, hora_inicio, precio } = req.body;
      await sequelize.query(
        'CALL InsertarFuncion(:id_sala, :id_pelicula, :id_cartelera, :fecha, :hora_inicio, :precio)',
        {
          replacements: { id_sala, id_pelicula, id_cartelera, fecha, hora_inicio, precio }
        }
      );
      return res.status(201).json({
        success: true,
        message: 'Función insertada mediante Stored Procedure InsertarFuncion',
        data: req.body
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  async spCambiarEstadoEntrada(req, res) {
    try {
      const { id_entrada, nuevo_estado } = req.body;
      await sequelize.query('CALL CambiarEstadoEntrada(:id_entrada, :nuevo_estado)', {
        replacements: { id_entrada, nuevo_estado }
      });
      return res.status(200).json({
        success: true,
        message: 'Estado de entrada actualizado mediante CambiarEstadoEntrada',
        data: { id_entrada, nuevo_estado }
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  async spComprarEntrada(req, res) {
    try {
      const { id_factura, id_funcion, id_asiento, precio_pagado } = req.body;
      await sequelize.query(
        'CALL ComprarEntrada(:id_factura, :id_funcion, :id_asiento, :precio_pagado)',
        {
          replacements: { id_factura, id_funcion, id_asiento, precio_pagado }
        }
      );
      return res.status(201).json({
        success: true,
        message: 'Entrada comprada exitosamente mediante ComprarEntrada',
        data: req.body
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  async spVenderProductoDulceria(req, res) {
    try {
      const { id_factura, id_producto, cantidad } = req.body;
      await sequelize.query(
        'CALL VenderProductoDulceria(:id_factura, :id_producto, :cantidad)',
        {
          replacements: { id_factura, id_producto, cantidad }
        }
      );
      return res.status(201).json({
        success: true,
        message: 'Venta de dulcería registrada mediante VenderProductoDulceria',
        data: req.body
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  async spProcesarFacturaCompleta(req, res) {
    try {
      const {
        id_usuario,
        codigo_cupon = null,
        numero_factura,
        subtotal,
        id_metodo_pago,
        referencia_bancaria = null
      } = req.body;
      await sequelize.query(
        'CALL ProcesarFacturaCompleta(:id_usuario, :codigo_cupon, :numero_factura, :subtotal, :id_metodo_pago, :referencia_bancaria)',
        {
          replacements: {
            id_usuario,
            codigo_cupon,
            numero_factura,
            subtotal,
            id_metodo_pago,
            referencia_bancaria
          }
        }
      );
      return res.status(201).json({
        success: true,
        message: 'Factura procesada mediante ProcesarFacturaCompleta',
        data: req.body
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
};
