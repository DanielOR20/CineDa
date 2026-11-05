'use strict';
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { nombre, email, password, rol, telefono } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        error: 'Nombre, email y contraseña son obligatorios'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: 'La contraseña debe tener al menos 8 caracteres'
      });
    }

    // Verificar si el correo ya existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({
        error: 'El correo electrónico ya se encuentra registrado'
      });
    }

    // Crear usuario (el hook beforeCreate del modelo hashea la contraseña)
    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password,
      rol: rol || 'cliente',
      telefono: telefono || null
    });

    return res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      usuario: nuevoUsuario
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Error al registrar usuario'
    });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email y contraseña requeridos'
      });
    }

    // Buscar usuario por correo
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    // Validar contraseña
    const passwordValido = await usuario.validarPassword(password);
    if (!passwordValido) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    // Generar JWT
    const secret = process.env.JWT_SECRET || 'cineda_super_secret_jwt_key_2026_academic';
    const expiresIn = process.env.JWT_EXPIRES_IN || '8h';

    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        id: usuario.id_usuario,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol
      },
      secret,
      { expiresIn }
    );

    return res.status(200).json({
      token,
      usuario: {
        id: usuario.id_usuario,
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || 'Error al iniciar sesión'
    });
  }
};

// GET /api/auth/me
const me = async (req, res) => {
  try {
    // req.usuario contiene los datos decodificados por authMiddleware
    if (!req.usuario) {
      return res.status(401).json({
        error: 'No autorizado'
      });
    }

    const usuarioId = req.usuario.id_usuario || req.usuario.id;
    const usuario = await Usuario.findByPk(usuarioId);

    if (!usuario) {
      return res.status(200).json({
        success: true,
        usuario: req.usuario
      });
    }

    return res.status(200).json({
      success: true,
      usuario
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || 'Error al consultar usuario autenticado'
    });
  }
};

module.exports = {
  register,
  login,
  me
};

