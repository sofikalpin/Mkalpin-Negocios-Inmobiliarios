const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://tu-dominio-produccion.com/API' // URL de tu API en producción
    : 'http://localhost:5228/API';            // URL de tu API en desarrollo

// URL base para archivos estáticos (imágenes, documentos, etc.)
const API_STATIC_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://tu-dominio-produccion.com' // URL base de producción
    : 'http://localhost:5228';            // URL base de desarrollo

export { API_BASE_URL, API_STATIC_URL }