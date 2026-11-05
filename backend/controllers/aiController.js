'use strict';
const { generarReporteGerencial } = require('../services/aiReporteService');
const { autocompletarFichaPelicula } = require('../services/aiPeliculaService');
const { consultarCopilot } = require('../services/aiCopilotService');

// GET /api/ai/reporte
const getReporte = async (req, res) => {
  try {
    const reporte = await generarReporteGerencial();
    return res.status(200).json({
      success: true,
      reporte,
      data: reporte
    });
  } catch (error) {
    console.error('Error en getReporte AI:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error al generar reporte gerencial con IA'
    });
  }
};

// POST /api/ai/pelicula
const postPelicula = async (req, res) => {
  try {
    const { titulo } = req.body;
    if (!titulo || typeof titulo !== 'string' || !titulo.trim()) {
      return res.status(400).json({
        success: false,
        error: 'El campo "titulo" es obligatorio'
      });
    }

    const pelicula = await autocompletarFichaPelicula(titulo.trim());
    return res.status(200).json({
      success: true,
      pelicula,
      data: pelicula
    });
  } catch (error) {
    console.error('Error en postPelicula AI:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error al autocompletar ficha de película con IA'
    });
  }
};

// POST /api/ai/copilot
const postCopilot = async (req, res) => {
  try {
    const pregunta = req.body.pregunta || req.body.preguntaUsuario || req.body.message || req.body.prompt;
    if (!pregunta || typeof pregunta !== 'string' || !pregunta.trim()) {
      return res.status(400).json({
        success: false,
        error: 'El campo "pregunta" es obligatorio'
      });
    }

    const respuesta = await consultarCopilot(pregunta.trim());
    return res.status(200).json({
      success: true,
      respuesta,
      data: respuesta
    });
  } catch (error) {
    console.error('Error en postCopilot AI:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error al consultar al copiloto de CineDa'
    });
  }
};

module.exports = {
  getReporte,
  postPelicula,
  postCopilot
};

