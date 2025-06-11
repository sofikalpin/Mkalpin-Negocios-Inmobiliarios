const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://edumatch-three.vercel.app/api' // URL de tu API en producción
    : 'http://localhost:5228/api';           // URL de tu API en desarrollo

export { API_BASE_URL }