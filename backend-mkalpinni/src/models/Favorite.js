const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  idUsuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario es requerido'],
    index: true
  },
  idPropiedad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'La propiedad es requerida'],
    index: true
  }
}, {
  timestamps: {
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion'
  }
});

// Índice único para evitar duplicados
favoriteSchema.index({ idUsuario: 1, idPropiedad: 1 }, { unique: true });

// Virtual para el ID compatible con el frontend
favoriteSchema.virtual('idFavorito').get(function() {
  return this._id.toHexString();
});

// Método estático para toggle favorito
favoriteSchema.statics.toggleFavorite = async function(userId, propertyId) {
  try {
    // Intentar encontrar el favorito existente
    const existingFavorite = await this.findOne({
      idUsuario: userId,
      idPropiedad: propertyId
    });
    
    if (existingFavorite) {
      // Si existe, lo eliminamos
      await this.deleteOne({ _id: existingFavorite._id });
      return { 
        action: 'removed', 
        isFavorite: false,
        message: 'Propiedad removida de favoritos'
      };
    } else {
      // Si no existe, lo creamos
      const newFavorite = new this({
        idUsuario: userId,
        idPropiedad: propertyId
      });
      await newFavorite.save();
      return { 
        action: 'added', 
        isFavorite: true,
        message: 'Propiedad agregada a favoritos'
      };
    }
  } catch (error) {
    throw new Error('Error al actualizar favorito: ' + error.message);
  }
};

// Método estático para obtener favoritos de un usuario
favoriteSchema.statics.getUserFavorites = function(userId) {
  return this.find({ idUsuario: userId })
    .populate({
      path: 'idPropiedad',
      match: { activo: true },
      populate: {
        path: 'idUsuarioCreador',
        select: 'nombre apellido correo'
      }
    })
    .sort({ fechaCreacion: -1 });
};

// Método estático para verificar si una propiedad es favorita
favoriteSchema.statics.isFavorite = async function(userId, propertyId) {
  const favorite = await this.findOne({
    idUsuario: userId,
    idPropiedad: propertyId
  });
  return !!favorite;
};

// Método estático para obtener propiedades con estado de favorito
favoriteSchema.statics.addFavoriteStatus = async function(properties, userId) {
  if (!userId || !properties || !Array.isArray(properties)) {
    return properties;
  }
  
  const propertyIds = properties.map(p => p._id || p.idPropiedad);
  const favorites = await this.find({
    idUsuario: userId,
    idPropiedad: { $in: propertyIds }
  }).select('idPropiedad');
  
  const favoriteIds = favorites.map(f => f.idPropiedad.toString());
  
  return properties.map(property => {
    const propertyObj = property.toObject ? property.toObject() : property;
    const propertyId = propertyObj._id || propertyObj.idPropiedad;
    
    return {
      ...propertyObj,
      favorito: favoriteIds.includes(propertyId.toString())
    };
  });
};

// Configurar virtuals en JSON
favoriteSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    ret.idFavorito = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Favorite', favoriteSchema);
