'use strict';
const { TipoSala } = require('../models');

// GET ALL
const get = async (req, res) => {
  try {
    const data = await TipoSala.findAll();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET BY ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await TipoSala.findByPk(id);
    if (!data) return res.status(404).json({ success: false, message: 'No encontrado' });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST
const post = async (req, res) => {
  try {
    const data = await TipoSala.create(req.body);
    return res.status(201).json({ success: true, message: 'Creado exitosamente', data });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// PUT (Reemplazo total / actualización)
const put = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await TipoSala.findByPk(id);
    if (!item) return res.status(404).json({ success: false, message: 'No encontrado' });
    await item.update(req.body);
    return res.status(200).json({ success: true, message: 'Actualizado exitosamente', data: item });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// PATCH (Actualización parcial)
const patch = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await TipoSala.findByPk(id);
    if (!item) return res.status(404).json({ success: false, message: 'No encontrado' });
    await item.update(req.body);
    return res.status(200).json({ success: true, message: 'Modificado parcialmente con éxito', data: item });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE
const del = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await TipoSala.findByPk(id);
    if (!item) return res.status(404).json({ success: false, message: 'No encontrado' });
    await item.destroy();
    return res.status(200).json({ success: true, message: 'Eliminado exitosamente' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  get,
  getById,
  post,
  put,
  patch,
  delete: del
};
