import React, { useState } from 'react';
import AddPropertyForm from './AddPropertyForm';
import Filters from './Filters';
import ReservationCalendar from './ReservationCalendar';
import EditPropertyForm from './EditPropertyForm';
import Header from '../../inicio/Componentes/Header';

const PropertyList = () => {
  // Lista inicial de propiedades (tus propiedades)
  const [properties, setProperties] = useState([
    {
      id: 1,
      name: 'Casa en la playa',
      description: 'Hermosa casa frente al mar con vista panorámica.',
      location: { city: 'Playa del Carmen', address: 'Calle 123' },
      capacity: 6,
      services: ['WiFi', 'Aire acondicionado', 'TV'],
      price: { night: 150, week: 900, month: 3500 },
      images: ['https://via.placeholder.com/300'],
      availability: [
        {
          startDate: '2023-11-15',
          endDate: '2023-11-20',
          status: 'occupied',
          guest: {
            name: 'Juan Pérez',
            contact: 'juan@example.com',
            paymentMethod: 'Tarjeta de Crédito',
            amountPaid: 900,
            checkIn: '2023-11-15',
            checkOut: '2023-11-20',
            reservationStatus: 'confirmed',
          },
        },
      ],
      rules: {
        checkIn: '15:00',
        checkOut: '11:00',
        cancellationPolicy: 'Flexible',
        houseRules: 'No se permiten mascotas',
      },
      securityDeposit: 200,
      paymentMethods: ['Tarjeta de Crédito', 'PayPal'],
      paymentHistory: [
        {
          date: '2023-11-15',
          amount: 900,
          method: 'Tarjeta de Crédito',
          status: 'paid',
        },
      ],
    },
    {
      id: 2,
      name: 'Departamento céntrico',
      description: 'Moderno departamento en el corazón de la ciudad.',
      location: { city: 'Ciudad de México', address: 'Avenida Principal 456' },
      capacity: 4,
      services: ['WiFi', 'TV'],
      price: { night: 100, week: 600, month: 2500 },
      images: ['https://via.placeholder.com/300'],
      availability: [],
      rules: {
        checkIn: '14:00',
        checkOut: '10:00',
        cancellationPolicy: 'Estricta',
        houseRules: 'Prohibido fumar',
      },
      securityDeposit: 150,
      paymentMethods: ['Tarjeta de Crédito', 'Transferencia Bancaria'],
      paymentHistory: [],
    },
  ]);

  const [editingProperty, setEditingProperty] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [filters, setFilters] = useState({
    city: '',
    capacity: '',
    priceRange: { min: 0, max: 1000 },
    services: [],
  });

  const [showFilters, setShowFilters] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const [users, setUsers] = useState([
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'admin' },
    { id: 2, name: 'María López', email: 'maria@example.com', role: 'guest' },
  ]);

  const [payments, setPayments] = useState([]);

  // Filtrar propiedades
  const filteredProperties = properties.filter((property) => {
    return (
      (filters.city === '' || property.location.city.includes(filters.city)) &&
      (filters.capacity === '' || property.capacity >= parseInt(filters.capacity)) &&
      property.price.night >= filters.priceRange.min &&
      property.price.night <= filters.priceRange.max &&
      (filters.services.length === 0 ||
        filters.services.every((service) => property.services.includes(service)))
    );
  });

  // Agregar una reserva
  const handleReserve = (propertyId, reservation) => {
    setProperties((prevProperties) =>
      prevProperties.map((p) =>
        p.id === propertyId
          ? { ...p, availability: [...p.availability, reservation] }
          : p
      )
    );
  };

  // Cancelar una reserva
  const handleCancelReservation = (reservation) => {
    setProperties((prevProperties) =>
      prevProperties.map((p) =>
        p.id === selectedProperty.id
          ? {
              ...p,
              availability: p.availability.filter(
                (r) => r.startDate !== reservation.startDate || r.endDate !== reservation.endDate
              ),
            }
          : p
      )
    );
  };

  // Ver detalles de la propiedad
  const handleViewProperty = (property) => {
    setSelectedProperty(property);
  };

  // Cerrar vista detallada
  const handleCloseDetail = () => {
    setSelectedProperty(null);
  };

  // Guardar cambios en la propiedad editada
  const handleSaveProperty = (updatedProperty) => {
    setProperties((prevProperties) =>
      prevProperties.map((p) =>
        p.id === updatedProperty.id ? updatedProperty : p
      )
    );
    setEditingProperty(null); // Cerrar el formulario de edición
  };

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <Header userRole="admin" />
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Administrador de Propiedades</h1>

      {/* Contenedor principal con filtro y lista de propiedades */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Columna del filtro */}
        {showFilters && (
          <div className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow-md">
            <Filters filters={filters} onFilterChange={setFilters} />
          </div>
        )}

        {/* Columna de la lista de propiedades y formulario de agregar */}
        <div className="flex-1 flex flex-col md:flex-row gap-6">
          {/* Lista de propiedades */}
          <div className="flex-1">
            {/* Botones principales */}
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition duration-300 shadow-md"
              >
                {showAddForm ? 'Ocultar Formulario' : 'Agregar Propiedad'}
              </button>
            </div>

            {/* Lista de propiedades */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <div key={property.id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition duration-300">
                  <h3 className="text-xl font-bold text-gray-800">{property.name}</h3>
                  <p className="text-sm text-gray-600">{property.description}</p>
                  <p className="text-sm text-gray-700 mt-2">
                    <span className="font-semibold">Ubicación:</span> {property.location.city}, {property.location.address}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Capacidad:</span> {property.capacity}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Precio por noche:</span> ${property.price.night}
                  </p>
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => handleViewProperty(property)}
                      className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                      Ver Detalles
                    </button>
                    <button
                      onClick={() => setProperties(properties.filter((p) => p.id !== property.id))}
                      className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition duration-300"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formulario de agregar propiedad (a la derecha) */}
          {showAddForm && (
            <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-md">
              <AddPropertyForm
                onAddProperty={(property) => {
                  setProperties([...properties, property]);
                  setShowAddForm(false); // Ocultar el formulario después de agregar
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Formulario de edición (modal) */}
      {editingProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl">
            <EditPropertyForm
              property={editingProperty}
              onSave={handleSaveProperty}
              onClose={() => setEditingProperty(null)}
            />
          </div>
        </div>
      )}

      {/* Vista detallada de la propiedad */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedProperty.name}</h2>
            <p className="text-sm text-gray-600">{selectedProperty.description}</p>
            <p className="text-sm text-gray-700 mt-2">
              <span className="font-semibold">Ubicación:</span> {selectedProperty.location.city}, {selectedProperty.location.address}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Capacidad:</span> {selectedProperty.capacity}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Precio por noche:</span> ${selectedProperty.price.night}
            </p>

            {/* Formulario para agregar reservas */}
            <div className="mt-4">
              <ReservationCalendar
                property={selectedProperty}
                onReserve={(reservation) => handleReserve(selectedProperty.id, reservation)}
                users={users}
                onCancelReservation={handleCancelReservation}
                onAddUser={(newUser) => setUsers([...users, { ...newUser, id: users.length + 1 }])}
              />
            </div>

            {/* Botones de acción */}
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => setEditingProperty(selectedProperty)}
                className="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600 transition duration-300"
              >
                Editar
              </button>
              <button
                onClick={handleCloseDetail}
                className="bg-gray-500 text-white py-1 px-3 rounded-md hover:bg-gray-600 transition duration-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyList;