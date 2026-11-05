// backend/services/aiReporteService.js
const { Pelicula, Factura, Sala, Entrada } = require('../models');

async function generarReporteGerencial() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error('DEEPSEEK_API_KEY no encontrada en .env');

  const [totalPeliculas, totalSalas, totalEntradas, ultimasFacturas] = await Promise.all([
    Pelicula.count(),
    Sala.count(),
    Entrada.count(),
    Factura.findAll({ limit: 10, order: [['fecha_emision', 'DESC']] })
  ]);

  const metricas = {
    totalPeliculas,
    totalSalas,
    totalEntradas,
    muestreoFacturas: ultimasFacturas.map(f => ({ id: f.id_factura, total: f.total }))
  };

  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'Eres el Director de Inteligencia de Negocios de CineDa. Genera informes gerenciales ejecutivos estructurados en Markdown profesional, analizando con rigor métricas de rendimiento, ingresos, asistencia y recomendaciones estratégicas para la gerencia.'
        },
        {
          role: 'user',
          content: `Analiza estos datos operativos reales de CineDa:\n${JSON.stringify(metricas, null, 2)}\n\nGenera un informe gerencial estructurado en Markdown con:\n1. Resumen de Rendimiento\n2. Evaluación de Ingresos y Asistencia\n3. Recomendaciones Operativas para la Gerencia.`
        }
      ],
      temperature: 0.7
    })
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message || 'Error en la API de DeepSeek');
  }

  return data.choices?.[0]?.message?.content || 'No se pudo generar el reporte.';
}

module.exports = { generarReporteGerencial };
