// backend/services/aiCopilotService.js
const { Pelicula, Cupon, Funcion, Sala, Asiento, Cine } = require('../models');

async function consultarCopilot(preguntaUsuario) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error('DEEPSEEK_API_KEY no encontrada en .env');

  // 1. Consulta consolidada de datos operativos en paralelo
  const [cupones, funciones, salas] = await Promise.all([
    // Cupones activos vigentes
    Cupon.findAll({
      where: { activo: true },
      attributes: ['id_cupon', 'codigo', 'porcentaje_descuento', 'fecha_vencimiento'],
      limit: 10
    }),
    // Funciones activas con película, sala y asientos asociados
    Funcion.findAll({
      include: [
        {
          model: Pelicula,
          as: 'pelicula',
          attributes: ['id_pelicula', 'titulo', 'clasificacion', 'duracion']
        },
        {
          model: Sala,
          as: 'sala',
          attributes: ['id_sala', 'numero_sala', 'capacidad'],
          include: [
            {
              model: Asiento,
              as: 'asientos',
              attributes: ['tipo', 'numero', 'fila']
            },
            {
              model: Cine,
              as: 'cine',
              attributes: ['nombre']
            }
          ]
        }
      ],
      order: [['fecha', 'ASC'], ['hora_inicio', 'ASC']],
      limit: 20
    }),
    // Catálogo de salas con auditoría de asientos accesibles
    Sala.findAll({
      attributes: ['id_sala', 'numero_sala', 'capacidad'],
      include: [
        {
          model: Cine,
          as: 'cine',
          attributes: ['nombre']
        },
        {
          model: Asiento,
          as: 'asientos',
          attributes: ['tipo', 'numero', 'fila']
        }
      ],
      limit: 15
    })
  ]);

  // 2. Procesamiento y estructuración del contexto

  // Cupones estructurados
  const cuponesActivos = cupones.map(c => ({
    codigo: c.codigo,
    descuento: `${c.porcentaje_descuento}%`,
    vencimiento: c.fecha_vencimiento
  }));

  // Funciones con detalles de película, horario y butacas accesibles
  const funcionesActivas = funciones.map(f => {
    const sala = f.sala;
    const asientos = sala?.asientos || [];
    const asientosDiscapacitados = asientos.filter(
      a => (a.tipo || '').toLowerCase() === 'discapacitado' || (a.tipo || '').toLowerCase().includes('discapacid')
    );
    const asientosVip = asientos.filter(a => (a.tipo || '').toLowerCase() === 'vip');
    const asientosEstandar = asientos.filter(
      a => (a.tipo || '').toLowerCase() === 'estandar' || (a.tipo || '').toLowerCase() === 'estándar'
    );

    return {
      id_funcion: f.id_funcion,
      pelicula: f.pelicula
        ? `${f.pelicula.titulo} [${f.pelicula.clasificacion}, ${f.pelicula.duracion} min]`
        : 'Sin película asignada',
      sala: sala ? `Sala ${sala.numero_sala}${sala.cine ? ' (' + sala.cine.nombre + ')' : ''}` : 'N/A',
      fecha: f.fecha,
      hora: f.hora_inicio,
      precio: f.precio,
      capacidad_sala: sala?.capacidad || 0,
      asientos_discapacitados: {
        cantidad: asientosDiscapacitados.length,
        ubicaciones: asientosDiscapacitados.map(a => `${a.fila}${a.numero}`)
      },
      distribucion_asientos: {
        total: asientos.length,
        estandar: asientosEstandar.length,
        vip: asientosVip.length,
        discapacitados: asientosDiscapacitados.length
      }
    };
  });

  // Resumen específico de salas y disponibilidad para personas con discapacidad
  const salasAccesibilidad = salas.map(s => {
    const asientos = s.asientos || [];
    const asientosDiscapacitados = asientos.filter(
      a => (a.tipo || '').toLowerCase() === 'discapacitado' || (a.tipo || '').toLowerCase().includes('discapacid')
    );
    const asientosVip = asientos.filter(a => (a.tipo || '').toLowerCase() === 'vip');
    const asientosEstandar = asientos.filter(
      a => (a.tipo || '').toLowerCase() === 'estandar' || (a.tipo || '').toLowerCase() === 'estándar'
    );

    return {
      id_sala: s.id_sala,
      nombre_sala: `Sala ${s.numero_sala}${s.cine ? ' (' + s.cine.nombre + ')' : ''}`,
      capacidad_total: s.capacidad,
      asientos_discapacitados_accesibles: {
        cantidad: asientosDiscapacitados.length,
        butacas: asientosDiscapacitados.map(a => `Fila ${a.fila}, Butaca ${a.numero}`)
      },
      desglose: {
        total_asientos: asientos.length,
        estandar: asientosEstandar.length,
        vip: asientosVip.length,
        discapacitados: asientosDiscapacitados.length
      }
    };
  });

  const contexto = {
    cuponesVigentes: cuponesActivos,
    carteleraYFunciones: funcionesActivas,
    resumenSalasYAccesibilidadDiscapacitados: salasAccesibilidad
  };

  // 3. Envío a la API de DeepSeek
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
          content: 'Eres CineDa Copilot, el asistente inteligente oficial interno de operaciones, taquilla y servicio al cliente de la cadena CineDa. Tienes acceso a datos en tiempo real de películas en cartelera, horarios de funciones, salas de cine, cupones vigentes y disponibilidad explícita de asientos para personas con discapacidad o movilidad reducida. Responde con precisión, cortesía y claridad profesional en español basándote estrictamente en los datos del contexto provisto.'
        },
        {
          role: 'user',
          content: `Contexto operativo del cine:\n${JSON.stringify(contexto, null, 2)}\n\nPregunta: ${preguntaUsuario}`
        }
      ],
      temperature: 0.6
    })
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message || 'Error en la API de DeepSeek');
  }

  return data.choices?.[0]?.message?.content || 'Sin respuesta.';
}

module.exports = { consultarCopilot };
