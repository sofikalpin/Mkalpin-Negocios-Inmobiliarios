const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  apellido: {
    type: String,
    required: [true, 'El apellido es requerido'],
    trim: true,
    maxlength: [100, 'El apellido no puede exceder 100 caracteres']
  },
  correo: {
    type: String,
    required: [true, 'El correo es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Por favor ingresa un correo electrónico válido'
    ]
  },
  contrasenaHash: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  idrol: {
    type: Number,
    required: true,
    enum: [1, 2, 3], // 1: Propietario, 2: Inquilino, 3: Administrador
    default: 2
  },
  rol: {
    type: String,
    enum: ['Propietario', 'Inquilino', 'Administrador'],
    default: 'Inquilino'
  },
  autProf: {
    type: Boolean,
    default: false
  },
  telefono: {
    type: String,
    trim: true,
    maxlength: [20, 'El teléfono no puede exceder 20 caracteres']
  },
  activo: {
    type: Boolean,
    default: true
  },
  ultimoAcceso: {
    type: Date
  },
  intentosLogin: {
    type: Number,
    default: 0
  },
  bloqueadoHasta: {
    type: Date
  }
}, {
  timestamps: {
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion'
  }
});

// Índices (correo ya tiene índice único automático)
userSchema.index({ idrol: 1 });
userSchema.index({ activo: 1 });

// Middleware para hashear contraseña antes de guardar
userSchema.pre('save', async function(next) {
  // Solo hashear si la contraseña fue modificada
  if (!this.isModified('contrasenaHash')) return next();
  
  try {
    // Hashear contraseña
    const salt = await bcrypt.genSalt(12);
    this.contrasenaHash = await bcrypt.hash(this.contrasenaHash, salt);
    
    // Establecer rol basado en idrol
    switch(this.idrol) {
      case 1:
        this.rol = 'Propietario';
        break;
      case 2:
        this.rol = 'Inquilino';
        break;
      case 3:
        this.rol = 'Administrador';
        this.autProf = true;
        break;
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.contrasenaHash);
};

// Método para obtener datos públicos del usuario
userSchema.methods.toPublicJSON = function() {
  const user = this.toObject();
  delete user.contrasenaHash;
  delete user.intentosLogin;
  delete user.bloqueadoHasta;
  return user;
};

// Método estático para buscar por email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ correo: email.toLowerCase(), activo: true });
};

// Middleware para actualizar ultimoAcceso en login
userSchema.methods.updateLastAccess = function() {
  this.ultimoAcceso = new Date();
  this.intentosLogin = 0;
  this.bloqueadoHasta = undefined;
  return this.save();
};

// Método para incrementar intentos de login fallidos
userSchema.methods.incrementLoginAttempts = function() {
  this.intentosLogin += 1;
  
  // Bloquear usuario después de 5 intentos fallidos
  if (this.intentosLogin >= 5) {
    this.bloqueadoHasta = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
  }
  
  return this.save();
};

// Virtual para verificar si el usuario está bloqueado
userSchema.virtual('isBlocked').get(function() {
  return this.bloqueadoHasta && this.bloqueadoHasta > new Date();
});

module.exports = mongoose.model('User', userSchema);
