import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de peticiones para inyectar token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cineda_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuestas para extraer datos o forzar redirección al login en 401
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cineda_token');
      if (
        typeof window !== 'undefined' &&
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/registro'
      ) {
        window.location.href = '/login';
      }
    }

    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Error en la petición al servidor';
    return Promise.reject(new Error(message));
  }
);

/**
 * Servicio oficial de Autenticación
 */
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
};

/**
 * Fábrica genérica de servicios CRUD para cada entidad REST
 */
export const createCrudService = (endpoint) => ({
  getAll: (params) => api.get(endpoint, { params }),
  getById: (id) => api.get(`${endpoint}/${id}`),
  create: (data) => api.post(endpoint, data),
  update: (id, data) => api.put(`${endpoint}/${id}`, data),
  patch: (id, data) => api.patch(`${endpoint}/${id}`, data),
  delete: (id) => api.delete(`${endpoint}/${id}`),
});

// ==========================================
// CAPA 1: Tablas Maestras Independientes (9)
// ==========================================
export const usuariosService = createCrudService('/usuarios');
export const cinesService = createCrudService('/cines');
export const tiposalasService = createCrudService('/tipo-salas');
export const directoresService = createCrudService('/directores');
export const categoriasProductosService = createCrudService('/categorias-productos');
export const combosService = createCrudService('/combos');
export const cuponesService = createCrudService('/cupones');
export const metodosPagoService = createCrudService('/metodos-pago');
export const cargosService = createCrudService('/cargos');

// ==========================================
// CAPA 2: Primer Nivel Relacional (7)
// ==========================================
export const peliculasService = createCrudService('/peliculas');
export const salasService = createCrudService('/salas');
export const productosService = createCrudService('/productos');
export const comboDetallesService = createCrudService('/combo-detalles');
export const empleadosService = createCrudService('/empleados');
export const facturasService = createCrudService('/facturas');
export const calificacionesService = createCrudService('/calificaciones');

// ==========================================
// CAPA 3: Operativo y Financiero (5)
// ==========================================
export const cartelerasService = createCrudService('/carteleras');
export const asientosService = createCrudService('/asientos');
export const transaccionesPagoService = createCrudService('/transacciones-pago');
export const registrosLimpiezaService = createCrudService('/registros-limpieza');
export const mantenimientosSalaService = createCrudService('/mantenimientos-sala');

// ==========================================
// CAPA 4: Transacciones Finales de Cine y Venta (3)
// ==========================================
export const funcionesService = createCrudService('/funciones');
export const detallesVentasDulceriaService = createCrudService('/detalles-ventas-dulceria');
export const entradasService = createCrudService('/entradas');

// Alias de retrocompatibilidad
export const categoriasService = categoriasProductosService;

// Mapa de servicios indexado por la clave canónica de ruta
export const entitiesServices = {
  // Capa 1
  usuarios: usuariosService,
  cines: cinesService,
  'tipo-salas': tiposalasService,
  directores: directoresService,
  'categorias-productos': categoriasProductosService,
  combos: combosService,
  cupones: cuponesService,
  'metodos-pago': metodosPagoService,
  cargos: cargosService,

  // Capa 2
  peliculas: peliculasService,
  salas: salasService,
  productos: productosService,
  'combo-detalles': comboDetallesService,
  empleados: empleadosService,
  facturas: facturasService,
  calificaciones: calificacionesService,

  // Capa 3
  carteleras: cartelerasService,
  asientos: asientosService,
  'transacciones-pago': transaccionesPagoService,
  'registros-limpieza': registrosLimpiezaService,
  'mantenimientos-sala': mantenimientosSalaService,

  // Capa 4
  funciones: funcionesService,
  'detalles-ventas-dulceria': detallesVentasDulceriaService,
  entradas: entradasService,
};

// ==========================================
// SERVICIOS DE INTELIGENCIA ARTIFICIAL (IA)
// ==========================================
export const aiService = {
  getReporte: () => api.get('/ai/reporte'),
  generarPelicula: (titulo) => api.post('/ai/pelicula', { titulo }),
  preguntarCopilot: (pregunta) => api.post('/ai/copilot', { pregunta }),
};

export const getReporte = aiService.getReporte;
export const generarPelicula = aiService.generarPelicula;
export const preguntarCopilot = aiService.preguntarCopilot;

export default api;
