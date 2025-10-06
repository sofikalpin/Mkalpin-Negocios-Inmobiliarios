const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para proteger rutas (requiere autenticación)
const protect = async (req, res, next) => {
  try {
    let token;
    
    // Obtener token del header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Verificar si existe el token
    if (!token) {
      return res.status(401).json({
        status: false,
        message: 'No tienes autorización para acceder a esta ruta, token requerido'
      });
    }
    
    try {
      // Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta_jwt_muy_larga_y_segura_aqui');
      
      // Obtener el usuario del token
      const user = await User.findById(decoded.id).select('-contrasenaHash');
      
      if (!user) {
        return res.status(401).json({
          status: false,
          message: 'El usuario asociado a este token ya no existe'
        });
      }
      
      // Verificar si el usuario está activo
      if (!user.activo) {
        return res.status(401).json({
          status: false,
          message: 'Usuario inactivo'
        });
      }
      
      // Verificar si el usuario no está bloqueado
      if (user.isBlocked) {
        return res.status(401).json({
          status: false,
          message: 'Usuario bloqueado temporalmente por intentos fallidos de login'
        });
      }
      
      // Agregar usuario a la request
      req.user = user;
      next();
      
    } catch (error) {
      return res.status(401).json({
        status: false,
        message: 'Token inválido'
      });
    }
    
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Error del servidor en autenticación',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
};

// Middleware para autorizar roles específicos
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: false,
        message: 'Usuario no autenticado'
      });
    }
    
    // Verificar si el rol del usuario está en los roles permitidos
    const userRole = req.user.rol || (req.user.idrol === 1 ? 'Propietario' : req.user.idrol === 2 ? 'Inquilino' : 'Administrador');
    
    if (!roles.includes(userRole) && !roles.includes(req.user.idrol)) {
      return res.status(403).json({
        status: false,
        message: `No tienes permisos para realizar esta acción. Rol requerido: ${roles.join(' o ')}`
      });
    }
    
    next();
  };
};

// Middleware opcional para rutas que pueden funcionar con o sin autenticación
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    
    // Obtener token del header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (token) {
      try {
        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta_jwt_muy_larga_y_segura_aqui');
        
        // Obtener el usuario del token
        const user = await User.findById(decoded.id).select('-contrasenaHash');
        
        // Solo agregar el usuario si existe y está activo
        if (user && user.activo && !user.isBlocked) {
          req.user = user;
        }
      } catch (error) {
        // Si hay error en el token, simplemente continuar sin usuario
        // No retornar error para permitir acceso público
      }
    }
    
    next();
  } catch (error) {
    // En caso de error del servidor, continuar sin usuario
    next();
  }
};

// Middleware para verificar ownership (propietario del recurso)
const checkOwnership = (model, idField = 'idUsuarioCreador') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      const userId = req.user._id;
      const userRole = req.user.rol;
      
      // Los administradores tienen acceso a todo
      if (userRole === 'Administrador' || req.user.idrol === 3) {
        return next();
      }
      
      // Buscar el recurso
      const resource = await model.findById(resourceId);
      
      if (!resource) {
        return res.status(404).json({
          status: false,
          message: 'Recurso no encontrado'
        });
      }
      
      // Verificar si el usuario es el propietario
      if (resource[idField].toString() !== userId.toString()) {
        return res.status(403).json({
          status: false,
          message: 'No tienes permisos para acceder a este recurso'
        });
      }
      
      // Agregar el recurso a la request para evitar otra consulta
      req.resource = resource;
      next();
      
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: 'Error verificando permisos',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
      });
    }
  };
};

// Generar token JWT
const generateToken = (id) => {
  return jwt.sign(
    { id }, 
    process.env.JWT_SECRET || 'tu_clave_secreta_jwt_muy_larga_y_segura_aqui',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    }
  );
};

// Verificar token sin middleware
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta_jwt_muy_larga_y_segura_aqui');
  } catch (error) {
    return null;
  }
};

module.exports = {
  protect,
  authorize,
  optionalAuth,
  checkOwnership,
  generateToken,
  verifyToken
};
