import { useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import OperationSelection from './OperationSelection';
import FilterControls from './FilterControls';
import PropertyList from './PropertyList';
import Header from '../../inicio/Componentes/Header';

const PropertyManagement = () => {
  const [properties, setProperties] = useState([
    {
      id: 1,
      title: 'Casa de playa',
      address: 'Calle Marina 123',
      price: 250000,
      currency: 'USD',
      type: 'Casa',
      bedrooms: 3,
      bathrooms: 2,
      neighborhood: 'Punta del Este',
      locality: 'Maldonado',
      province: 'Maldonado',
      squareMeters: 200,
      coveredArea: 150,
      operationType: 'venta',
      images: [],
      description: 'Hermosa casa de playa con vista al mar.',
      status: 'disponible',
      lessor: '',
      lessee: '',
      features: ['pileta', 'parrilla'],
      services: ['luz', 'agua corriente'],
      age: 5,
      parkingSpots: 2,
      allowsPets: true,
    },
  ]);

  const [filters, setFilters] = useState({
    operationType: '',
    type: '',
    bedrooms: '',
    bathrooms: '',
    priceRange: { min: 0, max: Infinity },
    status: '',
    allowsPets: null,
  });

  const [showFilters, setShowFilters] = useState(false); // Estado para mostrar/ocultar filtros

  const filterProperties = (properties, filters) => {
    return properties.filter((property) => {
      return (
        (filters.operationType === '' || property.operationType === filters.operationType) &&
        (filters.type === '' || property.type === filters.type) &&
        (filters.bedrooms === '' || property.bedrooms >= filters.bedrooms) &&
        (filters.bathrooms === '' || property.bathrooms >= filters.bathrooms) &&
        (property.price >= filters.priceRange.min && property.price <= filters.priceRange.max) &&
        (filters.status === '' || property.status === filters.status) &&
        (filters.allowsPets === null || property.allowsPets === (filters.allowsPets === 'true'))
      );
    });
  };

  const [view, setView] = useState('selection');
  const [selectedOperation, setSelectedOperation] = useState('');

  const handleOperationSelection = (operation) => {
    setSelectedOperation(operation);
    setView('list');
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredProperties = filterProperties(properties, filters);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen p-8">
      <Header userRole="admin" />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          Gestión de Propiedades
        </h1>
        
        {view === 'selection' ? (
          <OperationSelection onSelect={handleOperationSelection} />
        ) : view === 'list' ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                {selectedOperation === 'venta' ? 'Propiedades en Venta' : 'Propiedades en Alquiler'}
              </h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center space-x-2 transition duration-300 shadow-lg hover:shadow-xl"
                >
                  <FaFilter />
                  <span>{showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}</span>
                </button>
              </div>
            </div>

            {showFilters && <FilterControls filters={filters} onFilterChange={handleFilterChange} />}

            <PropertyList 
              properties={filteredProperties} 
              selectedOperation={selectedOperation}
            />
          </>
        ) : null}
      </div>
    </div>
  );
};

export default PropertyManagement;