# Configuración de Vinculación Frontend-Backend

## ✅ Cambios Realizados

### 1. Configuración de API Centralizada
- **Archivo**: `frontend-mkalpinni/src/config/apiConfig.js`
- **Cambio**: Corregida la ruta de `/api` a `/API` para coincidir con el backend
- **URLs configuradas**:
  - Desarrollo: `http://localhost:5228/API`
  - Producción: `https://tu-dominio-produccion.com/API` (actualizar con tu dominio real)

### 2. Actualización de URLs Hardcodeadas
Se reemplazaron todas las URLs hardcodeadas por el uso de `API_BASE_URL`:

#### Archivos actualizados:
- ✅ `componentes/inicio/Inicio/NuevaContra.js`
- ✅ `componentes/Registrar/Registrar.js`
- ✅ `componentes/Login/Login.js`
- ✅ `componentes/Login/ForgotPassword.js`
- ✅ `Context/UserContext.js`
- ✅ `componentes/Perfil/Perfil.js`
- ✅ `componentes/Perfil/EditarPerfil.js`

### 3. Verificación de Rutas Backend
El backend ya tiene correctamente configuradas las rutas:
- `/API/Usuario` - Autenticación y usuarios
- `/API/Propiedad` - Propiedades
- `/API/Cliente` - Clientes
- `/API/Reserva` - Reservas
- `/API/Contacto` - Contactos
- `/API/Tasacion` - Tasaciones

### 4. Configuración CORS
El backend ya tiene CORS configurado para:
- `http://localhost:3000` (desarrollo del frontend)
- URL de producción (configurar según tu deployment)

## 🚀 Instrucciones de Uso

### Para Desarrollo:
1. **Iniciar Backend**:
   ```bash
   cd backend-mkalpinni
   npm run dev
   ```
   Servidor corriendo en: `http://localhost:5228`

2. **Iniciar Frontend**:
   ```bash
   cd frontend-mkalpinni
   npm start
   ```
   Aplicación corriendo en: `http://localhost:3000`

### Para Producción:
1. Actualizar la URL de producción en `apiConfig.js`:
   ```javascript
   const API_BASE_URL =
     process.env.NODE_ENV === 'production'
       ? 'https://tu-dominio-backend.com/API'
       : 'http://localhost:5228/API';
   ```

2. Configurar las variables de entorno en tu servidor backend:
   - `FRONTEND_URL`: URL del frontend en producción
   - `MONGODB_URI`: String de conexión a MongoDB
   - `PORT`: Puerto del servidor (opcional, por defecto 5228)

## 🔄 Endpoints Disponibles

### Autenticación (`/API/Usuario`)
- `POST /IniciarSesion` - Login
- `POST /Registrar` - Registro
- `POST /SolicitudToken` - Recuperar contraseña
- `POST /reestablecer-contrasena` - Restablecer contraseña
- `GET /ListaUsuarios` - Listar usuarios
- `GET /BuscarUsuario` - Buscar usuario por ID
- `PUT /EditarUsuario` - Editar usuario
- `GET /ObtenerFoto/:correo` - Obtener foto de perfil
- `POST /ActualizarFoto` - Actualizar foto de perfil

### Propiedades (`/API/Propiedad`)
- `GET /ObtenerTodos` - Obtener todas las propiedades
- `GET /ObtenerPorId/:id` - Obtener propiedad por ID
- `GET /Buscar` - Buscar propiedades con filtros

### Otros endpoints
- `POST /API/Contacto/EnviarConsulta` - Enviar consulta
- `POST /API/Tasacion/Crear` - Crear tasación
- Y más según las rutas configuradas...

## ⚠️ Importante
- Todos los componentes del frontend ahora usan `API_BASE_URL` de forma consistente
- No hay URLs hardcodeadas restantes
- La configuración es automática según el entorno (desarrollo/producción)
- Asegúrate de actualizar la URL de producción cuando deploys tu aplicación

## 🧪 Testing
Para probar la conectividad:
1. Verifica que el backend responda en: `http://localhost:5228/health`
2. Prueba el login desde el frontend
3. Verifica que las consultas de propiedades funcionen correctamente
