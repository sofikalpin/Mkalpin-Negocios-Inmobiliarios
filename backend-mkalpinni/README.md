# Backend Mkalpin Negocios Inmobiliarios 🏠

Backend API para el sistema inmobiliario Mkalpin desarrollado con **Node.js**, **Express** y **MongoDB**.

## 📋 Índice

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Modelos de Datos](#modelos-de-datos)
- [Autenticación](#autenticación)
- [Subida de Archivos](#subida-de-archivos)
- [Testing](#testing)
- [Despliegue](#despliegue)
- [Contribución](#contribución)

## ✨ Características

- 🔐 **Autenticación JWT** con roles de usuario (Administrador, Propietario, Inquilino)
- 🏠 **CRUD completo de propiedades** con búsqueda avanzada y filtros
- 👥 **Gestión de clientes** con diferentes roles (Locador, Locatario, Propietario, Comprador)
- 📅 **Sistema de reservas** para alquiler temporario con calendario
- ⭐ **Sistema de favoritos** por usuario
- 📧 **Gestión de contactos** y consultas
- 📊 **Sistema de tasaciones** inmobiliarias
- 📁 **Subida de archivos** e imágenes con optimización
- 🛡️ **Middleware de seguridad** (Rate limiting, CORS, Helmet)
- 📈 **Estadísticas** y reportes
- 🔍 **Búsqueda full-text** en múltiples campos
- 🗄️ **Base de datos MongoDB** con Mongoose ODM

## 🛠️ Tecnologías

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Base de Datos**: MongoDB con Mongoose
- **Autenticación**: JWT (jsonwebtoken)
- **Hashing**: bcryptjs
- **Subida de Archivos**: Multer + Sharp (optimización de imágenes)
- **Validación**: express-validator
- **Seguridad**: Helmet, CORS, Rate Limiting
- **Documentación**: JSDoc

## 🚀 Instalación

### Prerequisitos

- Node.js 18+ 
- MongoDB 5.0+
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   cd backend-mkalpinni
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Crear archivo .env con tus configuraciones
   ```

4. **Iniciar MongoDB**
   ```bash
   # Si usas MongoDB local
   mongod
   
   # O usar MongoDB Atlas (cloud)
   ```

5. **Sembrar la base de datos (opcional)**
   ```bash
   npm run seed
   ```

6. **Iniciar el servidor**
   ```bash
   # Desarrollo
   npm run dev
   
   # Producción
   npm start
   ```

## ⚙️ Configuración

Crea un archivo `.env` con la siguiente configuración:

```env
# Configuración del servidor
NODE_ENV=development
PORT=5228

# Base de datos MongoDB
MONGODB_URI=mongodb://localhost:27017/mkalpin_inmobiliaria

# JWT Configuration
JWT_SECRET=tu_clave_secreta_jwt_muy_larga_y_segura_aqui
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/gif,image/webp
```

## 🎯 Uso

### Desarrollo
```bash
npm run dev     # Servidor con nodemon (auto-reload)
```

### Producción
```bash
npm start       # Servidor en modo producción
```

### Scripts disponibles
```bash
npm run dev     # Desarrollo con nodemon
npm start       # Producción
npm run seed    # Sembrar base de datos con datos de ejemplo
npm test        # Ejecutar tests (por implementar)
```

### Datos de prueba

Después de ejecutar `npm run seed`:

- **Admin**: `admin@mkalpin.com` / `Admin123!`
- **Propietario**: `maria.garcia@email.com` / `password123`
- **Inquilino**: `juan.perez@email.com` / `password123`

## 📡 API Endpoints

### Base URL
```
http://localhost:5228/API
```

### Autenticación (`/Usuario`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/Usuario/Registrar` | Registrar usuario | - |
| POST | `/Usuario/IniciarSesion` | Iniciar sesión | - |
| GET | `/Usuario/Perfil` | Obtener perfil | ✅ |
| PUT | `/Usuario/Actualizar` | Actualizar perfil | ✅ |
| PUT | `/Usuario/CambiarContrasena` | Cambiar contraseña | ✅ |
| POST | `/Usuario/RecuperarContrasena` | Recuperar contraseña | - |
| GET | `/Usuario/Todos` | Listar usuarios | 👑 Admin |

### Propiedades (`/Propiedad`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/Propiedad/Obtener` | Listar propiedades | - |
| GET | `/Propiedad/Obtener/:id` | Ver propiedad | - |
| GET | `/Propiedad/Buscar` | Buscar con filtros | - |
| POST | `/Propiedad/Crear` | Crear propiedad | ✅ |
| PUT | `/Propiedad/Actualizar/:id` | Actualizar propiedad | ✅ |
| DELETE | `/Propiedad/Eliminar/:id` | Eliminar propiedad | ✅ |
| POST | `/Propiedad/ToggleFavorito/:id` | Toggle favorito | ✅ |
| GET | `/Propiedad/Favoritos` | Ver favoritos | ✅ |
| GET | `/Propiedad/MisPropiedades` | Mis propiedades | ✅ |
| POST | `/Propiedad/SubirImagenes/:id` | Subir imágenes | ✅ |

### Clientes (`/Cliente`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/Cliente/Obtener` | Listar clientes | ✅ |
| GET | `/Cliente/Obtener/:id` | Ver cliente | ✅ |
| GET | `/Cliente/PorRol/:role` | Por rol | ✅ |
| GET | `/Cliente/Buscar` | Buscar clientes | ✅ |
| POST | `/Cliente/Crear` | Crear cliente | ✅ |
| PUT | `/Cliente/Actualizar/:id` | Actualizar cliente | ✅ |
| DELETE | `/Cliente/Eliminar/:id` | Eliminar cliente | ✅ |
| GET | `/Cliente/Estadisticas` | Estadísticas | ✅ |

### Reservas (`/Reserva`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/Reserva/Obtener` | Listar reservas | ✅ |
| GET | `/Reserva/Obtener/:id` | Ver reserva | ✅ |
| GET | `/Reserva/PorPropiedad/:id` | Por propiedad | ✅ |
| GET | `/Reserva/PorCliente/:id` | Por cliente | ✅ |
| GET | `/Reserva/MisReservas` | Mis reservas | ✅ |
| POST | `/Reserva/Crear` | Crear reserva | ✅ |
| PUT | `/Reserva/Actualizar/:id` | Actualizar reserva | ✅ |
| PUT | `/Reserva/Cancelar/:id` | Cancelar reserva | ✅ |
| PUT | `/Reserva/Confirmar/:id` | Confirmar reserva | ✅ |
| PUT | `/Reserva/Completar/:id` | Completar reserva | ✅ |
| GET | `/Reserva/FechasDisponibles/:id` | Fechas disponibles | ✅ |

### Contacto (`/Contacto`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/Contacto/Enviar` | Enviar mensaje | - |
| GET | `/Contacto/Obtener` | Listar contactos | ✅ |
| GET | `/Contacto/Obtener/:id` | Ver contacto | ✅ |
| PUT | `/Contacto/Responder/:id` | Responder | ✅ |
| PUT | `/Contacto/CambiarEstado/:id` | Cambiar estado | ✅ |
| GET | `/Contacto/Buscar` | Buscar contactos | ✅ |
| GET | `/Contacto/Estadisticas` | Estadísticas | ✅ |

### Tasaciones (`/Tasacion`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/Tasacion/Solicitar` | Solicitar tasación | - |
| GET | `/Tasacion/Obtener` | Listar tasaciones | ✅ |
| GET | `/Tasacion/Obtener/:id` | Ver tasación | ✅ |
| PUT | `/Tasacion/Actualizar/:id` | Actualizar | ✅ |
| PUT | `/Tasacion/ProgramarVisita/:id` | Programar visita | ✅ |
| POST | `/Tasacion/SubirImagenes/:id` | Subir imágenes | ✅ |
| GET | `/Tasacion/MisTasaciones` | Mis asignadas | ✅ |
| GET | `/Tasacion/Buscar` | Buscar tasaciones | ✅ |
| GET | `/Tasacion/Estadisticas` | Estadísticas | ✅ |

### Leyenda
- ✅ = Autenticación requerida
- 👑 = Solo administradores
- - = Público

## 📁 Estructura del Proyecto

```
backend-mkalpinni/
├── src/
│   ├── models/           # Modelos de MongoDB/Mongoose
│   │   ├── User.js
│   │   ├── Property.js
│   │   ├── Client.js
│   │   ├── Reservation.js
│   │   ├── Contact.js
│   │   ├── Tasacion.js
│   │   └── Favorite.js
│   ├── routes/           # Rutas de la API
│   │   ├── auth.js
│   │   ├── properties.js
│   │   ├── clients.js
│   │   ├── reservations.js
│   │   ├── contact.js
│   │   └── tasaciones.js
│   └── middleware/       # Middleware personalizado
│       ├── auth.js
│       ├── validation.js
│       ├── upload.js
│       ├── errorHandler.js
│       └── notFound.js
├── scripts/              # Scripts utilitarios
│   └── seedDatabase.js
├── uploads/              # Archivos subidos
├── server.js             # Archivo principal
├── package.json
├── .gitignore
└── README.md
```

## 🗄️ Modelos de Datos

### Usuario (User)
```javascript
{
  nombre: String,
  apellido: String,
  correo: String (unique),
  contrasenaHash: String,
  idrol: Number, // 1: Propietario, 2: Inquilino, 3: Administrador
  rol: String,
  telefono: String,
  activo: Boolean,
  fechaCreacion: Date
}
```

### Propiedad (Property)
```javascript
{
  titulo: String,
  descripcion: String,
  direccion: String,
  barrio: String,
  tipoPropiedad: String, // Casa, Apartamento, Local, etc.
  transaccionTipo: String, // Venta, Alquiler
  precio: Number,
  habitaciones: Number,
  banos: Number,
  superficieM2: Number,
  latitud: Number,
  longitud: Number,
  esAlquilerTemporario: Boolean,
  imagenes: [ImagenSchema],
  idUsuarioCreador: ObjectId,
  fechaCreacion: Date
}
```

### Cliente (Client)
```javascript
{
  nombreCompleto: String,
  dni: String (unique),
  email: String (unique),
  telefono: String,
  domicilio: String,
  rol: String, // Locador, Locatario, Propietario, Comprador
  tipoAlquiler: String, // Alquiler Temporario, Alquiler
  fechaNacimiento: Date,
  profesion: String,
  ingresosMensuales: Number,
  idUsuarioCreador: ObjectId,
  fechaCreacion: Date
}
```

### Reserva (Reservation)
```javascript
{
  idPropiedad: ObjectId,
  idCliente: ObjectId,
  fechaInicio: Date,
  fechaFin: Date,
  estado: String, // Pendiente, Confirmada, Cancelada, Completada
  montoTotal: Number,
  cantidadPersonas: Number,
  pagos: [PagoSchema],
  idUsuarioCreador: ObjectId,
  fechaCreacion: Date
}
```

## 🔐 Autenticación

El sistema usa **JWT (JSON Web Tokens)** para autenticación:

### Headers requeridos
```http
Authorization: Bearer <token>
Content-Type: application/json
```

### Roles de usuario
- **Administrador** (idrol: 3): Acceso total
- **Propietario** (idrol: 1): Gestión de propiedades y clientes
- **Inquilino** (idrol: 2): Solo visualización

### Middleware de protección
```javascript
// Proteger ruta
router.get('/protected', protect, handler);

// Autorizar roles específicos
router.get('/admin-only', [protect, authorize('Administrador')], handler);
```

## 📁 Subida de Archivos

### Configuración
- **Límite de tamaño**: 10MB por archivo
- **Tipos permitidos**: JPG, PNG, GIF, WebP, PDF, DOC, XLS
- **Almacenamiento**: Local (uploads/)
- **Optimización**: Automática para imágenes

### Estructura de directorios
```
uploads/
├── propiedades/
│   └── {propertyId}/
├── clientes/
│   └── {clientId}/
├── tasaciones/
│   └── {tasacionId}/
└── general/
```

### Uso
```javascript
// Subir imágenes de propiedad
POST /API/Propiedad/SubirImagenes/:id
Content-Type: multipart/form-data

// Archivo en campo "imagenes"
```

## 🧪 Testing

```bash
npm test           # Ejecutar tests
npm run test:watch # Tests en modo watch
```

## 🚀 Despliegue

### Variables de entorno de producción
```env
NODE_ENV=production
PORT=5228
MONGODB_URI=mongodb+srv://...
JWT_SECRET=clave_muy_segura_para_produccion
FRONTEND_URL=https://tu-frontend.com
```

### Docker (opcional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5228
CMD ["npm", "start"]
```

### Servicios recomendados
- **Base de datos**: MongoDB Atlas
- **Hosting**: Railway, Heroku, DigitalOcean
- **CDN**: Cloudflare (para archivos estáticos)

## 🔧 Configuración adicional

### Rate Limiting
```javascript
// 100 requests por 15 minutos por IP
windowMs: 15 * 60 * 1000,
max: 100
```

### CORS
```javascript
origin: [
  'http://localhost:3000',
  'https://tu-frontend.com'
]
```

### Logs
- **Desarrollo**: Logs detallados en consola
- **Producción**: Logs mínimos, sin stack traces

## 📝 Notas importantes

1. **Seguridad**: Todas las contraseñas se hashean con bcryptjs (12 rounds)
2. **Validación**: express-validator en todas las rutas con entrada de datos
3. **Errores**: Manejo centralizado de errores con middleware
4. **CORS**: Configurado para frontend en localhost:3000
5. **Rate Limiting**: 100 requests por 15 minutos por IP
6. **Soft Delete**: Los registros se marcan como inactivos, no se eliminan

## 🤝 Contribución

1. Fork el proyecto
2. Crear branch de feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto es privado y pertenece a **Mkalpin Negocios Inmobiliarios**.

---

**Desarrollado con ❤️ para Mkalpin Negocios Inmobiliarios**