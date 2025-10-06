const express = require('express');
const Client = require('../models/Client');
const { protect, authorize } = require('../middleware/auth');
const { validateClient, validateId, handleValidationErrors } = require('../middleware/validation');
const { uploadClientDocument, handleMulterError, getFileUrl } = require('../middleware/upload');
const { query } = require('express-validator');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// @desc    Obtener todos los clientes
// @route   GET /API/Cliente/Obtener
// @access  Private
router.get('/Obtener', async (req, res) => {
  try {
    const clients = await Client.find({ activo: true })
      .populate('idUsuarioCreador', 'nombre apellido')
      .sort({ fechaCreacion: -1 });

    res.json({
      status: true,
      message: 'Clientes obtenidos exitosamente',
      value: clients
    });

  } catch (error) {
    console.error('Error obteniendo clientes:', error);
    res.status(500).json({
      status: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

// @desc    Obtener cliente por ID
// @route   GET /API/Cliente/Obtener/:id
// @access  Private
router.get('/Obtener/:id', validateId, async (req, res) => {
  try {
    const client = await Client.findOne({ _id: req.params.id, activo: true })
      .populate('idUsuarioCreador', 'nombre apellido');

    if (!client) {
      return res.status(404).json({
        status: false,
        message: 'Cliente no encontrado'
      });
    }

    res.json({
      status: true,
      message: 'Cliente obtenido exitosamente',
      value: client
    });

  } catch (error) {
    console.error('Error obteniendo cliente:', error);
    res.status(500).json({
      status: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

// @desc    Obtener clientes por rol
// @route   GET /API/Cliente/PorRol/:role
// @access  Private
router.get('/PorRol/:role', [
  query('tipoAlquiler')
    .optional()
    .isIn(['Alquiler Temporario', 'Alquiler'])
    .withMessage('Tipo de alquiler inválido'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { role } = req.params;
    const { tipoAlquiler } = req.query;

    // Validar rol
    const validRoles = ['Locador', 'Locatario', 'Propietario', 'Comprador'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        status: false,
        message: 'Rol inválido'
      });
    }

    const clients = await Client.getByRole(role, tipoAlquiler);

    res.json({
      status: true,
      message: `Clientes con rol '${role}' obtenidos exitosamente`,
      value: clients
    });

  } catch (error) {
    console.error('Error obteniendo clientes por rol:', error);
    res.status(500).json({
      status: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

// @desc    Buscar clientes
// @route   GET /API/Cliente/Buscar
// @access  Private
router.get('/Buscar', [
  query('nombre')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('El nombre no puede exceder 255 caracteres'),
  query('dni')
    .optional()
    .trim()
    .matches(/^[0-9]*$/)
    .withMessage('El DNI debe contener solo números'),
  query('email')
    .optional()
    .isEmail()
    .withMessage('Email inválido'),
  query('rol')
    .optional()
    .isIn(['Locador', 'Locatario', 'Propietario', 'Comprador'])
    .withMessage('Rol inválido'),
  query('tipoAlquiler')
    .optional()
    .isIn(['Alquiler Temporario', 'Alquiler'])
    .withMessage('Tipo de alquiler inválido'),
  query('tienePropiedad')
    .optional()
    .isBoolean()
    .withMessage('TienePropiedad debe ser true o false'),
  handleValidationErrors
], async (req, res) => {
  try {
    const filters = {
      nombre: req.query.nombre,
      dni: req.query.dni,
      email: req.query.email,
      rol: req.query.rol,
      tipoAlquiler: req.query.tipoAlquiler,
      tienePropiedad: req.query.tienePropiedad
    };

    const clients = await Client.searchClients(filters);

    res.json({
      status: true,
      message: `Se encontraron ${clients.length} clientes`,
      value: clients
    });

  } catch (error) {
    console.error('Error en búsqueda de clientes:', error);
    res.status(500).json({
      status: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

// @desc    Crear nuevo cliente
// @route   POST /API/Cliente/Crear
// @access  Private
router.post('/Crear', validateClient, async (req, res) => {
  try {
    // Verificar si ya existe un cliente con el mismo DNI
    const existingDni = await Client.findOne({ dni: req.body.dni, activo: true });
    if (existingDni) {
      return res.status(400).json({
        status: false,
        message: 'Ya existe un cliente con este DNI'
      });
    }

    // Verificar si ya existe un cliente con el mismo email
    const existingEmail = await Client.findOne({ email: req.body.email.toLowerCase(), activo: true });
    if (existingEmail) {
      return res.status(400).json({
        status: false,
        message: 'Ya existe un cliente con este email'
      });
    }

    const clientData = {
      ...req.body,
      email: req.body.email.toLowerCase(),
      idUsuarioCreador: req.user._id
    };

    const client = new Client(clientData);
    await client.save();

    // Populate para la respuesta
    await client.populate('idUsuarioCreador', 'nombre apellido');

    res.status(201).json({
      status: true,
      message: 'Cliente creado exitosamente',
      value: client
    });

  } catch (error) {
    console.error('Error creando cliente:', error);
    res.status(500).json({
      status: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

// @desc    Actualizar cliente
// @route   PUT /API/Cliente/Actualizar/:id
// @access  Private
router.put('/Actualizar/:id', [validateId, validateClient], async (req, res) => {
  try {
    const client = await Client.findOne({ _id: req.params.id, activo: true });

    if (!client) {
      return res.status(404).json({
        status: false,
        message: 'Cliente no encontrado'
      });
    }

    // Verificar permisos (propietario o admin)
    if (client.idUsuarioCreador.toString() !== req.user._id.toString() && req.user.idrol !== 3) {
      return res.status(403).json({
        status: false,
        message: 'No tienes permisos para editar este cliente'
      });
    }

    // Verificar DNI único (excluyendo el cliente actual)
    if (req.body.dni !== client.dni) {
      const existingDni = await Client.findOne({ 
        dni: req.body.dni, 
        _id: { $ne: req.params.id },
        activo: true 
      });
      if (existingDni) {
        return res.status(400).json({
          status: false,
          message: 'Ya existe otro cliente con este DNI'
        });
      }
    }

    // Verificar email único (excluyendo el cliente actual)
    if (req.body.email.toLowerCase() !== client.email) {
      const existingEmail = await Client.findOne({ 
        email: req.body.email.toLowerCase(), 
        _id: { $ne: req.params.id },
        activo: true 
      });
      if (existingEmail) {
        return res.status(400).json({
          status: false,
          message: 'Ya existe otro cliente con este email'
        });
      }
    }

    const updateData = {
      ...req.body,
      email: req.body.email.toLowerCase()
    };

    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('idUsuarioCreador', 'nombre apellido');

    res.json({
      status: true,
      message: 'Cliente actualizado exitosamente',
      value: updatedClient
    });

  } catch (error) {
    console.error('Error actualizando cliente:', error);
    res.status(500).json({
      status: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

// @desc    Eliminar cliente (soft delete)
// @route   DELETE /API/Cliente/Eliminar/:id
// @access  Private
router.delete('/Eliminar/:id', validateId, async (req, res) => {
  try {
    const client = await Client.findOne({ _id: req.params.id, activo: true });

    if (!client) {
      return res.status(404).json({
        status: false,
        message: 'Cliente no encontrado'
      });
    }

    // Verificar permisos (propietario o admin)
    if (client.idUsuarioCreador.toString() !== req.user._id.toString() && req.user.idrol !== 3) {
      return res.status(403).json({
        status: false,
        message: 'No tienes permisos para eliminar este cliente'
      });
    }

    // Verificar si el cliente está asociado a propiedades o reservas activas
    const Property = require('../models/Property');
    const Reservation = require('../models/Reservation');

    const hasActiveProperties = await Property.findOne({
      $or: [
        { idClienteLocador: req.params.id },
        { idClienteLocatario: req.params.id },
        { idClientePropietario: req.params.id },
        { idClienteComprador: req.params.id }
      ],
      activo: true
    });

    const hasActiveReservations = await Reservation.findOne({
      idCliente: req.params.id,
      estado: { $in: ['Pendiente', 'Confirmada'] }
    });

    if (hasActiveProperties || hasActiveReservations) {
      return res.status(400).json({
        status: false,
        message: 'No se puede eliminar el cliente porque está asociado a propiedades o reservas activas'
      });
    }

    // Soft delete
    client.activo = false;
    await client.save();

    res.json({
      status: true,
      message: 'Cliente eliminado exitosamente',
      value: true
    });

  } catch (error) {
    console.error('Error eliminando cliente:', error);
    res.status(500).json({
      status: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

// @desc    Subir documento de cliente
// @route   POST /API/Cliente/SubirDocumento/:id
// @access  Private
router.post('/SubirDocumento/:id', [
  validateId,
  ...uploadClientDocument,
  handleMulterError
], async (req, res) => {
  try {
    const client = await Client.findOne({ _id: req.params.id, activo: true });

    if (!client) {
      return res.status(404).json({
        status: false,
        message: 'Cliente no encontrado'
      });
    }

    // Verificar permisos
    if (client.idUsuarioCreador.toString() !== req.user._id.toString() && req.user.idrol !== 3) {
      return res.status(403).json({
        status: false,
        message: 'No tienes permisos para subir documentos a este cliente'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: 'No se recibió ningún archivo'
      });
    }

    // Actualizar ruta del documento en el cliente
    const documentPath = `clientes/${req.params.id}/${req.file.filename}`;
    client.rutaReciboSueldo = documentPath;
    await client.save();

    res.json({
      status: true,
      message: 'Documento subido exitosamente',
      rutaDocumento: getFileUrl(req, documentPath)
    });

  } catch (error) {
    console.error('Error subiendo documento:', error);
    res.status(500).json({
      status: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

// @desc    Obtener estadísticas de clientes
// @route   GET /API/Cliente/Estadisticas
// @access  Private
router.get('/Estadisticas', async (req, res) => {
  try {
    const clients = await Client.find({ activo: true });
    
    const stats = {
      total: clients.length,
      locadores: clients.filter(c => c.rol === 'Locador').length,
      locatarios: clients.filter(c => c.rol === 'Locatario').length,
      propietarios: clients.filter(c => c.rol === 'Propietario').length,
      compradores: clients.filter(c => c.rol === 'Comprador').length,
      alquilerTemporario: clients.filter(c => c.tipoAlquiler === 'Alquiler Temporario').length,
      alquilerTradicional: clients.filter(c => c.tipoAlquiler === 'Alquiler').length,
      conPropiedades: clients.filter(c => c.tienePropiedad).length,
      ultimaSemana: clients.filter(c => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return c.fechaCreacion >= weekAgo;
      }).length,
      porEdad: {
        jovenes: clients.filter(c => c.edad && c.edad < 30).length,
        adultos: clients.filter(c => c.edad && c.edad >= 30 && c.edad < 60).length,
        mayores: clients.filter(c => c.edad && c.edad >= 60).length
      }
    };

    res.json({
      status: true,
      message: 'Estadísticas obtenidas exitosamente',
      value: stats
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      status: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

module.exports = router;
