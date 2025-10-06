const mongoose = require('mongoose');

// Esquema para imágenes de propiedades
const imagenPropiedadSchema = new mongoose.Schema({
  rutaArchivo: {
    type: String,
    required: true
  },
  nombreArchivo: {
    type: String,
    required: true
  },
  orden: {
    type: Number,
    default: 0
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

// Esquema principal de propiedad
const propertySchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true,
    maxlength: [255, 'El título no puede exceder 255 caracteres']
  },
  descripcion: {
    type: String,
    trim: true,
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },
  direccion: {
    type: String,
    required: [true, 'La dirección es requerida'],
    trim: true,
    maxlength: [255, 'La dirección no puede exceder 255 caracteres']
  },
  barrio: {
    type: String,
    trim: true,
    maxlength: [100, 'El barrio no puede exceder 100 caracteres'],
    index: true
  },
  localidad: {
    type: String,
    trim: true,
    maxlength: [100, 'La localidad no puede exceder 100 caracteres']
  },
  provincia: {
    type: String,
    trim: true,
    maxlength: [100, 'La provincia no puede exceder 100 caracteres']
  },
  ubicacion: {
    type: String,
    trim: true,
    maxlength: [100, 'La ubicación no puede exceder 100 caracteres']
  },
  tipoPropiedad: {
    type: String,
    required: [true, 'El tipo de propiedad es requerido'],
    enum: ['Casa', 'Apartamento', 'Local', 'Terreno', 'Oficina', 'Depósito'],
    index: true
  },
  transaccionTipo: {
    type: String,
    required: [true, 'El tipo de transacción es requerido'],
    enum: ['Venta', 'Alquiler'],
    default: 'Venta',
    index: true
  },
  precio: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio debe ser mayor a 0'],
    index: true
  },
  habitaciones: {
    type: Number,
    min: [0, 'El número de habitaciones no puede ser negativo'],
    index: true
  },
  banos: {
    type: Number,
    min: [0, 'El número de baños no puede ser negativo']
  },
  superficieM2: {
    type: Number,
    min: [0, 'La superficie no puede ser negativa']
  },
  estado: {
    type: String,
    enum: ['Disponible', 'Reservado', 'Ocupado', 'Vendido'],
    default: 'Disponible',
    index: true
  },
  
  // Coordenadas para mapas
  latitud: {
    type: Number,
    min: [-90, 'La latitud debe estar entre -90 y 90'],
    max: [90, 'La latitud debe estar entre -90 y 90']
  },
  longitud: {
    type: Number,
    min: [-180, 'La longitud debe estar entre -180 y 180'],
    max: [180, 'La longitud debe estar entre -180 y 180']
  },
  
  // Datos del alquiler/venta
  locador: {
    type: String,
    trim: true
  },
  locatario: {
    type: String,
    trim: true
  },
  propietario: {
    type: String,
    trim: true
  },
  comprador: {
    type: String,
    trim: true
  },
  
  // Referencias a clientes
  idClienteLocador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  idClienteLocatario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  idClientePropietario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  idClienteComprador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  
  // Datos para alquiler temporario
  esAlquilerTemporario: {
    type: Boolean,
    default: false,
    index: true
  },
  precioPorNoche: {
    type: Number,
    min: [0, 'El precio por noche debe ser mayor a 0']
  },
  precioPorSemana: {
    type: Number,
    min: [0, 'El precio por semana debe ser mayor a 0']
  },
  precioPorMes: {
    type: Number,
    min: [0, 'El precio por mes debe ser mayor a 0']
  },
  capacidadPersonas: {
    type: Number,
    min: [1, 'La capacidad debe ser al menos 1 persona']
  },
  servicios: {
    type: [String],
    default: []
  },
  reglasPropiedad: {
    type: [String],
    default: []
  },
  horarioCheckIn: {
    type: String,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)']
  },
  horarioCheckOut: {
    type: String,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)']
  },
  politicaCancelacion: {
    type: String,
    enum: ['Flexible', 'Moderada', 'Estricta'],
    default: 'Moderada'
  },
  depositoSeguridad: {
    type: Number,
    min: [0, 'El depósito de seguridad debe ser mayor a 0']
  },
  metodosPago: {
    type: [String],
    default: ['Efectivo', 'Transferencia']
  },
  
  // Imágenes
  imagenes: [imagenPropiedadSchema],
  
  // Datos de auditoría
  idUsuarioCreador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activo: {
    type: Boolean,
    default: true,
    index: true
  },
  
  // Campos calculados
  favorito: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: {
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion'
  }
});

// Índices compuestos para búsquedas optimizadas
propertySchema.index({ transaccionTipo: 1, tipoPropiedad: 1 });
propertySchema.index({ transaccionTipo: 1, precio: 1 });
propertySchema.index({ transaccionTipo: 1, habitaciones: 1 });
propertySchema.index({ barrio: 1, transaccionTipo: 1 });
propertySchema.index({ estado: 1, activo: 1 });
propertySchema.index({ esAlquilerTemporario: 1, transaccionTipo: 1 });
propertySchema.index({ latitud: 1, longitud: 1 });

// Índice de texto para búsquedas
propertySchema.index({
  titulo: 'text',
  descripcion: 'text',
  direccion: 'text',
  barrio: 'text',
  localidad: 'text'
});

// Virtual para el ID compatible con el frontend
propertySchema.virtual('idPropiedad').get(function() {
  return this._id.toHexString();
});

// Virtual para coordenadas en formato objeto
propertySchema.virtual('coordenadas').get(function() {
  if (this.latitud && this.longitud) {
    return {
      lat: this.latitud,
      lng: this.longitud
    };
  }
  return null;
});

// Método para obtener URL completa de imágenes
propertySchema.methods.getImageUrls = function(baseUrl = '') {
  return this.imagenes.map(img => ({
    ...img.toObject(),
    url: `${baseUrl}/uploads/${img.rutaArchivo}`
  }));
};

// Método estático para búsqueda avanzada
propertySchema.statics.searchProperties = function(filters = {}) {
  const query = { activo: true };
  
  // Filtro por tipo de transacción
  if (filters.transaccionTipo) {
    query.transaccionTipo = new RegExp(filters.transaccionTipo, 'i');
  }
  
  // Filtro por tipo de propiedad
  if (filters.tipoPropiedad) {
    query.tipoPropiedad = new RegExp(filters.tipoPropiedad, 'i');
  }
  
  // Filtro por ubicación (busca en barrio, localidad, ubicación)
  if (filters.barrio || filters.ubicacion) {
    const ubicacionTerm = filters.barrio || filters.ubicacion;
    query.$or = [
      { barrio: new RegExp(ubicacionTerm, 'i') },
      { localidad: new RegExp(ubicacionTerm, 'i') },
      { ubicacion: new RegExp(ubicacionTerm, 'i') },
      { direccion: new RegExp(ubicacionTerm, 'i') }
    ];
  }
  
  // Filtros de precio
  if (filters.precioMin || filters.precioMax) {
    query.precio = {};
    if (filters.precioMin) query.precio.$gte = Number(filters.precioMin);
    if (filters.precioMax) query.precio.$lte = Number(filters.precioMax);
  }
  
  // Filtro por habitaciones mínimas
  if (filters.habitacionesMin) {
    query.habitaciones = { $gte: Number(filters.habitacionesMin) };
  }
  
  // Filtro por baños mínimos
  if (filters.banosMin) {
    query.banos = { $gte: Number(filters.banosMin) };
  }
  
  // Filtro por superficie
  if (filters.superficieMin || filters.superficieMax) {
    query.superficieM2 = {};
    if (filters.superficieMin) query.superficieM2.$gte = Number(filters.superficieMin);
    if (filters.superficieMax) query.superficieM2.$lte = Number(filters.superficieMax);
  }
  
  // Filtro por estado
  if (filters.estado) {
    query.estado = filters.estado;
  }
  
  // Filtro por alquiler temporario
  if (filters.esAlquilerTemporario !== undefined) {
    query.esAlquilerTemporario = filters.esAlquilerTemporario;
  }
  
  return this.find(query)
    .populate('idUsuarioCreador', 'nombre apellido correo')
    .sort({ fechaCreacion: -1 });
};

// Configurar virtuals en JSON
propertySchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    ret.idPropiedad = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Property', propertySchema);
