'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const apiRoutes = require('./routes');
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de CORS
app.use(cors());

// Middleware de registro básico de peticiones (Logger)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Parseo de cuerpo JSON y URL Encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta raíz informativa
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor Express de CineDa en funcionamiento',
    endpointsBase: '/api',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// Rutas de autenticación pública (/api/auth/register, /api/auth/login) y protegida (/api/auth/me)
app.use('/api/auth', authRoutes);

// Rutas de Inteligencia Artificial de CineDa (Reporte, Películas, Copilot) protegidas con authMiddleware
app.use('/api/ai', authMiddleware, aiRoutes);

// Proteger globalmente todas las demás rutas de la API con authMiddleware
app.use('/api', authMiddleware, apiRoutes);

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});

// Middleware centralizado de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);
  res.status(err.status || 500).json({
    success: false,
    data: null,
    message: err.message || 'Error interno del servidor'
  });
});

// Inicialización del servidor HTTP y verificación de conexión a la base de datos
if (require.main === module) {
  app.listen(PORT, async () => {
    console.log(`====================================================`);
    console.log(`🎬 Servidor CineDa ejecutándose en: http://localhost:${PORT}`);
    console.log(`📡 Endpoints base disponibles en: http://localhost:${PORT}/api`);
    console.log(`====================================================`);
    try {
      await sequelize.authenticate();
      console.log('✅ Conexión a la base de datos MySQL establecida exitosamente.');
    } catch (error) {
      console.warn('⚠️  Aviso: No se pudo conectar a MySQL:', error.message);
      console.warn('    Asegúrate de que el servicio MySQL esté corriendo.');
    }
  });
}

module.exports = app;

