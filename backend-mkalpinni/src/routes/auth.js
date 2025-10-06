const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect, generateToken } = require('../middleware/auth');
const { validateRegister, validateLogin, handleValidationErrors } = require('../middleware/validation');
const { body } = require('express-validator');

const router = express.Router();

// @desc    Registrar nuevo usuario
// @route   POST /API/Usuario/Registrar
// @access  Public
router.post('/Registrar', validateRegister, async (req, res) => {
  try {
    const { nombre, apellido, correo, contrasena, idrol, telefono } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ correo: correo.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: 'Ya existe un usuario con este correo electrónico'
      });
    }

    // Crear usuario
    const user = new User({
      nombre,
      apellido,
      correo: correo.toLowerCase(),
      contrasenaHash: contrasena, // Se hashea automáticamente en el pre-save
      idrol,
      telefono,
      autProf: idrol === 3 // Auto-autorizar administradores
    });

    await user.save();

    // Generar token
    const token = generateToken(user._id);

    res.status(201).json({
      status: true,
      message: 'Usuario registrado exitosamente',
      token,
      value: user.toPublicJSON(),
      idrol: user.idrol
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      status: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

// @desc    Iniciar sesión
// @route   POST /API/Usuario/IniciarSesion
// @access  Public
router.post('/IniciarSesion', validateLogin, async (req, res) => {
  try {
    const { correo, contrasenaHash } = req.body;

    // Buscar usuario por email
    const user = await User.findByEmail(correo);
    if (!user) {
      return res.status(400).json({
        status: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar si el usuario está bloqueado
    if (user.isBlocked) {
      return res.status(400).json({
        status: false,
        message: 'Usuario bloqueado temporalmente por intentos fallidos de login. Intenta más tarde.'
      });
    }

    // Verificar contraseña
    const isMatch = await user.comparePassword(contrasenaHash);
    if (!isMatch) {
      // Incrementar intentos fallidos
      await user.incrementLoginAttempts();
      
      return res.status(400).json({
        status: false,
        message: 'Credenciales inválidas'
      });
    }

    // Actualizar último acceso y resetear intentos
    await user.updateLastAccess();

    // Generar token
    const token = generateToken(user._id);

    res.json({
      status: true,
      message: 'Inicio de sesión exitoso',
      token,
      value: user.toPublicJSON(),
      idrol: user.idrol
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      status: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

// @desc    Obtener perfil del usuario
// @route   GET /API/Usuario/Perfil
// @access  Private
router.get('/Perfil', protect, async (req, res) => {
  try {
    res.json({
      status: true,
      message: 'Perfil obtenido exitosamente',
      value: req.user.toPublicJSON()
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      status: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

// @desc    Actualizar perfil
// @route   PUT /API/Usuario/Actualizar
// @access  Private
router.put('/Actualizar', [
  protect,
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('apellido')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El apellido debe tener entre 2 y 100 caracteres'),
  body('telefono')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('El teléfono no puede exceder 20 caracteres'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { nombre, apellido, telefono } = req.body;
    
    const updateFields = {};
    if (nombre) updateFields.nombre = nombre;
    if (apellido) updateFields.apellido = apellido;
    if (telefono) updateFields.telefono = telefono;
    
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        status: false,
        message: 'No se proporcionaron campos para actualizar'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      { new: true, runValidators: true }
    ).select('-contrasenaHash');

    res.json({
      status: true,
      message: 'Perfil actualizado exitosamente',
      value: user.toPublicJSON()
    });

  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({
      status: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

// @desc    Cambiar contraseña
// @route   PUT /API/Usuario/CambiarContrasena
// @access  Private
router.put('/CambiarContrasena', [
  protect,
  body('contrasenaActual')
    .notEmpty()
    .withMessage('La contraseña actual es requerida'),
  body('contrasenaNueva')
    .isLength({ min: 6 })
    .withMessage('La nueva contraseña debe tener al menos 6 caracteres'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { contrasenaActual, contrasenaNueva } = req.body;

    // Obtener usuario con contraseña
    const user = await User.findById(req.user._id);
    
    // Verificar contraseña actual
    const isMatch = await user.comparePassword(contrasenaActual);
    if (!isMatch) {
      return res.status(400).json({
        status: false,
        message: 'La contraseña actual es incorrecta'
      });
    }

    // Actualizar contraseña
    user.contrasenaHash = contrasenaNueva; // Se hashea automáticamente en pre-save
    await user.save();

    res.json({
      status: true,
      message: 'Contraseña cambiada exitosamente'
    });

  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    res.status(500).json({
      status: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

// @desc    Recuperar contraseña
// @route   POST /API/Usuario/RecuperarContrasena
// @access  Public
router.post('/RecuperarContrasena', [
  body('correo')
    .isEmail()
    .normalizeEmail()
    .withMessage('Debe ser un correo electrónico válido'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { correo } = req.body;

    const user = await User.findByEmail(correo);
    
    // Por seguridad, siempre retornamos el mismo mensaje
    res.json({
      status: true,
      message: 'Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña.'
    });

    // TODO: Implementar envío de email con token de recuperación
    if (user) {
      console.log(`Solicitud de recuperación de contraseña para: ${user.correo}`);
      // Aquí se implementaría el envío del email
    }

  } catch (error) {
    console.error('Error en recuperación de contraseña:', error);
    res.status(500).json({
      status: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

// @desc    Obtener todos los usuarios (solo admin)
// @route   GET /API/Usuario/Todos
// @access  Private/Admin
router.get('/Todos', [protect], async (req, res) => {
  try {
    // Verificar que sea administrador
    if (req.user.idrol !== 3) {
      return res.status(403).json({
        status: false,
        message: 'No tienes permisos para realizar esta acción'
      });
    }

    const users = await User.find({ activo: true })
      .select('-contrasenaHash -intentosLogin -bloqueadoHasta')
      .sort({ fechaCreacion: -1 });

    res.json({
      status: true,
      message: 'Usuarios obtenidos exitosamente',
      value: users.map(user => user.toPublicJSON())
    });

  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({
      status: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

// @desc    Desactivar usuario (solo admin)
// @route   DELETE /API/Usuario/Desactivar/:id
// @access  Private/Admin
router.delete('/Desactivar/:id', [protect], async (req, res) => {
  try {
    // Verificar que sea administrador
    if (req.user.idrol !== 3) {
      return res.status(403).json({
        status: false,
        message: 'No tienes permisos para realizar esta acción'
      });
    }

    const { id } = req.params;

    // No permitir desactivar el propio usuario
    if (id === req.user._id.toString()) {
      return res.status(400).json({
        status: false,
        message: 'No puedes desactivar tu propia cuenta'
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true }
    ).select('-contrasenaHash');

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      status: true,
      message: 'Usuario desactivado exitosamente',
      value: user.toPublicJSON()
    });

  } catch (error) {
    console.error('Error desactivando usuario:', error);
    res.status(500).json({
      status: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

module.exports = router;
