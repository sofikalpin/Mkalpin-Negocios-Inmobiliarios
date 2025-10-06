import { API_BASE_URL } from '../config/apiConfig';

// Configuración base de la API
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Método para hacer peticiones con autenticación
  async request(url, options = {}) {
    const token = sessionStorage.getItem('authToken');
    
    // Log para debugging
    console.log('API Request:', {
      url: `${this.baseURL}${url}`,
      method: options.method || 'GET',
      hasToken: !!token,
      token: token ? token.substring(0, 20) + '...' : null
    });
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${url}`, config);
      
      // Log de respuesta para debugging
      console.log('API Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url
      });
      
      // Intentar parsear la respuesta aunque no sea ok
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Error parsing response JSON:', parseError);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Si la respuesta HTTP no es ok, lanzar error con detalles
      if (!response.ok) {
        const errorMessage = data?.message || data?.error || `HTTP ${response.status}: ${response.statusText}`;
        const error = new Error(errorMessage);
        error.response = { status: response.status, data };
        throw error;
      }

      console.log('API Response Data:', data);
      return data;
    } catch (error) {
      console.error('API Error Details:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      throw error;
    }
  }

  // Métodos HTTP
  get(url, options = {}) {
    return this.request(url, { method: 'GET', ...options });
  }

  post(url, data, options = {}) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  put(url, data, options = {}) {
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  delete(url, options = {}) {
    return this.request(url, { method: 'DELETE', ...options });
  }
}

// Instancia única de la API
export const api = new ApiService();

// Función helper para mapear datos de propiedades del backend al formato frontend
const mapPropertyData = (prop) => ({
  // IDs unificados
  _id: prop._id,
  id: prop._id,
  idPropiedad: prop._id,
  
  // Información básica
  titulo: prop.titulo,
  title: prop.titulo, // Para compatibilidad admin
  descripcion: prop.descripcion,
  description: prop.descripcion, // Para compatibilidad admin
  
  // Ubicación
  direccion: prop.direccion,
  address: prop.direccion, // Para compatibilidad admin
  barrio: prop.barrio,
  neighborhood: prop.barrio, // Para compatibilidad admin
  localidad: prop.localidad,
  locality: prop.localidad, // Para compatibilidad admin
  provincia: prop.provincia,
  province: prop.provincia, // Para compatibilidad admin
  ubicacion: prop.ubicacion,
  
  // Coordenadas
  latitud: prop.latitud,
  longitud: prop.longitud,
  coordenadas: {
    lat: prop.latitud || -34.603,
    lng: prop.longitud || -58.381
  },
  
  // Tipo y transacción
  tipoPropiedad: prop.tipoPropiedad,
  tipo: prop.tipoPropiedad, // Para compatibilidad
  type: prop.tipoPropiedad, // Para compatibilidad admin
  transaccionTipo: prop.transaccionTipo,
  operationType: prop.transaccionTipo?.toLowerCase(), // Para compatibilidad admin
  
  // Precios
  precio: prop.precio,
  price: prop.precio, // Para compatibilidad admin
  currency: 'USD', // Asumir USD por defecto
  
  // Características
  habitaciones: prop.habitaciones,
  bedrooms: prop.habitaciones, // Para compatibilidad admin
  banos: prop.banos,
  bathrooms: prop.banos, // Para compatibilidad admin
  superficieM2: prop.superficieM2,
  superficie: prop.superficieM2, // Para compatibilidad
  squareMeters: prop.superficieM2, // Para compatibilidad admin
  
  // Estado
  estado: prop.estado,
  status: prop.estado?.toLowerCase(), // Para compatibilidad admin
  disponible: prop.estado === 'Disponible',
  
  // Imágenes
  imagenes: prop.imagenes || [],
  images: prop.imagenes || [], // Para compatibilidad admin
  
  // Fechas
  fechaCreacion: prop.fechaCreacion,
  
  // Campos específicos para alquiler temporario
  esAlquilerTemporario: prop.esAlquilerTemporario,
  precioPorNoche: prop.precioPorNoche,
  precioPorSemana: prop.precioPorSemana,
  precioPorMes: prop.precioPorMes,
  capacidadPersonas: prop.capacidadPersonas,
  capacidadHuespedes: prop.capacidadPersonas,
  servicios: prop.servicios || [],
  services: prop.servicios || [], // Para compatibilidad admin
  reglasPropiedad: prop.reglasPropiedad || [],
  horarioCheckIn: prop.horarioCheckIn,
  
  // Estado de favorito
  favorito: prop.favorito || false,
  
  // Otros campos que puedan existir
  features: prop.servicios || [],
  allowsPets: prop.permitemascotas || false,
  parkingSpots: prop.estacionamientos || 0
});

// Servicios reales conectados directamente al backend
export const propertyService = {
  // Obtener todas las propiedades (usando Buscar sin filtros para consistencia)
  getAll: async () => {
    const response = await api.get('/Propiedad/Buscar');
    if (response.status && response.value) {
      response.value = response.value.map(mapPropertyData);
    }
    return response;
  },
  
  // Obtener propiedad por ID
  getById: async (id) => {
    const response = await api.get(`/Propiedad/Obtener/${id}`);
    if (response.status && response.value) {
      response.value = mapPropertyData(response.value);
    }
    return response;
  },
  
  // Buscar propiedades con filtros (usado por páginas públicas y admin)
  search: async (filters) => {
    const queryParams = new URLSearchParams();
    
    // Mapear filtros del frontend a los parámetros esperados por el backend
    if (filters.transaccionTipo) queryParams.append('transaccionTipo', filters.transaccionTipo);
    if (filters.tipoPropiedad) queryParams.append('tipoPropiedad', filters.tipoPropiedad);
    if (filters.barrio) queryParams.append('barrio', filters.barrio);
    if (filters.ubicacion) queryParams.append('ubicacion', filters.ubicacion);
    if (filters.precioMin) queryParams.append('precioMin', filters.precioMin);
    if (filters.precioMax) queryParams.append('precioMax', filters.precioMax);
    if (filters.habitacionesMin) queryParams.append('habitacionesMin', filters.habitacionesMin);
    if (filters.banosMin) queryParams.append('banosMin', filters.banosMin);
    if (filters.superficieMin) queryParams.append('superficieMin', filters.superficieMin);
    if (filters.superficieMax) queryParams.append('superficieMax', filters.superficieMax);
    if (filters.estado) queryParams.append('estado', filters.estado);
    if (filters.esAlquilerTemporario !== undefined) queryParams.append('esAlquilerTemporario', filters.esAlquilerTemporario);
    
    const response = await api.get(`/Propiedad/Buscar?${queryParams.toString()}`);
    if (response.status && response.value) {
      response.value = response.value.map(mapPropertyData);
    }
    return response;
  },
  
  // Crear nueva propiedad
  create: (property) => api.post('/Propiedad/Crear', property),
  
  // Actualizar propiedad
  update: (id, property) => api.put(`/Propiedad/Actualizar/${id}`, property),
  
  // Eliminar propiedad (marcado como inactivo)
  delete: (id) => api.delete(`/Propiedad/Eliminar/${id}`),
  
  // Métodos de conveniencia para tipos específicos
  getByType: async (type) => {
    return await propertyService.search({ transaccionTipo: type });
  },
  
  // Obtener propiedades para venta
  getForSale: async () => {
    return await propertyService.search({ transaccionTipo: 'Venta' });
  },
  
  // Obtener propiedades para alquiler
  getForRent: async () => {
    return await propertyService.search({ transaccionTipo: 'Alquiler' });
  },
  
  // Obtener propiedades para alquiler temporario
  getForTemporaryRent: async () => {
    return await propertyService.search({ 
      transaccionTipo: 'Alquiler',
      esAlquilerTemporario: true 
    });
  }
};

export const clientService = {
  // Obtener todos los clientes
  getAll: () => api.get('/Cliente/Obtener'),
  
  // Obtener cliente por ID
  getById: (id) => api.get(`/Cliente/Obtener/${id}`),
  
  // Buscar clientes con filtros
  search: (filters) => {
    const queryParams = new URLSearchParams();
    
    if (filters.nombre) queryParams.append('nombre', filters.nombre);
    if (filters.dni) queryParams.append('dni', filters.dni);
    if (filters.email) queryParams.append('email', filters.email);
    if (filters.rol) queryParams.append('rol', filters.rol);
    if (filters.tipoAlquiler) queryParams.append('tipoAlquiler', filters.tipoAlquiler);
    if (filters.tienePropiedad !== undefined) queryParams.append('tienePropiedad', filters.tienePropiedad);
    
    return api.get(`/Cliente/Buscar?${queryParams.toString()}`);
  },
  
  // Crear nuevo cliente
  create: (client) => api.post('/Cliente/Crear', client),
  
  // Actualizar cliente
  update: (id, client) => api.put(`/Cliente/Actualizar/${id}`, client),
  
  // Eliminar cliente (marcado como inactivo)
  delete: (id) => api.delete(`/Cliente/Eliminar/${id}`),
  
  // Métodos de conveniencia por tipo de cliente
  getByRole: (role) => {
    return clientService.search({ rol: role });
  },
  
  getOwners: () => clientService.getByRole('Propietario'),
  getTenants: () => clientService.getByRole('Locatario'),
  getLandlords: () => clientService.getByRole('Locador'),
  getBuyers: () => clientService.getByRole('Comprador')
};

// Servicios para reservaciones (si tienes endpoints específicos)
export const reservationService = {
  getAll: () => api.get('/Reserva/Obtener'),
  getById: (id) => api.get(`/Reserva/Obtener/${id}`),
  create: (reservation) => api.post('/Reserva/Crear', reservation),
  update: (id, reservation) => api.put(`/Reserva/Actualizar/${id}`, reservation),
  delete: (id) => api.delete(`/Reserva/Eliminar/${id}`),
  getByProperty: (propertyId) => api.get(`/Reserva/Obtener/Propiedad/${propertyId}`),
};

// Servicios para contactos
export const contactService = {
  getAll: () => api.get('/Contacto/Obtener'),
  getById: (id) => api.get(`/Contacto/Obtener/${id}`),
  create: (contact) => api.post('/Contacto/Crear', contact),
  update: (id, contact) => api.put(`/Contacto/Actualizar/${id}`, contact),
  delete: (id) => api.delete(`/Contacto/Eliminar/${id}`),
};

// Servicios para tasaciones
export const tasacionService = {
  getAll: () => api.get('/Tasacion/Obtener'),
  getById: (id) => api.get(`/Tasacion/Obtener/${id}`),
  create: (tasacion) => api.post('/Tasacion/Crear', tasacion),
  delete: (id) => api.delete(`/Tasacion/Eliminar/${id}`),
};

// Servicio para estadísticas calculadas dinámicamente
export const statsService = {
  // Calcular estadísticas del dashboard basadas en datos reales
  getDashboardStats: async () => {
    try {
      // Obtener datos reales de propiedades y clientes
      const [propertiesResponse, clientsResponse] = await Promise.all([
        propertyService.getAll(),
        clientService.getAll()
      ]);

      const properties = propertiesResponse.value || [];
      const clients = clientsResponse.value || [];

      // Calcular estadísticas en tiempo real
      return {
        status: true,
        value: {
          // Propiedades
          totalPropiedades: properties.length,
          propiedadesDisponibles: properties.filter(p => p.estado === 'Disponible' || p.disponible).length,
          propiedadesOcupadas: properties.filter(p => p.estado === 'Ocupado' || !p.disponible).length,
          propiedadesPorVenta: properties.filter(p => p.transaccionTipo === 'Venta').length,
          propiedadesPorAlquiler: properties.filter(p => p.transaccionTipo === 'Alquiler').length,
          propiedadesTemporario: properties.filter(p => p.esAlquilerTemporario).length,
          
          // Clientes
          totalClientes: clients.length,
          propietarios: clients.filter(c => c.rol === 'Propietario').length,
          inquilinos: clients.filter(c => c.rol === 'Locatario').length,
          locadores: clients.filter(c => c.rol === 'Locador').length,
          compradores: clients.filter(c => c.rol === 'Comprador').length,
          
          // Métricas calculadas
          tasaOcupacion: properties.length > 0 ? 
            Math.round((properties.filter(p => p.estado === 'Ocupado' || !p.disponible).length / properties.length) * 100) : 0,
          
          // Ingresos mensuales (esto requeriría un endpoint específico para pagos)
          ingresosMensuales: 0, // Se calculará cuando tengas endpoints de pagos
          
          contratosActivos: 0, // Se calculará cuando tengas endpoints de contratos
          pagosPendientes: 0 // Se calculará cuando tengas endpoints de pagos
        }
      };
    } catch (error) {
      console.error('Error calculando estadísticas:', error);
      throw error;
    }
  }
};
