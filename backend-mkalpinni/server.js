const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./src/routes/auth');
const propertyRoutes = require('./src/routes/properties');
const clientRoutes = require('./src/routes/clients');
const reservationRoutes = require('./src/routes/reservations');
const contactRoutes = require('./src/routes/contact');
const tasacionRoutes = require('./src/routes/tasaciones');

const { errorHandler } = require('./src/middleware/errorHandler');
const { notFound } = require('./src/middleware/notFound');

const app = express();
const PORT = process.env.PORT || 5228;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  message: {
    status: false,
    message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.'
  },
  skip: process.env.NODE_ENV === 'development' ? () => true : undefined
});

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());
app.use(morgan('combined'));
app.use(limiter);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://edumatch-three.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mkalpin_inmobiliaria')
.then(() => {
})
.catch((error) => {
  console.error('❌ Error conectando a MongoDB:', error);
  process.exit(1);
});

app.use('/API/Usuario', authRoutes);
app.use('/API/Propiedad', propertyRoutes);
app.use('/API/Cliente', clientRoutes);
app.use('/API/Reserva', reservationRoutes);
app.use('/API/Contacto', contactRoutes);
app.use('/API/Tasacion', tasacionRoutes);

app.get('/health', (req, res) => {
  res.json({ 
    status: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/', (req, res) => {
  res.json({
    status: true,
    message: 'Bienvenido a la API de Mkalpin Negocios Inmobiliarios',
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

app.use(notFound);
app.use(errorHandler);

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

const server = app.listen(PORT, () => {
});

module.exports = app;
