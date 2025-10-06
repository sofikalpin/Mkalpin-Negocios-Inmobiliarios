const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./src/routes/auth');
const propertyRoutes = require('./src/routes/properties');
const clientRoutes = require('./src/routes/clients');
const reservationRoutes = require('./src/routes/reservations');
const contactRoutes = require('./src/routes/contact');
const tasacionRoutes = require('./src/routes/tasaciones');

// Importar middleware personalizado
const { errorHandler } = require('./src/middleware/errorHandler');
const { notFound } = require('./src/middleware/notFound');

const app = express();
const PORT = process.env.PORT || 5228;

// Configuración de rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Más permisivo en desarrollo
  message: {
    status: false,
    message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.'
  },
  skip: process.env.NODE_ENV === 'development' ? () => true : undefined // Deshabilitado en desarrollo
});

// Middleware de seguridad
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());
app.use(morgan('combined'));
app.use(limiter);

// Configuración de CORS
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://edumatch-three.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Middleware para parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mkalpin_inmobiliaria')
.then(() => {
  console.log('✅ Conectado a MongoDB');
})
.catch((error) => {
  console.error('❌ Error conectando a MongoDB:', error);
  process.exit(1);
});

// Rutas API
app.use('/API/Usuario', authRoutes);
app.use('/API/Propiedad', propertyRoutes);
app.use('/API/Cliente', clientRoutes);
app.use('/API/Reserva', reservationRoutes);
app.use('/API/Contacto', contactRoutes);
app.use('/API/Tasacion', tasacionRoutes);

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    status: true,
    message: 'Bienvenido a la API de Mkalpin Negocios Inmobiliarios',
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

// Middleware de manejo de errores
app.use(notFound);
app.use(errorHandler);

// Manejo de errores de proceso
process.on('unhandledRejection', (err) => {
  console.error('❌ Error no manejado:', err);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.error('❌ Excepción no capturada:', err);
  process.exit(1);
});

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS configurado para: ${corsOptions.origin.join(', ')}`);
});

module.exports = app;
