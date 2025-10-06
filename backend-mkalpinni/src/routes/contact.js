const express = require('express');
const Contact = require('../models/Contact');
const { protect, optionalAuth } = require('../middleware/auth');
const { validateContact, validateId, handleValidationErrors } = require('../middleware/validation');
const { body, query } = require('express-validator');

const router = express.Router();

// @desc    Enviar mensaje de contacto
// @route   POST /API/Contacto/Enviar
// @access  Public
router.post('/Enviar', validateContact, async (req, res) => {
  try {
    // Capturar información adicional del request
    const contactData = {
      ...req.body,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent')
    };

    const contact = new Contact(contactData);
    await contact.save();

    res.json({
      status: true,
      message: 'Mensaje enviado exitosamente. Te responderemos pronto.',
      value: contact.idContacto
    });

  } catch (error) {
    console.error('Error enviando contacto:', error);
    res.status(500).json({
      status: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

// @desc    Obtener todos los contactos
// @route   GET /API/Contacto/Obtener
// @access  Private
router.get('/Obtener', [
  protect,
  query('estado')
    .optional()
    .isIn(['Nuevo', 'En_Proceso', 'Respondido', 'Cerrado'])
    .withMessage('Estado inválido'),
  query('tipo')
    .optional()
    .isIn(['General', 'Propiedad', 'Tasacion', 'Alquiler', 'Venta', 'Soporte'])
    .withMessage('Tipo de consulta inválido'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { estado, tipo } = req.query;
    
    let query = {};
    if (estado) query.estado = estado;
    if (tipo) query.tipoConsulta = tipo;

    const contacts = await Contact.find(query)
      .populate('idPropiedadConsulta', 'titulo direccion precio')
      .populate('idUsuarioAsignado', 'nombre apellido')
      .sort({ fechaContacto: -1 });

    res.json({
      status: true,
      message: 'Contactos obtenidos exitosamente',
      value: contacts
    });

  } catch (error) {
    console.error('Error obteniendo contactos:', error);
    res.status(500).json({
      status: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

// @desc    Obtener contacto por ID
// @route   GET /API/Contacto/Obtener/:id
// @access  Private
router.get('/Obtener/:id', [protect, validateId], async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('idPropiedadConsulta', 'titulo direccion precio imagenes')
      .populate('idUsuarioAsignado', 'nombre apellido correo');

    if (!contact) {
      return res.status(404).json({
        status: false,
        message: 'Contacto no encontrado'
      });
    }

    res.json({
      status: true,
      message: 'Contacto obtenido exitosamente',
      value: contact
    });

  } catch (error) {
    console.error('Error obteniendo contacto:', error);
    res.status(500).json({
      status: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

// @desc    Responder contacto
// @route   PUT /API/Contacto/Responder/:id
// @access  Private
router.put('/Responder/:id', [
  protect,
  validateId,
  body('respuesta')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('La respuesta debe tener entre 10 y 2000 caracteres'),
  handleValidationErrors
], async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        status: false,
        message: 'Contacto no encontrado'
      });
    }

    if (contact.estado === 'Cerrado') {
      return res.status(400).json({
        status: false,
        message: 'No se puede responder un contacto cerrado'
      });
    }

    await contact.responder(req.body.respuesta, req.user._id);

    // Recargar con populate
    await contact.populate('idUsuarioAsignado', 'nombre apellido');

    res.json({
      status: true,
      message: 'Respuesta enviada exitosamente',
      value: contact
    });

  } catch (error) {
    console.error('Error respondiendo contacto:', error);
    res.status(500).json({
      status: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

// @desc    Cambiar estado de contacto
// @route   PUT /API/Contacto/CambiarEstado/:id
// @access  Private
router.put('/CambiarEstado/:id', [
  protect,
  validateId,
  body('estado')
    .isIn(['Nuevo', 'En_Proceso', 'Respondido', 'Cerrado'])
    .withMessage('Estado inválido'),
  handleValidationErrors
], async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        status: false,
        message: 'Contacto no encontrado'
      });
    }

    await contact.cambiarEstado(req.body.estado, req.user._id);

    // Recargar con populate
    await contact.populate('idUsuarioAsignado', 'nombre apellido');

    res.json({
      status: true,
      message: 'Estado actualizado exitosamente',
      value: contact
    });

  } catch (error) {
    console.error('Error cambiando estado:', error);
    res.status(500).json({
      status: false,
      message: error.message || 'Error interno del servidor'
    });
  }
});

// @desc    Buscar contactos
// @route   GET /API/Contacto/Buscar
// @access  Private
router.get('/Buscar', [
  protect,
  query('termino')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El término de búsqueda debe tener entre 2 y 100 caracteres'),
  query('fechaDesde')
    .optional()
    .isISO8601()
    .withMessage('Fecha desde inválida'),
  query('fechaHasta')
    .optional()
    .isISO8601()
    .withMessage('Fecha hasta inválida'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { termino, fechaDesde, fechaHasta } = req.query;
    
    let query = {};

    // Búsqueda por texto
    if (termino) {
      query.$text = { $search: termino };
    }

    // Filtro por fechas
    if (fechaDesde || fechaHasta) {
      query.fechaContacto = {};
      if (fechaDesde) query.fechaContacto.$gte = new Date(fechaDesde);
      if (fechaHasta) query.fechaContacto.$lte = new Date(fechaHasta);
    }

    const contacts = await Contact.find(query)
      .populate('idPropiedadConsulta', 'titulo direccion')
      .populate('idUsuarioAsignado', 'nombre apellido')
      .sort({ fechaContacto: -1 });

    res.json({
      status: true,
      message: `Se encontraron ${contacts.length} contactos`,
      value: contacts
    });

  } catch (error) {
    console.error('Error buscando contactos:', error);
    res.status(500).json({
      status: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

// @desc    Obtener estadísticas de contactos
// @route   GET /API/Contacto/Estadisticas
// @access  Private
router.get('/Estadisticas', protect, async (req, res) => {
  try {
    const stats = await Contact.getEstadisticas();

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

// @desc    Obtener contactos pendientes de respuesta
// @route   GET /API/Contacto/Pendientes
// @access  Private
router.get('/Pendientes', protect, async (req, res) => {
  try {
    const contacts = await Contact.find({ 
      estado: { $in: ['Nuevo', 'En_Proceso'] }
    })
    .populate('idPropiedadConsulta', 'titulo direccion')
    .populate('idUsuarioAsignado', 'nombre apellido')
    .sort({ fechaContacto: 1 }); // Los más antiguos primero

    res.json({
      status: true,
      message: 'Contactos pendientes obtenidos exitosamente',
      value: contacts
    });

  } catch (error) {
    console.error('Error obteniendo contactos pendientes:', error);
    res.status(500).json({
      status: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

// @desc    Marcar contacto como leído
// @route   PUT /API/Contacto/MarcarLeido/:id
// @access  Private
router.put('/MarcarLeido/:id', [protect, validateId], async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        status: false,
        message: 'Contacto no encontrado'
      });
    }

    if (contact.estado === 'Nuevo') {
      await contact.cambiarEstado('En_Proceso', req.user._id);
    }

    res.json({
      status: true,
      message: 'Contacto marcado como leído',
      value: contact
    });

  } catch (error) {
    console.error('Error marcando como leído:', error);
    res.status(500).json({
      status: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

// @desc    Eliminar contacto
// @route   DELETE /API/Contacto/Eliminar/:id
// @access  Private (solo admin)
router.delete('/Eliminar/:id', [protect, validateId], async (req, res) => {
  try {
    // Solo administradores pueden eliminar
    if (req.user.idrol !== 3) {
      return res.status(403).json({
        status: false,
        message: 'No tienes permisos para eliminar contactos'
      });
    }

    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        status: false,
        message: 'Contacto no encontrado'
      });
    }

    res.json({
      status: true,
      message: 'Contacto eliminado exitosamente',
      value: true
    });

  } catch (error) {
    console.error('Error eliminando contacto:', error);
    res.status(500).json({
      status: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

module.exports = router;
