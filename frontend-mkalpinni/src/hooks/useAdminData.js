import { useEffect } from 'react';
import { useAdmin } from '../Context/AdminContext';

// Hook personalizado para manejar datos del admin con loading y error states
export const useAdminData = (dataType = 'all', autoFetch = true) => {
  const {
    // Estados
    properties,
    clients,
    reservations,
    payments,
    contacts,
    stats,
    loading,
    errors,
    
    // Métodos
    fetchProperties,
    fetchClients,
    fetchPayments,
    fetchReservations,
    fetchStats,
    loadAllData,
  } = useAdmin();

  // Auto-fetch data on mount
  useEffect(() => {
    if (autoFetch) {
      switch (dataType) {
        case 'properties':
          fetchProperties();
          break;
        case 'clients':
          fetchClients();
          break;
        case 'payments':
          fetchPayments();
          break;
        case 'reservations':
          fetchReservations();
          break;
        case 'stats':
          fetchStats();
          break;
        case 'all':
        default:
          loadAllData();
          break;
      }
    }
  }, [dataType, autoFetch, fetchProperties, fetchClients, fetchPayments, fetchReservations, fetchStats, loadAllData]);

  // Funciones helper para filtrar datos
  const getPropertiesByType = (type) => {
    return properties.filter(p => p.operationType === type || p.tipo === type);
  };

  const getClientsByRole = (role) => {
    return clients.filter(c => c.rol === role || c.tipo === role);
  };

  const getPaymentsByStatus = (status) => {
    return payments.filter(p => p.estado === status || p.status === status);
  };

  const getReservationsByProperty = (propertyId) => {
    return reservations.filter(r => r.propertyId === propertyId || r.propiedadId === propertyId);
  };

  // Estados calculados
  const isLoading = loading[dataType] || false;
  const error = errors[dataType] || null;
  const hasData = () => {
    switch (dataType) {
      case 'properties':
        return properties.length > 0;
      case 'clients':
        return clients.length > 0;
      case 'payments':
        return payments.length > 0;
      case 'reservations':
        return reservations.length > 0;
      case 'all':
      default:
        return properties.length > 0 || clients.length > 0;
    }
  };

  return {
    // Datos
    properties,
    clients,
    reservations,
    payments,
    contacts,
    stats,
    
    // Estados
    isLoading,
    error,
    hasData: hasData(),
    
    // Helpers
    getPropertiesByType,
    getClientsByRole,
    getPaymentsByStatus,
    getReservationsByProperty,
    
    // Refresh functions
    refresh: {
      properties: fetchProperties,
      clients: fetchClients,
      payments: fetchPayments,
      reservations: fetchReservations,
      stats: fetchStats,
      all: loadAllData,
    }
  };
};

// Hook específico para propiedades
export const useProperties = () => {
  const { 
    properties, 
    loading, 
    errors,
    createProperty,
    updateProperty,
    deleteProperty,
    fetchProperties 
  } = useAdmin();

  return {
    properties,
    isLoading: loading.properties,
    error: errors.properties,
    createProperty,
    updateProperty,
    deleteProperty,
    refreshProperties: fetchProperties,
    
    // Helpers específicos
    availableProperties: properties.filter(p => p.disponible || p.status === 'disponible'),
    occupiedProperties: properties.filter(p => !p.disponible || p.status === 'ocupado'),
    propertiesForSale: properties.filter(p => p.operationType === 'venta'),
    propertiesForRent: properties.filter(p => p.operationType === 'alquiler'),
  };
};

// Hook específico para clientes
export const useClients = () => {
  const { 
    clients, 
    loading, 
    errors,
    createClient,
    updateClient,
    deleteClient,
    fetchClients 
  } = useAdmin();

  return {
    clients,
    isLoading: loading.clients,
    error: errors.clients,
    createClient,
    updateClient,
    deleteClient,
    refreshClients: fetchClients,
    
    // Helpers específicos
    owners: clients.filter(c => c.rol === 'Propietario' || c.tipo === 'propietario'),
    tenants: clients.filter(c => c.rol === 'Locatario' || c.tipo === 'inquilino'),
    landlords: clients.filter(c => c.rol === 'Locador' || c.tipo === 'locador'),
    buyers: clients.filter(c => c.rol === 'Comprador' || c.tipo === 'comprador'),
  };
};

// Hook específico para pagos (cuando esté disponible el endpoint)
export const usePayments = () => {
  // Por ahora, devolver datos vacíos ya que no hay endpoint de pagos aún
  return {
    payments: [],
    isLoading: false,
    error: null,
    refreshPayments: () => Promise.resolve(),
    
    // Helpers específicos
    paidPayments: [],
    pendingPayments: [],
    overduePayments: [],
    
    // Totales
    totalPaid: 0,
    totalPending: 0,
    totalOverdue: 0,
  };
};

// Hook para estadísticas
export const useStats = () => {
  const { stats, loading, errors, fetchStats } = useAdmin();

  return {
    stats,
    isLoading: loading.stats,
    error: errors.stats,
    refreshStats: fetchStats,
  };
};
