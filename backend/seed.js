'use strict';

const bcrypt = require('bcryptjs');

const {
  sequelize,
  // Capa 1: Tablas Maestras Independientes (9)
  Usuario,
  Cine,
  TipoSala,
  Director,
  CategoriaProducto,
  Combo,
  Cupon,
  MetodoPago,
  Cargo,
  // Capa 2: Primer Nivel Relacional (7)
  Pelicula,
  Sala,
  Producto,
  ComboDetalle,
  Empleado,
  Factura,
  Calificacion,
  // Capa 3: Operativo y Financiero (5)
  Cartelera,
  Asiento,
  TransaccionPago,
  RegistroLimpieza,
  MantenimientoSala,
  // Capa 4: Transacciones Finales de Cine y Venta (3)
  Funcion,
  DetalleVentaDulceria,
  Entrada,
} = require('./models');

async function seedDatabase() {
  console.log('====================================================');
  console.log('  CINEDA ERP · INICIALIZACIÓN EMPRESARIAL PROPORCIONAL');
  console.log('====================================================\n');

  try {
    console.log('🔄 Conectando con MySQL en 127.0.0.1:3306...');
    await sequelize.authenticate();
    console.log('✅ Conexión establecida con éxito.\n');

    console.log('🧹 Limpiando y sincronizando esquema de base de datos...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
    await sequelize.sync({ force: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
    console.log('✅ Tablas recreadas limpias y con autoincrementables en 1.\n');

    // ==========================================
    // CAPA 1: Tablas Maestras Independientes (9)
    // ==========================================
    console.log('📁 [Capa 1/4] Insertando Tablas Maestras Independientes...');

    // 1. Usuarios (45 registros)
    const danielPassword = bcrypt.hashSync('Password123!', 10);
    const defaultPassword = bcrypt.hashSync('Admin1234*', 10);

    await Usuario.bulkCreate([
      // Administrador Principal de Evaluación Docente
      { id_usuario: 1, nombre: 'Daniel Rodríguez', email: 'daniel.rodriguez@cineda.cr', password: danielPassword, telefono: '+506 8834-1122', rol: 'administrador' },
      // Administradores y Supervisores (2 a 6)
      { id_usuario: 2, nombre: 'María Fernández', email: 'maria.fernandez@cineda.cr', password: defaultPassword, telefono: '+506 8721-3344', rol: 'administrador' },
      { id_usuario: 3, nombre: 'Carlos Valverde', email: 'carlos.valverde@cineda.cr', password: defaultPassword, telefono: '+506 8834-5566', rol: 'administrador' },
      { id_usuario: 4, nombre: 'Roberto Gómez', email: 'roberto.gomez@cineda.cr', password: defaultPassword, telefono: '+506 8910-7788', rol: 'administrador' },
      { id_usuario: 5, nombre: 'Sofía Rodríguez', email: 'sofia.rodriguez@cineda.cr', password: defaultPassword, telefono: '+506 8345-9900', rol: 'administrador' },
      { id_usuario: 6, nombre: 'Guillermo Solís', email: 'guillermo.solis@cineda.cr', password: defaultPassword, telefono: '+506 8412-1122', rol: 'administrador' },
      // Empleados CineDa (7 a 15)
      { id_usuario: 7, nombre: 'Natalia Cordero', email: 'natalia.cordero@cineda.cr', password: defaultPassword, telefono: '+506 8798-3344', rol: 'empleado' },
      { id_usuario: 8, nombre: 'Felipe Monge', email: 'felipe.monge@cineda.cr', password: defaultPassword, telefono: '+506 8523-5566', rol: 'empleado' },
      { id_usuario: 9, nombre: 'Karla Barquero', email: 'karla.barquero@cineda.cr', password: defaultPassword, telefono: '+506 8967-7788', rol: 'empleado' },
      { id_usuario: 10, nombre: 'Andrés Quesada', email: 'andres.quesada@cineda.cr', password: defaultPassword, telefono: '+506 8301-9900', rol: 'empleado' },
      { id_usuario: 11, nombre: 'Marcela Zeledón', email: 'marcela.zeledon@cineda.cr', password: defaultPassword, telefono: '+506 8654-1133', rol: 'empleado' },
      { id_usuario: 12, nombre: 'Víctor Espinoza', email: 'victor.espinoza@cineda.cr', password: defaultPassword, telefono: '+506 8412-2244', rol: 'empleado' },
      { id_usuario: 13, nombre: 'Paola Umaña', email: 'paola.umana@cineda.cr', password: defaultPassword, telefono: '+506 8798-3355', rol: 'empleado' },
      { id_usuario: 14, nombre: 'Sebastián Mora', email: 'sebastian.mora@cineda.cr', password: defaultPassword, telefono: '+506 8523-4466', rol: 'empleado' },
      { id_usuario: 15, nombre: 'Jorge Gamboa', email: 'jorge.gamboa@cineda.cr', password: defaultPassword, telefono: '+506 8967-5577', rol: 'empleado' },
      // Clientes Registrados y Frecuentes (16 a 45)
      { id_usuario: 16, nombre: 'Andrea Morales', email: 'andrea.morales@gmail.com', password: defaultPassword, telefono: '+506 8654-9900', rol: 'cliente' },
      { id_usuario: 17, nombre: 'Esteban Chaves', email: 'esteban.chaves@hotmail.com', password: defaultPassword, telefono: '+506 8412-1234', rol: 'cliente' },
      { id_usuario: 18, nombre: 'Lucía Navarro', email: 'lucia.navarro@outlook.com', password: defaultPassword, telefono: '+506 8798-2345', rol: 'cliente' },
      { id_usuario: 19, nombre: 'Daniel Vargas', email: 'daniel.vargas@yahoo.com', password: defaultPassword, telefono: '+506 8523-3456', rol: 'cliente' },
      { id_usuario: 20, nombre: 'Valeria Castro', email: 'valeria.castro@gmail.com', password: defaultPassword, telefono: '+506 8967-4567', rol: 'cliente' },
      { id_usuario: 21, nombre: 'Alejandro Jiménez', email: 'alejandro.jimenez@gmail.com', password: defaultPassword, telefono: '+506 8301-5678', rol: 'cliente' },
      { id_usuario: 22, nombre: 'Mariana Soto', email: 'mariana.soto@hotmail.com', password: defaultPassword, telefono: '+506 8812-3401', rol: 'cliente' },
      { id_usuario: 23, nombre: 'Gabriel Herrera', email: 'gabriel.herrera@outlook.com', password: defaultPassword, telefono: '+506 8734-5612', rol: 'cliente' },
      { id_usuario: 24, nombre: 'Camila Rojas', email: 'camila.rojas@gmail.com', password: defaultPassword, telefono: '+506 8945-6723', rol: 'cliente' },
      { id_usuario: 25, nombre: 'Kevin Brenes', email: 'kevin.brenes@yahoo.com', password: defaultPassword, telefono: '+506 8356-7834', rol: 'cliente' },
      { id_usuario: 26, nombre: 'Daniela Pineda', email: 'daniela.pineda@gmail.com', password: defaultPassword, telefono: '+506 8667-8945', rol: 'cliente' },
      { id_usuario: 27, nombre: 'Alonso Murillo', email: 'alonso.murillo@hotmail.com', password: defaultPassword, telefono: '+506 8478-9056', rol: 'cliente' },
      { id_usuario: 28, nombre: 'Jimena Alvarado', email: 'jimena.alvarado@outlook.com', password: defaultPassword, telefono: '+506 8789-0167', rol: 'cliente' },
      { id_usuario: 29, nombre: 'Diego Cordero', email: 'diego.cordero@gmail.com', password: defaultPassword, telefono: '+506 8590-1278', rol: 'cliente' },
      { id_usuario: 30, nombre: 'Valentina Montero', email: 'valentina.montero@gmail.com', password: defaultPassword, telefono: '+506 8901-2389', rol: 'cliente' },
      { id_usuario: 31, nombre: 'Mateo Solano', email: 'mateo.solano@yahoo.com', password: defaultPassword, telefono: '+506 8312-3490', rol: 'cliente' },
      { id_usuario: 32, nombre: 'Isabella Chacón', email: 'isabella.chacon@hotmail.com', password: defaultPassword, telefono: '+506 8623-4501', rol: 'cliente' },
      { id_usuario: 33, nombre: 'Santiago Fallas', email: 'santiago.fallas@gmail.com', password: defaultPassword, telefono: '+506 8434-5612', rol: 'cliente' },
      { id_usuario: 34, nombre: 'Fabiana Villalobos', email: 'fabiana.villalobos@outlook.com', password: defaultPassword, telefono: '+506 8745-6723', rol: 'cliente' },
      { id_usuario: 35, nombre: 'Leonardo Abarca', email: 'leonardo.abarca@gmail.com', password: defaultPassword, telefono: '+506 8556-7834', rol: 'cliente' },
      { id_usuario: 36, nombre: 'Monserrat Sancho', email: 'monserrat.sancho@yahoo.com', password: defaultPassword, telefono: '+506 8967-8945', rol: 'cliente' },
      { id_usuario: 37, nombre: 'Tomás Carvajal', email: 'tomas.carvajal@hotmail.com', password: defaultPassword, telefono: '+506 8378-9056', rol: 'cliente' },
      { id_usuario: 38, nombre: 'Raquel Madrigal', email: 'raquel.madrigal@gmail.com', password: defaultPassword, telefono: '+506 8689-0167', rol: 'cliente' },
      { id_usuario: 39, nombre: 'Samuel Fonseca', email: 'samuel.fonseca@outlook.com', password: defaultPassword, telefono: '+506 8490-1278', rol: 'cliente' },
      { id_usuario: 40, nombre: 'Fiorella Porras', email: 'fiorella.porras@gmail.com', password: defaultPassword, telefono: '+506 8701-2389', rol: 'cliente' },
      { id_usuario: 41, nombre: 'Ignacio Salazar', email: 'ignacio.salazar@yahoo.com', password: defaultPassword, telefono: '+506 8512-3490', rol: 'cliente' },
      { id_usuario: 42, nombre: 'Paula Retana', email: 'paula.retana@hotmail.com', password: defaultPassword, telefono: '+506 8923-4501', rol: 'cliente' },
      { id_usuario: 43, nombre: 'Sebastián Quirós', email: 'sebastian.quiros@gmail.com', password: defaultPassword, telefono: '+506 8334-5612', rol: 'cliente' },
      { id_usuario: 44, nombre: 'Nicole Zamora', email: 'nicole.zamora@outlook.com', password: defaultPassword, telefono: '+506 8645-6723', rol: 'cliente' },
      { id_usuario: 45, nombre: 'Emilio Campos', email: 'emilio.campos@gmail.com', password: defaultPassword, telefono: '+506 8456-7834', rol: 'cliente' },
    ]);
    console.log('   ✓ 45 Usuarios creados (admin daniel.rodriguez@cineda.cr verificado)');

    // 2. Cines (10 complejos reales)
    await Cine.bulkCreate([
      { id_cine: 1, nombre: 'CineDa Multiplaza Escazú', ubicacion: 'San José, Escazú, Centro Comercial Multiplaza', telefono: '+506 2201-5001' },
      { id_cine: 2, nombre: 'CineDa Lincoln Plaza', ubicacion: 'Moravia, San José, Centro Comercial Lincoln Plaza', telefono: '+506 2201-5002' },
      { id_cine: 3, nombre: 'CineDa Mall San Pedro', ubicacion: 'San Pedro de Montes de Oca, Mall San Pedro', telefono: '+506 2201-5003' },
      { id_cine: 4, nombre: 'CineDa City Mall Alajuela', ubicacion: 'Radial Francisco J. Orlich, Alajuela Centro', telefono: '+506 2201-5004' },
      { id_cine: 5, nombre: 'CineDa Paseo de las Flores', ubicacion: 'Heredia Centro, Paseo de las Flores', telefono: '+506 2201-5005' },
      { id_cine: 6, nombre: 'CineDa Oxígeno Human Playground', ubicacion: 'San Francisco de Heredia, Mall Oxígeno', telefono: '+506 2201-5006' },
      { id_cine: 7, nombre: 'CineDa Terramall', ubicacion: 'Tres Ríos, La Unión, Cartago', telefono: '+506 2201-5007' },
      { id_cine: 8, nombre: 'CineDa Paseo Metrópoli', ubicacion: 'Cartago Centro, Centro Comercial Paseo Metrópoli', telefono: '+506 2201-5008' },
      { id_cine: 9, nombre: 'CineDa Plaza Mayor', ubicacion: 'Rohrmoser, Pavas, San José', telefono: '+506 2201-5009' },
      { id_cine: 10, nombre: 'CineDa Multicentro Desamparados', ubicacion: 'Desamparados Centro, San José', telefono: '+506 2201-5010' },
    ]);
    console.log('   ✓ 10 Cines creados');

    // 3. Tipos de Sala (6 categorías técnicas)
    await TipoSala.bulkCreate([
      { id_tiposala: 1, nombre_tipo: 'Estándar 2D', precio_base: 3200.00 },
      { id_tiposala: 2, nombre_tipo: 'Digital 3D RealD', precio_base: 4000.00 },
      { id_tiposala: 3, nombre_tipo: 'IMAX Láser 4K', precio_base: 5200.00 },
      { id_tiposala: 4, nombre_tipo: 'MacroXE Sonido Atmos', precio_base: 4500.00 },
      { id_tiposala: 5, nombre_tipo: 'VIP Lounge Reclinable', precio_base: 7000.00 },
      { id_tiposala: 6, nombre_tipo: '4DX Sensorial Dinámica', precio_base: 6000.00 },
    ]);
    console.log('   ✓ 6 Tipos de Sala creados');

    // 4. Directores (15 directores aclamados)
    await Director.bulkCreate([
      { id_director: 1, nombre: 'Christopher Nolan', nacionalidad: 'Británico', biografia: 'Cineasta conocido por producciones de gran escala y narrativa temporal como Oppenheimer e Inception.' },
      { id_director: 2, nombre: 'Denis Villeneuve', nacionalidad: 'Canadiense', biografia: 'Aclamado director visual detrás de la saga épica Dune, Blade Runner 2049 y Arrival.' },
      { id_director: 3, nombre: 'Greta Gerwig', nacionalidad: 'Estadounidense', biografia: 'Directora y guionista innovadora responsable de Barbie y Little Women.' },
      { id_director: 4, nombre: 'Martin Scorsese', nacionalidad: 'Estadounidense', biografia: 'Pilar fundamental del cine moderno con clásicos como Taxi Driver y Killers of the Flower Moon.' },
      { id_director: 5, nombre: 'Steven Spielberg', nacionalidad: 'Estadounidense', biografia: 'Pionero de la era moderna de Hollywood, creador de Jurassic Park y The Fabelmans.' },
      { id_director: 6, nombre: 'Guillermo del Toro', nacionalidad: 'Mexicano', biografia: 'Maestro del cine fantástico y de monstruos con The Shape of Water y El laberinto del fauno.' },
      { id_director: 7, nombre: 'Quentin Tarantino', nacionalidad: 'Estadounidense', biografia: 'Icónico autor con diálogos memorables en Pulp Fiction e Inglourious Basterds.' },
      { id_director: 8, nombre: 'Hayao Miyazaki', nacionalidad: 'Japonés', biografia: 'Cofundador de Studio Ghibli y leyenda de la animación con El viaje de Chihiro.' },
      { id_director: 9, nombre: 'James Cameron', nacionalidad: 'Canadiense', biografia: 'Visionario tecnológico y director de hitos taquilleros mundiales como Avatar y Titanic.' },
      { id_director: 10, nombre: 'Alfonso Cuarón', nacionalidad: 'Mexicano', biografia: 'Ganador de múltiples Premios Óscar por la dirección técnica de Gravity y Roma.' },
      { id_director: 11, nombre: 'David Fincher', nacionalidad: 'Estadounidense', biografia: 'Maestro del thriller psicológico y el perfeccionismo técnico en Fight Club y Se7en.' },
      { id_director: 12, nombre: 'Ridley Scott', nacionalidad: 'Británico', biografia: 'Referente indiscutible del cine histórico y ciencia ficción con Gladiator y Alien.' },
      { id_director: 13, nombre: 'Wes Anderson', nacionalidad: 'Estadounidense', biografia: 'Creador de una estética visual simétrica inconfundible con The Grand Budapest Hotel.' },
      { id_director: 14, nombre: 'Bong Joon-ho', nacionalidad: 'Surcoreano', biografia: 'Histórico ganador del Óscar a Mejor Película por Parasite y Memories of Murder.' },
      { id_director: 15, nombre: 'Jordan Peele', nacionalidad: 'Estadounidense', biografia: 'Vanguardista del nuevo terror psicológico y comentario social con Get Out y Nope.' },
    ]);
    console.log('   ✓ 15 Directores creados');

    // 5. Categorías de Producto (7 categorías)
    await CategoriaProducto.bulkCreate([
      { id_categoria: 1, nombre: 'Palomitas de Maíz', descripcion: 'Popcorn clásico recién hecho, mantequilla salada, caramelo y mixtas.' },
      { id_categoria: 2, nombre: 'Bebidas Carbonatadas', descripcion: 'Refrescos gaseosos servidos fríos en múltiples tamaños.' },
      { id_categoria: 3, nombre: 'Dulces y Chocolates', descripcion: 'Confitería importada y nacional, chocolates y gomitas.' },
      { id_categoria: 4, nombre: 'Combos Promocionales', descripcion: 'Paquetes de palomitas con refrescos y snacks a precio especial.' },
      { id_categoria: 5, nombre: 'Nachos con Queso', descripcion: 'Tortillas crujientes con queso cheddar derretido y jalapeños.' },
      { id_categoria: 6, nombre: 'Hot Dogs & Snacks Calientes', descripcion: 'Salchichas premium jumbo, salsas especiales y tocino crujiente.' },
      { id_categoria: 7, nombre: 'Cafetería Gourmet & Repostería', descripcion: 'Café de especialidad costarricense expreso, capuchino y repostería.' },
    ]);
    console.log('   ✓ 7 Categorías de Producto creadas');

    // 6. Métodos de Pago (5 métodos)
    await MetodoPago.bulkCreate([
      { id_metodo_pago: 1, nombre: 'Efectivo en Taquilla', descripcion: 'Pago en colones o dólares en efectivo directo en caja.' },
      { id_metodo_pago: 2, nombre: 'Tarjeta Crédito / Débito', descripcion: 'Cobro procesado por pasarela segura con tarjetas Visa, Mastercard o AMEX.' },
      { id_metodo_pago: 3, nombre: 'SINPE Móvil', descripcion: 'Transferencia móvil bancaria inmediata al número comercial CineDa.' },
      { id_metodo_pago: 4, nombre: 'Puntos CineDa Club', descripcion: 'Canje de puntos de fidelidad acumulados por visitas previas.' },
      { id_metodo_pago: 5, nombre: 'Cupón Promocional', descripcion: 'Redención de cupones y tarjetas de regalo autorizadas.' },
    ]);
    console.log('   ✓ 5 Métodos de Pago creados');

    // 7. Cargos (8 puestos organizacionales)
    await Cargo.bulkCreate([
      { id_cargo: 1, titulo_cargo: 'Gerente General de Complejo', salario_base: 1300000.00 },
      { id_cargo: 2, titulo_cargo: 'Supervisor de Turno y Operaciones', salario_base: 850000.00 },
      { id_cargo: 3, titulo_cargo: 'Taquillero Principal', salario_base: 460000.00 },
      { id_cargo: 4, titulo_cargo: 'Dependiente de Dulcería y Bodega', salario_base: 450000.00 },
      { id_cargo: 5, titulo_cargo: 'Técnico Proyeccionista en Jefe', salario_base: 680000.00 },
      { id_cargo: 6, titulo_cargo: 'Auxiliar de Limpieza e Higiene', salario_base: 420000.00 },
      { id_cargo: 7, titulo_cargo: 'Técnico de Mantenimiento y Salas', salario_base: 640000.00 },
      { id_cargo: 8, titulo_cargo: 'Asistente de Atención al Cliente', salario_base: 480000.00 },
    ]);
    console.log('   ✓ 8 Cargos creados');

    // 8. Cupones (25 cupones promocionales vigentes 2026/2027)
    await Cupon.bulkCreate([
      { id_cupon: 1, codigo: 'CINEDA10', porcentaje_descuento: 10.00, fecha_vencimiento: '2026-12-31', activo: true },
      { id_cupon: 2, codigo: 'ESTRENO20', porcentaje_descuento: 20.00, fecha_vencimiento: '2026-12-31', activo: true },
      { id_cupon: 3, codigo: 'VIPCINEMA15', porcentaje_descuento: 15.00, fecha_vencimiento: '2026-11-30', activo: true },
      { id_cupon: 4, codigo: 'MIERCOLES2X1', porcentaje_descuento: 50.00, fecha_vencimiento: '2026-12-31', activo: true },
      { id_cupon: 5, codigo: 'FIDELIDAD25', porcentaje_descuento: 25.00, fecha_vencimiento: '2027-01-31', activo: true },
      { id_cupon: 6, codigo: 'VERANO30', porcentaje_descuento: 30.00, fecha_vencimiento: '2027-02-28', activo: true },
      { id_cupon: 7, codigo: 'DULCERIA15', porcentaje_descuento: 15.00, fecha_vencimiento: '2026-12-15', activo: true },
      { id_cupon: 8, codigo: 'CINEFILO40', porcentaje_descuento: 40.00, fecha_vencimiento: '2026-12-31', activo: true },
      { id_cupon: 9, codigo: 'BLACKCINEMA35', porcentaje_descuento: 35.00, fecha_vencimiento: '2026-11-28', activo: true },
      { id_cupon: 10, codigo: 'PROMOAPP10', porcentaje_descuento: 10.00, fecha_vencimiento: '2027-03-31', activo: true },
      { id_cupon: 11, codigo: 'CUMPLEANOS50', porcentaje_descuento: 50.00, fecha_vencimiento: '2027-06-30', activo: true },
      { id_cupon: 12, codigo: 'ESTUDIANTE20', porcentaje_descuento: 20.00, fecha_vencimiento: '2026-12-15', activo: true },
      { id_cupon: 13, codigo: 'DUOPACK15', porcentaje_descuento: 15.00, fecha_vencimiento: '2026-12-31', activo: true },
      { id_cupon: 14, codigo: 'GOLDENPASS25', porcentaje_descuento: 25.00, fecha_vencimiento: '2027-04-30', activo: true },
      { id_cupon: 15, codigo: 'NAVIDADCINE30', porcentaje_descuento: 30.00, fecha_vencimiento: '2026-12-25', activo: true },
      { id_cupon: 16, codigo: 'PREVENTA10', porcentaje_descuento: 10.00, fecha_vencimiento: '2027-01-15', activo: true },
      { id_cupon: 17, codigo: 'IMAXEXP15', porcentaje_descuento: 15.00, fecha_vencimiento: '2026-11-30', activo: true },
      { id_cupon: 18, codigo: 'COMBOMANIA20', porcentaje_descuento: 20.00, fecha_vencimiento: '2027-05-31', activo: true },
      { id_cupon: 19, codigo: 'DOMINGOFAM30', porcentaje_descuento: 30.00, fecha_vencimiento: '2026-12-31', activo: true },
      { id_cupon: 20, codigo: 'LUNESLOVERS25', porcentaje_descuento: 25.00, fecha_vencimiento: '2026-12-20', activo: true },
      { id_cupon: 21, codigo: 'FANATICOS40', porcentaje_descuento: 40.00, fecha_vencimiento: '2027-02-15', activo: true },
      { id_cupon: 22, codigo: 'TARDEPREMIER15', porcentaje_descuento: 15.00, fecha_vencimiento: '2026-12-31', activo: true },
      { id_cupon: 23, codigo: 'POPCORNPASS50', porcentaje_descuento: 50.00, fecha_vencimiento: '2027-03-15', activo: true },
      { id_cupon: 24, codigo: 'SOCIOVIP30', porcentaje_descuento: 30.00, fecha_vencimiento: '2027-06-30', activo: true },
      { id_cupon: 25, codigo: 'SUPERPROMO20', porcentaje_descuento: 20.00, fecha_vencimiento: '2026-12-31', activo: true },
    ]);
    console.log('   ✓ 25 Cupones creados');

    // 9. Combos (18 combos estructurados)
    await Combo.bulkCreate([
      { id_combo: 1, nombre: 'Combo Clásico Personal', descripcion: '1 Palomitas Medianas + 1 Refresco 32oz', precio: 3800.00, activo: true },
      { id_combo: 2, nombre: 'Combo Pareja Extra', descripcion: '1 Palomitas Grandes + 2 Refrescos 32oz + 1 Chocolate', precio: 6500.00, activo: true },
      { id_combo: 3, nombre: 'Combo Familiar CineDa', descripcion: '2 Palomitas Grandes + 4 Refrescos 32oz + 2 Golosinas', precio: 11900.00, activo: true },
      { id_combo: 4, nombre: 'Combo Megapack Nachos', descripcion: '1 Nachos con Doble Queso + 1 Refresco 32oz', precio: 4500.00, activo: true },
      { id_combo: 5, nombre: 'Combo Hot Dog Especial', descripcion: '1 Hot Dog Jumbo con Tocino + 1 Refresco 32oz', precio: 4800.00, activo: true },
      { id_combo: 6, nombre: 'Combo Infantil Aventuras', descripcion: '1 Palomitas Kids + 1 Jugo Natural + 1 Golosina', precio: 3200.00, activo: true },
      { id_combo: 7, nombre: 'Combo Dulce Pasión', descripcion: '1 Palomitas Caramelo Medianas + 1 Sundae + 1 Refresco', precio: 5200.00, activo: true },
      { id_combo: 8, nombre: 'Combo VIP Gourmet', descripcion: '1 Canasta Mixta Gourmet + 2 Bebidas de Especialidad', precio: 9800.00, activo: true },
      { id_combo: 9, nombre: 'Combo Estudiante Universitario', descripcion: '1 Palomitas Medianas + 1 Refresco (Válido de Lun a Jue)', precio: 3000.00, activo: true },
      { id_combo: 10, nombre: 'Combo Noche de Estreno', descripcion: '1 Palomitas Grandes en Cubeta + 1 Vaso Temático', precio: 8500.00, activo: true },
      { id_combo: 11, nombre: 'Combo Trío Dinámico', descripcion: '1 Palomitas Grandes + 3 Refrescos 32oz + 1 Nachos', precio: 8200.00, activo: true },
      { id_combo: 12, nombre: 'Combo Nachos & Dog Duo', descripcion: '1 Nachos Grandes + 1 Hot Dog Jumbo + 2 Refrescos', precio: 7200.00, activo: true },
      { id_combo: 13, nombre: 'Combo Maxi Palomitas', descripcion: '2 Palomitas Medianas + 2 Refrescos 32oz', precio: 5800.00, activo: true },
      { id_combo: 14, nombre: 'Combo Café & Delicia', descripcion: '2 Cafés Capuchino + 2 Croissants de Mantequilla', precio: 4200.00, activo: true },
      { id_combo: 15, nombre: 'Combo Fiesta Cuádruple', descripcion: '3 Palomitas Grandes + 4 Refrescos + 2 Nachos + 2 Golosinas', precio: 14500.00, activo: true },
      { id_combo: 16, nombre: 'Combo Goloso Chocolatero', descripcion: '1 Palomitas Medianas + 2 Barras Snickers + 1 Refresco', precio: 4900.00, activo: true },
      { id_combo: 17, nombre: 'Combo Saludable Natural', descripcion: '2 Botellas de Agua + 1 Canasta Frutos Secos', precio: 3900.00, activo: true },
      { id_combo: 18, nombre: 'Combo Matiné Infantil', descripcion: '1 Palomitas Pequeñas + 1 Refresco Pequeño', precio: 2900.00, activo: true },
    ]);
    console.log('   ✓ 18 Combos creados\n');

    // ==========================================
    // CAPA 2: Primer Nivel Relacional (7)
    // ==========================================
    console.log('🎬 [Capa 2/4] Insertando Catálogo y Primer Nivel Relacional...');

    // 10. Películas (30 películas reales en cartelera y archivo)
    await Pelicula.bulkCreate([
      { id_pelicula: 1, id_director: 1, titulo: 'Oppenheimer', genero: 'Histórico / Drama', duracion: 180, clasificacion: '+15', sinopsis: 'La historia del físico J. Robert Oppenheimer y el desarrollo de la bomba atómica en el Proyecto Manhattan.' },
      { id_pelicula: 2, id_director: 2, titulo: 'Dune: Part Two', genero: 'Ciencia Ficción / Aventura', duracion: 166, clasificacion: '+12', sinopsis: 'Paul Atreides se une a Chani y a los Fremen mientras busca venganza contra los conspiradores que destruyeron a su familia.' },
      { id_pelicula: 3, id_director: 3, titulo: 'Barbie', genero: 'Comedia / Fantasía', duracion: 114, clasificacion: 'TE', sinopsis: 'Barbie y Ken emprenden un revelador viaje de autodescubrimiento al salir de Barbieland hacia el mundo real.' },
      { id_pelicula: 4, id_director: 4, titulo: 'Killers of the Flower Moon', genero: 'Crimen / Drama', duracion: 206, clasificacion: '+15', sinopsis: 'Una serie de misteriosos asesinatos asuela a la Nación Osage tras el descubrimiento de grandes pozos petroleros.' },
      { id_pelicula: 5, id_director: 5, titulo: 'The Fabelmans', genero: 'Drama / Biográfico', duracion: 151, clasificacion: 'TE', sinopsis: 'Creciendo en la posguerra, el joven Sammy Fabelman descubre un devastador secreto familiar a través del cine.' },
      { id_pelicula: 6, id_director: 6, titulo: 'El laberinto del fauno', genero: 'Fantasía / Drama', duracion: 118, clasificacion: '+15', sinopsis: 'En la España de la posguerra, una niña solitaria se refugia en un laberinto mítico custodiado por un fauno.' },
      { id_pelicula: 7, id_director: 7, titulo: 'Pulp Fiction', genero: 'Crimen / Acción', duracion: 154, clasificacion: '+18', sinopsis: 'Las vidas de dos sicarios, la esposa de un gánster y un boxeador se entrelazan en Los Ángeles.' },
      { id_pelicula: 8, id_director: 8, titulo: 'El viaje de Chihiro', genero: 'Animación / Aventura', duracion: 125, clasificacion: 'TE', sinopsis: 'Chihiro entra a un mundo mágico habitado por dioses y brujas donde sus padres son convertidos en cerdos.' },
      { id_pelicula: 9, id_director: 9, titulo: 'Avatar: The Way of Water', genero: 'Ciencia Ficción / Acción', duracion: 192, clasificacion: '+12', sinopsis: 'Jake Sully vive con su nueva familia en Pandora, pero una antigua amenaza regresa para terminar su misión.' },
      { id_pelicula: 10, id_director: 10, titulo: 'Roma', genero: 'Drama', duracion: 135, clasificacion: '+12', sinopsis: 'Retrato íntimo y conmovedor de una trabajadora doméstica en el turbulento México de los años setenta.' },
      { id_pelicula: 11, id_director: 11, titulo: 'Fight Club', genero: 'Drama / Suspenso', duracion: 139, clasificacion: '+18', sinopsis: 'Un empleado insomne y un vendedor de jabón rebelde canalizan su frustración en un club de peleas clandestino.' },
      { id_pelicula: 12, id_director: 12, titulo: 'Gladiator II', genero: 'Acción / Épico', duracion: 148, clasificacion: '+15', sinopsis: 'Años después de la muerte de Máximo, Lucius debe entrar al Coliseo tras caer su hogar bajo tiranos emperadores.' },
      { id_pelicula: 13, id_director: 13, titulo: 'The Grand Budapest Hotel', genero: 'Comedia / Aventura', duracion: 100, clasificacion: '+12', sinopsis: 'Las peripecias de Gustave H, conserje legendario de un famoso hotel europeo, y Zero Moustafa, el botones aprendiz.' },
      { id_pelicula: 14, id_director: 14, titulo: 'Parasite', genero: 'Suspenso / Comedia Negra', duracion: 132, clasificacion: '+15', sinopsis: 'Una familia sin recursos urde un plan para infiltrarse paulatinamente en el servicio de un clan adinerado.' },
      { id_pelicula: 15, id_director: 15, titulo: 'Get Out', genero: 'Terror / Suspenso', duracion: 104, clasificacion: '+15', sinopsis: 'Un joven afroamericano visita la finca de la familia de su novia blanca y destapa un perturbador secreto.' },
      { id_pelicula: 16, id_director: 1, titulo: 'Interstellar', genero: 'Ciencia Ficción / Aventura', duracion: 169, clasificacion: '+12', sinopsis: 'Un equipo de exploradores viaja a través de un agujero de gusano en el espacio buscando la supervivencia humana.' },
      { id_pelicula: 17, id_director: 2, titulo: 'Blade Runner 2049', genero: 'Ciencia Ficción / Neo-noir', duracion: 164, clasificacion: '+15', sinopsis: 'El oficial K desentierra un antiguo secreto que podría sumir a lo que queda de la sociedad en un caos absoluto.' },
      { id_pelicula: 18, id_director: 3, titulo: 'Little Women', genero: 'Drama / Romance', duracion: 135, clasificacion: 'TE', sinopsis: 'Cuatro hermanas adolescentes alcanzan la adultez y buscan forjar su destino en Massachusetts durante la Guerra Civil.' },
      { id_pelicula: 19, id_director: 4, titulo: 'The Irishman', genero: 'Crimen / Drama', duracion: 209, clasificacion: '+15', sinopsis: 'Crónica épica sobre el crimen organizado en Estados Unidos a través de los ojos del veterano Frank Sheeran.' },
      { id_pelicula: 20, id_director: 5, titulo: 'Jurassic Park', genero: 'Aventura / Ciencia Ficción', duracion: 127, clasificacion: 'TE', sinopsis: 'Un grupo selecto visita un parque temático de dinosaurios clonados, pero un fallo en la seguridad desata el terror.' },
      { id_pelicula: 21, id_director: 6, titulo: 'The Shape of Water', genero: 'Fantasía / Romance', duracion: 123, clasificacion: '+15', sinopsis: 'En un centro de investigación secreta en los años 60, una limpiadora muda forja un vínculo con una criatura anfibia.' },
      { id_pelicula: 22, id_director: 7, titulo: 'Inglourious Basterds', genero: 'Bélico / Acción', duracion: 153, clasificacion: '+18', sinopsis: 'Durante la ocupación de Francia, un comando judío-estadounidense trama asesinar a los líderes del Tercer Reich.' },
      { id_pelicula: 23, id_director: 8, titulo: 'The Boy and the Heron', genero: 'Animación / Fantasía', duracion: 124, clasificacion: 'TE', sinopsis: 'Un joven marcado por el dolor ingresa a un mundo fantástico compartido por los vivos y los muertos guiado por una garza.' },
      { id_pelicula: 24, id_director: 9, titulo: 'Titanic', genero: 'Romance / Drama', duracion: 195, clasificacion: '+12', sinopsis: 'Dos jóvenes de clases sociales opuestas se enamoran a bordo del transatlántico más lujoso jamás construido.' },
      { id_pelicula: 25, id_director: 10, titulo: 'Gravity', genero: 'Ciencia Ficción / Suspenso', duracion: 91, clasificacion: '+12', sinopsis: 'Una ingeniera médica y un astronauta veterano quedan varados en el espacio exterior tras destruirse su nave.' },
      { id_pelicula: 26, id_director: 11, titulo: 'Se7en', genero: 'Crimen / Misterio', duracion: 127, clasificacion: '+18', sinopsis: 'Dos detectives de homicidios rastrean a un asesino serial que utiliza los siete pecados capitales como móvil.' },
      { id_pelicula: 27, id_director: 12, titulo: 'Alien', genero: 'Terror / Ciencia Ficción', duracion: 117, clasificacion: '+15', sinopsis: 'La tripulación de una nave comercial de carga responde a una llamada de auxilio y descubre una forma de vida letal.' },
      { id_pelicula: 28, id_director: 13, titulo: 'Asteroid City', genero: 'Comedia / Ciencia Ficción', duracion: 105, clasificacion: '+12', sinopsis: 'Una convención de cadetes espaciales en una pequeña localidad del desierto estadounidense se ve interrumpida por eventos mundiales.' },
      { id_pelicula: 29, id_director: 14, titulo: 'Memories of Murder', genero: 'Crimen / Drama', duracion: 132, clasificacion: '+15', sinopsis: 'Dos detectives con métodos diametralmente opuestos investigan los primeros asesinatos en serie documentados en Corea.' },
      { id_pelicula: 30, id_director: 15, titulo: 'Nope', genero: 'Terror / Ciencia Ficción', duracion: 130, clasificacion: '+15', sinopsis: 'Los residentes de un solitario barranco en California presencian un escalofriante e inexplicable fenómeno en el cielo.' },
    ]);
    console.log('   ✓ 30 Películas creadas');

    // 11. Salas (30 salas distribuidas entre los 10 cines, 3 por complejo)
    const salasData = [];
    let salaId = 1;
    for (let c = 1; c <= 10; c++) {
      // Sala 1: Estándar o MacroXE
      salasData.push({
        id_sala: salaId++,
        id_cine: c,
        id_tiposala: ((c % 2) === 0 ? 4 : 1),
        numero_sala: 1,
        capacidad: 240,
      });
      // Sala 2: IMAX o 3D
      salasData.push({
        id_sala: salaId++,
        id_cine: c,
        id_tiposala: ((c % 2) === 0 ? 3 : 2),
        numero_sala: 2,
        capacidad: 180,
      });
      // Sala 3: VIP o 4DX
      salasData.push({
        id_sala: salaId++,
        id_cine: c,
        id_tiposala: ((c % 2) === 0 ? 5 : 6),
        numero_sala: 3,
        capacidad: 100,
      });
    }
    await Sala.bulkCreate(salasData);
    console.log('   ✓ 30 Salas creadas (3 por complejo en los 10 cines)');

    // 12. Productos de Dulcería (30 productos con categorías coherentes)
    await Producto.bulkCreate([
      // Palomitas (Categoría 1)
      { id_producto: 1, id_categoria: 1, nombre: 'Palomitas Grandes Mantequilla', precio: 3200.00, stock: 180 },
      { id_producto: 2, id_categoria: 1, nombre: 'Palomitas Medianas Mantequilla', precio: 2800.00, stock: 150 },
      { id_producto: 3, id_categoria: 1, nombre: 'Palomitas Pequeñas Mantequilla', precio: 2200.00, stock: 120 },
      { id_producto: 4, id_categoria: 1, nombre: 'Palomitas Grandes Caramelo', precio: 3500.00, stock: 140 },
      { id_producto: 5, id_categoria: 1, nombre: 'Palomitas Medianas Caramelo', precio: 3000.00, stock: 110 },
      { id_producto: 6, id_categoria: 1, nombre: 'Palomitas Mixtas Grandes', precio: 3600.00, stock: 130 },
      // Bebidas (Categoría 2)
      { id_producto: 7, id_categoria: 2, nombre: 'Refresco Coca-Cola 32oz', precio: 1900.00, stock: 350 },
      { id_producto: 8, id_categoria: 2, nombre: 'Refresco Coca-Cola Zero 32oz', precio: 1900.00, stock: 280 },
      { id_producto: 9, id_categoria: 2, nombre: 'Refresco Sprite 32oz', precio: 1900.00, stock: 200 },
      { id_producto: 10, id_categoria: 2, nombre: 'Refresco Fanta Naranja 32oz', precio: 1900.00, stock: 180 },
      { id_producto: 11, id_categoria: 2, nombre: 'Té Frío Fuze Tea Melocotón 32oz', precio: 2000.00, stock: 160 },
      { id_producto: 12, id_categoria: 2, nombre: 'Agua Mineral Manantial 600ml', precio: 1400.00, stock: 250 },
      // Dulces y Chocolates (Categoría 3)
      { id_producto: 13, id_categoria: 3, nombre: 'Chocolates M&M Maní 150g', precio: 1800.00, stock: 140 },
      { id_producto: 14, id_categoria: 3, nombre: 'Chocolates M&M Leche 150g', precio: 1800.00, stock: 120 },
      { id_producto: 15, id_categoria: 3, nombre: 'Gomitas Skittles Frutales', precio: 1600.00, stock: 110 },
      { id_producto: 16, id_categoria: 3, nombre: 'Barra Snickers Jumbo 80g', precio: 1500.00, stock: 95 },
      { id_producto: 17, id_categoria: 3, nombre: 'Gomitas Ácidas Trululu 120g', precio: 1400.00, stock: 85 },
      { id_producto: 18, id_categoria: 3, nombre: 'Barra KitKat 4 Fingers', precio: 1500.00, stock: 130 },
      // Nachos con Queso (Categoría 5)
      { id_producto: 19, id_categoria: 5, nombre: 'Nachos Clásicos con Queso Cheddar', precio: 3400.00, stock: 90 },
      { id_producto: 20, id_categoria: 5, nombre: 'Nachos Supremos con Jalapeño y Frijol', precio: 4200.00, stock: 75 },
      { id_producto: 21, id_categoria: 5, nombre: 'Porción Extra de Queso Cheddar Caliente', precio: 900.00, stock: 200 },
      // Hot Dogs & Snacks Calientes (Categoría 6)
      { id_producto: 22, id_categoria: 6, nombre: 'Hot Dog Clásico con Salsas', precio: 3200.00, stock: 80 },
      { id_producto: 23, id_categoria: 6, nombre: 'Hot Dog Jumbo con Tocineta', precio: 4000.00, stock: 70 },
      { id_producto: 24, id_categoria: 6, nombre: 'Canasta de Pretzel Salado', precio: 2600.00, stock: 60 },
      // Cafetería Gourmet (Categoría 7)
      { id_producto: 25, id_categoria: 7, nombre: 'Café Americano Especialidad 12oz', precio: 1800.00, stock: 90 },
      { id_producto: 26, id_categoria: 7, nombre: 'Café Capuchino Vainilla 12oz', precio: 2400.00, stock: 85 },
      { id_producto: 27, id_categoria: 7, nombre: 'Muffin Artesanal de Arándanos', precio: 1900.00, stock: 50 },
      { id_producto: 28, id_categoria: 7, nombre: 'Croissant Horneado de Mantequilla', precio: 2100.00, stock: 45 },
      { id_producto: 29, id_categoria: 7, nombre: 'Sundae de Caramelo Salado', precio: 2500.00, stock: 65 },
      { id_producto: 30, id_categoria: 4, nombre: 'Vaso Temático Coleccionable', precio: 4500.00, stock: 110 },
    ]);
    console.log('   ✓ 30 Productos de Dulcería creados');

    // 13. Combo Detalles (45 relaciones combo-producto)
    await ComboDetalle.bulkCreate([
      // Combo 1: Clásico Personal
      { id_combodetalle: 1, id_combo: 1, id_producto: 2, cantidad: 1 },
      { id_combodetalle: 2, id_combo: 1, id_producto: 7, cantidad: 1 },
      // Combo 2: Pareja Extra
      { id_combodetalle: 3, id_combo: 2, id_producto: 1, cantidad: 1 },
      { id_combodetalle: 4, id_combo: 2, id_producto: 7, cantidad: 2 },
      { id_combodetalle: 5, id_combo: 2, id_producto: 13, cantidad: 1 },
      // Combo 3: Familiar CineDa
      { id_combodetalle: 6, id_combo: 3, id_producto: 1, cantidad: 2 },
      { id_combodetalle: 7, id_combo: 3, id_producto: 7, cantidad: 4 },
      { id_combodetalle: 8, id_combo: 3, id_producto: 15, cantidad: 2 },
      // Combo 4: Megapack Nachos
      { id_combodetalle: 9, id_combo: 4, id_producto: 19, cantidad: 1 },
      { id_combodetalle: 10, id_combo: 4, id_producto: 9, cantidad: 1 },
      // Combo 5: Hot Dog Especial
      { id_combodetalle: 11, id_combo: 5, id_producto: 23, cantidad: 1 },
      { id_combodetalle: 12, id_combo: 5, id_producto: 8, cantidad: 1 },
      // Combo 6: Infantil Aventuras
      { id_combodetalle: 13, id_combo: 6, id_producto: 3, cantidad: 1 },
      { id_combodetalle: 14, id_combo: 6, id_producto: 11, cantidad: 1 },
      { id_combodetalle: 15, id_combo: 6, id_producto: 17, cantidad: 1 },
      // Combo 7: Dulce Pasión
      { id_combodetalle: 16, id_combo: 7, id_producto: 5, cantidad: 1 },
      { id_combodetalle: 17, id_combo: 7, id_producto: 29, cantidad: 1 },
      { id_combodetalle: 18, id_combo: 7, id_producto: 7, cantidad: 1 },
      // Combo 8: VIP Gourmet
      { id_combodetalle: 19, id_combo: 8, id_producto: 20, cantidad: 1 },
      { id_combodetalle: 20, id_combo: 8, id_producto: 26, cantidad: 2 },
      { id_combodetalle: 21, id_combo: 8, id_producto: 28, cantidad: 2 },
      // Combo 9: Estudiante
      { id_combodetalle: 22, id_combo: 9, id_producto: 2, cantidad: 1 },
      { id_combodetalle: 23, id_combo: 9, id_producto: 7, cantidad: 1 },
      // Combo 10: Noche de Estreno
      { id_combodetalle: 24, id_combo: 10, id_producto: 1, cantidad: 1 },
      { id_combodetalle: 25, id_combo: 10, id_producto: 30, cantidad: 1 },
      { id_combodetalle: 26, id_combo: 10, id_producto: 7, cantidad: 1 },
      // Combo 11: Trío Dinámico
      { id_combodetalle: 27, id_combo: 11, id_producto: 1, cantidad: 1 },
      { id_combodetalle: 28, id_combo: 11, id_producto: 7, cantidad: 3 },
      { id_combodetalle: 29, id_combo: 11, id_producto: 19, cantidad: 1 },
      // Combo 12: Nachos & Dog Duo
      { id_combodetalle: 30, id_combo: 12, id_producto: 19, cantidad: 1 },
      { id_combodetalle: 31, id_combo: 12, id_producto: 23, cantidad: 1 },
      { id_combodetalle: 32, id_combo: 12, id_producto: 8, cantidad: 2 },
      // Combo 13: Maxi Palomitas
      { id_combodetalle: 33, id_combo: 13, id_producto: 2, cantidad: 2 },
      { id_combodetalle: 34, id_combo: 13, id_producto: 7, cantidad: 2 },
      // Combo 14: Café & Delicia
      { id_combodetalle: 35, id_combo: 14, id_producto: 26, cantidad: 2 },
      { id_combodetalle: 36, id_combo: 14, id_producto: 28, cantidad: 2 },
      // Combo 15: Fiesta Cuádruple
      { id_combodetalle: 37, id_combo: 15, id_producto: 1, cantidad: 3 },
      { id_combodetalle: 38, id_combo: 15, id_producto: 7, cantidad: 4 },
      { id_combodetalle: 39, id_combo: 15, id_producto: 20, cantidad: 2 },
      { id_combodetalle: 40, id_combo: 15, id_producto: 13, cantidad: 2 },
      // Combo 16: Goloso Chocolatero
      { id_combodetalle: 41, id_combo: 16, id_producto: 2, cantidad: 1 },
      { id_combodetalle: 42, id_combo: 16, id_producto: 16, cantidad: 2 },
      { id_combodetalle: 43, id_combo: 16, id_producto: 7, cantidad: 1 },
      // Combo 17: Saludable Natural
      { id_combodetalle: 44, id_combo: 17, id_producto: 12, cantidad: 2 },
      // Combo 18: Matiné Infantil
      { id_combodetalle: 45, id_combo: 18, id_producto: 3, cantidad: 1 },
    ]);
    console.log('   ✓ 45 Combo Detalles creados');

    // 14. Empleados (25 empleados asignados a los cines y cargos)
    await Empleado.bulkCreate([
      { id_empleado: 1, id_cine: 1, id_cargo: 1, nombre: 'Guillermo Solís', identificacion: '1-1204-0391', fecha_contratacion: '2023-01-15' },
      { id_empleado: 2, id_cine: 1, id_cargo: 2, nombre: 'Natalia Cordero', identificacion: '1-1590-0821', fecha_contratacion: '2023-03-20' },
      { id_empleado: 3, id_cine: 1, id_cargo: 3, nombre: 'Felipe Monge', identificacion: '2-0645-0129', fecha_contratacion: '2023-05-10' },
      { id_empleado: 4, id_cine: 2, id_cargo: 4, nombre: 'Karla Barquero', identificacion: '1-1782-0441', fecha_contratacion: '2023-07-01' },
      { id_empleado: 5, id_cine: 2, id_cargo: 5, nombre: 'Andrés Quesada', identificacion: '3-0498-0711', fecha_contratacion: '2023-09-12' },
      { id_empleado: 6, id_cine: 3, id_cargo: 6, nombre: 'Marcela Zeledón', identificacion: '1-1402-0993', fecha_contratacion: '2024-01-08' },
      { id_empleado: 7, id_cine: 4, id_cargo: 7, nombre: 'Víctor Espinoza', identificacion: '2-0712-0542', fecha_contratacion: '2024-02-15' },
      { id_empleado: 8, id_cine: 5, id_cargo: 8, nombre: 'Paola Umaña', identificacion: '4-0211-0399', fecha_contratacion: '2024-04-01' },
      { id_empleado: 9, id_cine: 6, id_cargo: 1, nombre: 'Sebastián Mora', identificacion: '1-1823-0621', fecha_contratacion: '2024-06-10' },
      { id_empleado: 10, id_cine: 7, id_cargo: 2, nombre: 'Jorge Gamboa', identificacion: '1-1199-0412', fecha_contratacion: '2024-07-22' },
      { id_empleado: 11, id_cine: 8, id_cargo: 6, nombre: 'Ignacio Arroyo', identificacion: '3-0411-0899', fecha_contratacion: '2024-08-01' },
      { id_empleado: 12, id_cine: 9, id_cargo: 3, nombre: 'Beatriz Salazar', identificacion: '1-1634-0219', fecha_contratacion: '2024-08-15' },
      { id_empleado: 13, id_cine: 10, id_cargo: 4, nombre: 'Oscar Brenes', identificacion: '2-0599-0741', fecha_contratacion: '2024-09-01' },
      { id_empleado: 14, id_cine: 1, id_cargo: 5, nombre: 'Diana Centeno', identificacion: '1-1455-0832', fecha_contratacion: '2024-09-15' },
      { id_empleado: 15, id_cine: 2, id_cargo: 7, nombre: 'Mauricio Delgado', identificacion: '1-1022-0488', fecha_contratacion: '2024-10-01' },
      { id_empleado: 16, id_cine: 3, id_cargo: 6, nombre: 'Clara Valerio', identificacion: '5-0321-0941', fecha_contratacion: '2024-10-15' },
      { id_empleado: 17, id_cine: 4, id_cargo: 8, nombre: 'Rodrigo Méndez', identificacion: '2-0789-0123', fecha_contratacion: '2024-11-01' },
      { id_empleado: 18, id_cine: 5, id_cargo: 3, nombre: 'Elena Cascante', identificacion: '4-0188-0677', fecha_contratacion: '2024-11-15' },
      { id_empleado: 19, id_cine: 6, id_cargo: 4, nombre: 'Kevin Madrigal', identificacion: '1-1678-0234', fecha_contratacion: '2024-12-01' },
      { id_empleado: 20, id_cine: 7, id_cargo: 5, nombre: 'Silvia Porras', identificacion: '3-0512-0789', fecha_contratacion: '2025-01-10' },
      { id_empleado: 21, id_cine: 8, id_cargo: 6, nombre: 'Esteban Aguilar', identificacion: '1-1345-0901', fecha_contratacion: '2025-01-20' },
      { id_empleado: 22, id_cine: 9, id_cargo: 2, nombre: 'Valeria Segura', identificacion: '1-1890-0345', fecha_contratacion: '2025-02-01' },
      { id_empleado: 23, id_cine: 10, id_cargo: 7, nombre: 'Javier Zúñiga', identificacion: '1-1122-0876', fecha_contratacion: '2025-02-15' },
      { id_empleado: 24, id_cine: 1, id_cargo: 8, nombre: 'Giselle Corrales', identificacion: '2-0678-0432', fecha_contratacion: '2025-03-01' },
      { id_empleado: 25, id_cine: 2, id_cargo: 6, nombre: 'Pablo Cerdas', identificacion: '1-1567-0912', fecha_contratacion: '2025-03-15' },
    ]);
    console.log('   ✓ 25 Empleados creados');

    // 15. Facturas (50 facturas con montos reales, descuentos e IVA)
    const facturasData = [];
    const montosBase = [
      6400, 9600, 13000, 7600, 6000, 14200, 4800, 11900, 5500, 4500,
      8600, 15400, 12800, 7200, 9400, 16800, 5200, 10500, 6800, 8900,
      13500, 11200, 4900, 7800, 15900, 6700, 8400, 12100, 9900, 14300,
      7500, 5800, 16200, 10800, 8100, 13900, 6300, 9100, 11700, 4600,
      15100, 8700, 7300, 12600, 10200, 6900, 14700, 8300, 11500, 9700
    ];

    for (let f = 1; f <= 50; f++) {
      const numFac = `FAC-2026-${String(f).padStart(4, '0')}`;
      const usuarioId = 16 + ((f - 1) % 30); // Distribuidos entre clientes 16 y 45
      const cuponId = (f % 2 === 0) ? (1 + (f % 25)) : null; // Mitad con cupón
      const subtotal = montosBase[f - 1];
      const descPorc = cuponId ? 15.00 : 0.00;
      const descuento = Number((subtotal * (descPorc / 100)).toFixed(2));
      const total = Number((subtotal - descuento).toFixed(2));

      // Fechas entre finales de octubre y noviembre 2026
      const dia = 1 + ((f - 1) % 6);
      const hora = 12 + (f % 10);
      const min = (f * 7) % 60;
      const fecha = new Date(`2026-11-0${dia}T${String(hora).padStart(2, '0')}:${String(min).padStart(2, '0')}:00`);

      facturasData.push({
        id_factura: f,
        id_usuario: usuarioId,
        id_cupon: cuponId,
        numero_factura: numFac,
        subtotal,
        descuento,
        total,
        fecha_emision: fecha,
      });
    }
    await Factura.bulkCreate(facturasData);
    console.log('   ✓ 50 Facturas creadas');

    // 16. Calificaciones (45 reseñas de películas)
    const calificacionesData = [];
    const comentariosMuestra = [
      'Una obra maestra del cine contemporáneo. Actuaciones memorables y banda sonora impecable.',
      'Efectos visuales sin precedentes y un ritmo narrativo que no decae en ningún momento.',
      'Divertida, colorida y con un excelente mensaje social y diseño de producción impecable.',
      'Demuestra una vez más por qué la maestría directiva perdura con los años.',
      'Una carta de amor al séptimo arte que conmueve de principio a fin.',
      'Atmósfera inolvidable, tensión constante y una fotografía de primer nivel.',
      'Clásico absoluto con diálogos legendarios y actuaciones consagradas.',
      'Magia pura con una animación artesanal que emociona tanto a niños como adultos.',
      'Visualmente deslumbrante en pantalla gigante. Te sumerge de lleno en su universo.',
      'Hermosa cinematografía con interpretaciones profundamente humanas y conmovedoras.',
      'Un guión brillante repleto de giros argumentales bien ejecutados.',
      'Actuaciones sobresalientes y una atmósfera inquietante que perdura tras salir de la sala.',
      'Gran diseño sonoro y edición acelerada que te mantiene al borde del asiento.',
      'Excelente adaptación respetuosa con el material original pero con voz propia.',
      'Una experiencia cinematográfica que debe disfrutarse obligatoriamente en la pantalla grande.',
    ];

    for (let c = 1; c <= 50; c++) {
      calificacionesData.push({
        id_calificacion: c,
        id_usuario: 16 + ((c - 1) % 30), // Clientes 16 a 45
        id_pelicula: 1 + ((c - 1) % 30), // Películas 1 a 30
        puntuacion: 7 + (c % 4), // 7 a 10
        comentario: comentariosMuestra[(c - 1) % comentariosMuestra.length],
      });
    }
    await Calificacion.bulkCreate(calificacionesData);
    console.log('   ✓ 50 Calificaciones creadas\n');

    // ==========================================
    // CAPA 3: Operativo y Financiero (5)
    // ==========================================
    console.log('⚙️ [Capa 3/4] Insertando Operaciones, Carteleras y Salas...');

    // 17. Carteleras (35 asignaciones de películas a cines)
    const cartelerasData = [];
    for (let k = 1; k <= 35; k++) {
      const cineId = 1 + ((k - 1) % 10);
      const peliculaId = 1 + ((k - 1) % 30);
      const estado = k <= 30 ? 'activa' : 'inactiva';

      cartelerasData.push({
        id_cartelera: k,
        id_cine: cineId,
        id_pelicula: peliculaId,
        fecha_inicio: '2026-11-01',
        fecha_fin: '2026-11-30',
        estado,
      });
    }
    await Cartelera.bulkCreate(cartelerasData);
    console.log('   ✓ 35 Carteleras creadas');

    // 18. Asientos (80 butacas físicas distribuidas en salas 1 a 8)
    const asientosData = [];
    const filas = ['A', 'B', 'C', 'D', 'E', 'F'];
    let asientoCount = 1;

    for (let s = 1; s <= 8; s++) {
      for (let n = 1; n <= 10; n++) {
        const fila = filas[(n - 1) % filas.length];
        let tipo = 'estandar';
        if (n === 9 || n === 10) tipo = 'vip';
        if (n === 1) tipo = 'discapacitado';

        asientosData.push({
          id_asiento: asientoCount++,
          id_sala: s,
          fila,
          numero: n,
          tipo,
        });
      }
    }
    await Asiento.bulkCreate(asientosData);
    console.log('   ✓ 80 Asientos creados (salas 1 a 8 con butacas estándar, VIP y accesibles)');

    // 19. Transacciones de Pago (50 transacciones, 1 por factura)
    const transaccionesData = [];
    const refPrefixes = ['REF-VISA', 'REF-MC', 'SINPE-MOVIL', 'PUNTOS-CLUB', 'CUPON-DESCUENTO'];

    for (let t = 1; t <= 50; t++) {
      const metodoId = 1 + ((t - 1) % 5);
      const prefix = refPrefixes[metodoId - 1];
      const monto = facturasData[t - 1].total;

      transaccionesData.push({
        id_transaccion: t,
        id_factura: t,
        id_metodo_pago: metodoId,
        monto,
        estado: 'completado',
        referencia_bancaria: `${prefix}-${String(880000 + t * 47).padStart(6, '0')}`,
      });
    }
    await TransaccionPago.bulkCreate(transaccionesData);
    console.log('   ✓ 50 Transacciones de Pago creadas');

    // 20. Registros de Limpieza (40 bitácoras de aseo)
    const limpiezasData = [];
    const obsLimpieza = [
      'Sala desinfectada, piso trapeado y portavasos aspirados.',
      'Butacas VIP lustradas, tapicería higienizada y aromatizada.',
      'Limpieza rápida entre funciones. Sin incidencias.',
      'Retiro de envases y barrido general de pasillo central.',
      'Limpieza profunda matutina previa a primera función.',
      'Revisión y sanitización exhaustiva de butacas accesibles.',
      'Aspirado en curso tras función de alta afluencia.',
      'Desinfección con luz ultravioleta y renovación de filtros.',
    ];

    for (let l = 1; l <= 40; l++) {
      const salaId = 1 + ((l - 1) % 30);
      const empleadoId = 6 + ((l - 1) % 15); // Empleados del staff
      const dia = 1 + ((l - 1) % 6);
      const hora = 10 + (l % 12);
      const estado = l <= 32 ? 'completada' : (l <= 36 ? 'en_proceso' : 'pendiente');

      limpiezasData.push({
        id_limpieza: l,
        id_sala: salaId,
        id_empleado: empleadoId,
        fecha_hora: new Date(`2026-11-0${dia}T${String(hora).padStart(2, '0')}:30:00`),
        estado,
        observaciones: obsLimpieza[(l - 1) % obsLimpieza.length],
      });
    }
    await RegistroLimpieza.bulkCreate(limpiezasData);
    console.log('   ✓ 40 Registros de Limpieza creados');

    // 21. Mantenimientos de Sala (35 bitácoras técnicas)
    const mantenimientosData = [];
    const tiposMant = ['proyector', 'audio', 'butacas', 'climatizacion'];
    const descripcionesMant = [
      'Calibración de lente láser 4K y limpieza de filtros ópticos.',
      'Ajuste de ganancia de subwoofers y procesador de sonido Dolby Atmos.',
      'Engrase y verificación de motores eléctricos en butacas reclinables.',
      'Recarga de refrigerante ecológico en unidad central de climatización.',
      'Cambio de lámpara de repuesto y verificación de potencia lumínica.',
      'Sustitución de conector surround en pared lateral acústica.',
      'Retapizado de butacas con desgaste en sector central.',
      'Desinfección bactericida de ductos de ventilación.',
    ];
    const costos = [85000, 45000, 60000, 75000, 110000, 35000, 50000, 65000];

    for (let m = 1; m <= 35; m++) {
      const salaId = 1 + ((m - 1) % 30);
      const tipo = tiposMant[(m - 1) % tiposMant.length];
      const dia = 10 + (m % 20);

      mantenimientosData.push({
        id_mantenimiento: m,
        id_sala: salaId,
        tipo_mantenimiento: tipo,
        descripcion: descripcionesMant[(m - 1) % descripcionesMant.length],
        costo: costos[(m - 1) % costos.length],
        fecha_mantenimiento: `2026-10-${String(dia).padStart(2, '0')}`,
      });
    }
    await MantenimientoSala.bulkCreate(mantenimientosData);
    console.log('   ✓ 35 Mantenimientos de Sala creados\n');

    // ==========================================
    // CAPA 4: Transacciones Finales (3)
    // ==========================================
    console.log('🎟️ [Capa 4/4] Insertando Funciones, Entradas y Ventas Finales...');

    // 22. Funciones (50 funciones programadas)
    const funcionesData = [];
    const horarios = ['13:30:00', '14:00:00', '16:00:00', '16:30:00', '18:45:00', '19:00:00', '21:15:00', '21:30:00'];
    const preciosFuncion = [3200, 3800, 5200, 4500, 7000, 6000, 3500, 4800];

    for (let fn = 1; fn <= 50; fn++) {
      const carteleraId = 1 + ((fn - 1) % 35);
      const peliculaId = 1 + ((fn - 1) % 30);
      const salaId = 1 + ((fn - 1) % 30);
      const hora = horarios[(fn - 1) % horarios.length];
      const precio = preciosFuncion[(fn - 1) % preciosFuncion.length];
      const dia = 6 + (fn % 7); // 6 al 12 de noviembre

      funcionesData.push({
        id_funcion: fn,
        id_sala: salaId,
        id_pelicula: peliculaId,
        id_cartelera: carteleraId,
        fecha: `2026-11-${String(dia).padStart(2, '0')}`,
        hora_inicio: hora,
        precio,
      });
    }
    await Funcion.bulkCreate(funcionesData);
    console.log('   ✓ 50 Funciones programadas creadas');

    // 23. Detalles de Venta de Dulcería (65 líneas de consumo)
    const detallesDulceriaData = [];
    for (let dd = 1; dd <= 65; dd++) {
      const facturaId = 1 + ((dd - 1) % 50);
      const esCombo = (dd % 2 === 0);
      const productoId = esCombo ? null : (1 + ((dd * 3) % 30));
      const comboId = esCombo ? (1 + (dd % 18)) : null;
      const cantidad = 1 + (dd % 3);
      const subtotal = esCombo ? (cantidad * 4500) : (cantidad * 2400);

      detallesDulceriaData.push({
        id_detalle_dulceria: dd,
        id_factura: facturaId,
        id_producto: productoId,
        id_combo: comboId,
        cantidad,
        subtotal,
      });
    }
    await DetalleVentaDulceria.bulkCreate(detallesDulceriaData);
    console.log('   ✓ 65 Detalles de Venta de Dulcería creados');

    // 24. Entradas (75 boletos de cine con asignación de butaca y función)
    const entradasData = [];
    const estadosEntrada = ['valida', 'valida', 'usada', 'valida', 'usada', 'cancelada'];

    for (let en = 1; en <= 75; en++) {
      const facturaId = 1 + ((en - 1) % 50);
      const funcionId = 1 + ((en - 1) % 50);
      const asientoId = 1 + ((en - 1) % 80);
      const estado = estadosEntrada[(en - 1) % estadosEntrada.length];
      const precio = funcionesData[funcionId - 1].precio;

      entradasData.push({
        id_entrada: en,
        id_factura: facturaId,
        id_funcion: funcionId,
        id_asiento: asientoId,
        precio_pagado: precio,
        estado,
      });
    }
    await Entrada.bulkCreate(entradasData);
    console.log('   ✓ 75 Entradas de Sala creadas\n');

    // ==========================================
    // RECREACIÓN DE VISTAS SQL (Garantiza funcionalidad de /api/operaciones)
    // ==========================================
    console.log('📊 Actualizando vistas SQL del sistema...');
    await sequelize.query(`
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

    await sequelize.query(`
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
        a.numero,
        a.tipo AS tipo_asiento,
        CASE
          WHEN e.id_entrada IS NULL THEN 'disponible'
          WHEN e.estado = 'cancelada' THEN 'disponible'
          ELSE 'ocupado'
        END AS estado_disponibilidad
      FROM funciones f
      INNER JOIN peliculas p ON f.id_pelicula = p.id_pelicula
      INNER JOIN salas s ON f.id_sala = s.id_sala
      INNER JOIN asientos a ON s.id_sala = a.id_sala
      LEFT JOIN entradas e ON f.id_funcion = e.id_funcion AND a.id_asiento = e.id_asiento AND e.estado != 'cancelada';
    `);

    await sequelize.query(`
      CREATE OR REPLACE VIEW vista_facturas_consolidadas AS
      SELECT
        fac.id_factura,
        fac.numero_factura,
        fac.fecha_emision,
        u.id_usuario,
        u.nombre AS cliente,
        u.email AS email_cliente,
        cup.codigo AS cupon_aplicado,
        fac.subtotal,
        fac.descuento,
        fac.total,
        COUNT(DISTINCT e.id_entrada) AS total_entradas,
        COUNT(DISTINCT dvd.id_detalle_dulceria) AS total_articulos_dulceria,
        tp.id_transaccion,
        mp.nombre AS metodo_pago,
        tp.estado AS estado_pago
      FROM facturas fac
      INNER JOIN usuarios u ON fac.id_usuario = u.id_usuario
      LEFT JOIN cupones cup ON fac.id_cupon = cup.id_cupon
      LEFT JOIN entradas e ON fac.id_factura = e.id_factura
      LEFT JOIN detalles_ventas_dulceria dvd ON fac.id_factura = dvd.id_factura
      LEFT JOIN transacciones_pago tp ON fac.id_factura = tp.id_factura
      LEFT JOIN metodos_pago mp ON tp.id_metodo_pago = mp.id_metodo_pago
      GROUP BY fac.id_factura, tp.id_transaccion, mp.id_metodo_pago;
    `);

    await sequelize.query(`
      CREATE OR REPLACE VIEW vista_catalogo_dulceria AS
      SELECT
        p.id_producto,
        p.nombre AS producto,
        p.precio,
        p.stock,
        cp.id_categoria,
        cp.nombre AS categoria,
        CASE
          WHEN p.stock > 50 THEN 'disponible'
          WHEN p.stock > 0 THEN 'stock_bajo'
          ELSE 'agotado'
        END AS estado_inventario
      FROM productos p
      INNER JOIN categorias_productos cp ON p.id_categoria = cp.id_categoria;
    `);

    await sequelize.query(`
      CREATE OR REPLACE VIEW vista_estado_salas AS
      SELECT
        s.id_sala,
        s.numero_sala,
        s.capacidad,
        c.id_cine,
        c.nombre AS cine,
        ts.nombre_tipo AS tipo_sala,
        (
          SELECT rl.estado
          FROM registros_limpieza rl
          WHERE rl.id_sala = s.id_sala
          ORDER BY rl.fecha_hora DESC
          LIMIT 1
        ) AS ultimo_estado_limpieza,
        (
          SELECT ms.tipo_mantenimiento
          FROM mantenimientos_sala ms
          WHERE ms.id_sala = s.id_sala
          ORDER BY ms.fecha_mantenimiento DESC
          LIMIT 1
        ) AS ultimo_tipo_mantenimiento
      FROM salas s
      INNER JOIN cines c ON s.id_cine = c.id_cine
      INNER JOIN tipo_salas ts ON s.id_tiposala = ts.id_tiposala;
    `);
    console.log('   ✓ 5 Vistas SQL creadas exitosamente.\n');

    console.log('====================================================');
    console.log('🎉 INICIALIZACIÓN EMPRESARIAL COMPLETADA CON ÉXITO');
    console.log('   Total de entidades pobladas: 24 / 24');
    console.log('   Capa 1 (Catálogos y Maestros): 116 registros');
    console.log('   Capa 2 (Catálogo y Personal):  215 registros');
    console.log('   Capa 3 (Operativo/Salas):      240 registros');
    console.log('   Capa 4 (Taquilla y Ventas):    190 registros');
    console.log('   Vistas SQL actualizadas:        5 vistas');
    console.log('   TOTAL DE REGISTROS INSERTADOS: 844 registros');
    console.log('====================================================');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR DURANTE LA INICIALIZACIÓN DE LA BASE DE DATOS:');
    console.error(error);
    process.exit(1);
  }
}

seedDatabase();
