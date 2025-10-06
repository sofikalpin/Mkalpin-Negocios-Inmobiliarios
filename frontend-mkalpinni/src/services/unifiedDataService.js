// Servicio unificado para que páginas públicas y admin usen exactamente los mismos datos
import { propertyService, clientService, contactService, tasacionService } from './api';

// Clase para gestión unificada de datos
class UnifiedDataService {
  constructor() {
    this.cache = {
      properties: null,
      clients: null,
      contacts: null,
      lastUpdate: null
    };
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
  }

  // Método para verificar si el cache es válido
  isCacheValid() {
    return this.cache.lastUpdate && 
           (Date.now() - this.cache.lastUpdate) < this.cacheTimeout;
  }

  // ============ PROPIEDADES ============
  
  // Obtener todas las propiedades (usado por admin y páginas públicas)
  async getAllProperties() {
    if (this.isCacheValid() && this.cache.properties) {
      return { status: true, value: this.cache.properties };
    }

    try {
      const response = await propertyService.getAll();
      if (response.status && response.value) {
        this.cache.properties = response.value;
        this.cache.lastUpdate = Date.now();
      }
      return response;
    } catch (error) {
      console.error('Error obteniendo propiedades:', error);
      throw error;
    }
  }

  // Buscar propiedades con filtros (usado por todas las páginas de búsqueda)
  async searchProperties(filters = {}) {
    try {
      return await propertyService.search(filters);
    } catch (error) {
      console.error('Error buscando propiedades:', error);
      throw error;
    }
  }

  // Obtener propiedad por ID (usado por páginas de detalle)
  async getPropertyById(id) {
    try {
      return await propertyService.getById(id);
    } catch (error) {
      console.error(`Error obteniendo propiedad ${id}:`, error);
      throw error;
    }
  }

  // Métodos específicos para tipos de propiedades
  async getPropertiesForSale() {
    return this.searchProperties({ transaccionTipo: 'Venta' });
  }

  async getPropertiesForRent() {
    return this.searchProperties({ transaccionTipo: 'Alquiler' });
  }

  async getPropertiesForTemporaryRent() {
    return this.searchProperties({ 
      transaccionTipo: 'Alquiler',
      esAlquilerTemporario: true 
    });
  }

  // ============ CLIENTES ============
  
  async getAllClients() {
    try {
      return await clientService.getAll();
    } catch (error) {
      console.error('Error obteniendo clientes:', error);
      throw error;
    }
  }

  async searchClients(filters = {}) {
    try {
      return await clientService.search(filters);
    } catch (error) {
      console.error('Error buscando clientes:', error);
      throw error;
    }
  }

  async createClient(clientData) {
    try {
      const response = await clientService.create(clientData);
      // Invalidar cache para que se actualicen los datos
      this.cache.clients = null;
      return response;
    } catch (error) {
      console.error('Error creando cliente:', error);
      throw error;
    }
  }

  // ============ CONTACTOS ============
  
  async createContact(contactData) {
    try {
      return await contactService.create(contactData);
    } catch (error) {
      console.error('Error creando contacto:', error);
      throw error;
    }
  }

  async getAllContacts() {
    try {
      return await contactService.getAll();
    } catch (error) {
      console.error('Error obteniendo contactos:', error);
      throw error;
    }
  }

  // ============ TASACIONES ============
  
  async createTasacion(tasacionData) {
    try {
      return await tasacionService.create(tasacionData);
    } catch (error) {
      console.error('Error creando tasación:', error);
      throw error;
    }
  }

  // ============ MÉTODOS DE CACHE ============
  
  // Invalidar cache manualmente (útil después de crear/actualizar datos)
  invalidateCache() {
    this.cache = {
      properties: null,
      clients: null,
      contacts: null,
      lastUpdate: null
    };
  }

  // Obtener estadísticas rápidas basadas en datos cacheados
  getQuickStats() {
    if (!this.cache.properties) {
      return null;
    }

    const properties = this.cache.properties;
    return {
      totalProperties: properties.length,
      availableProperties: properties.filter(p => p.estado === 'Disponible').length,
      propertiesForSale: properties.filter(p => p.transaccionTipo === 'Venta').length,
      propertiesForRent: properties.filter(p => p.transaccionTipo === 'Alquiler').length,
      temporaryRentProperties: properties.filter(p => p.esAlquilerTemporario).length
    };
  }
}

// Instancia única del servicio
export const unifiedDataService = new UnifiedDataService();

// Hooks personalizados para usar en componentes públicos
export const usePublicProperties = () => {
  return {
    getAllProperties: () => unifiedDataService.getAllProperties(),
    searchProperties: (filters) => unifiedDataService.searchProperties(filters),
    getPropertyById: (id) => unifiedDataService.getPropertyById(id),
    getPropertiesForSale: () => unifiedDataService.getPropertiesForSale(),
    getPropertiesForRent: () => unifiedDataService.getPropertiesForRent(),
    getPropertiesForTemporaryRent: () => unifiedDataService.getPropertiesForTemporaryRent()
  };
};

export const usePublicContacts = () => {
  return {
    createContact: (contactData) => unifiedDataService.createContact(contactData),
    createTasacion: (tasacionData) => unifiedDataService.createTasacion(tasacionData)
  };
};

// Exportar el servicio principal
export default unifiedDataService;
