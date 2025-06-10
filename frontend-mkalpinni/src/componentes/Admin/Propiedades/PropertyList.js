import { FaEdit, FaTrash, FaPlus, FaSearch, FaEye, FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaTag } from 'react-icons/fa';
import React, { useState } from 'react';

const PropertyList = ({ properties, selectedOperation, onAddNew, onEdit, onDelete, onUpdateStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lessor, setLessor] = useState('');
  const [lessee, setLessee] = useState('');
  const [images, setImages] = useState([]);

  const filteredProperties = properties.filter((property) => {
    return (
      property.operationType === selectedOperation &&
      property.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleViewProperty = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
    setLessor('');
    setLessee('');
  };

  const handleReserveProperty = () => {
    if (lessor && lessee) {
      onUpdateStatus(selectedProperty.id, 'reservado', lessor, lessee);
      closeModal();
    } else {
      alert('Por favor ingrese el nombre del locador y locatario.');
    }
  };

  const handleOccupyProperty = () => {
    onUpdateStatus(selectedProperty.id, 'ocupado');
    closeModal();
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          {selectedOperation === 'venta' ? 'Propiedades en Venta' : 'Propiedades en Alquiler'}
        </h2>
        <button
          onClick={onAddNew}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg flex items-center space-x-2 transition duration-300 shadow-lg hover:shadow-xl"
        >
          <FaPlus />
          <span>Registrar Nueva Propiedad</span>
        </button>
      </div>

      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por título o dirección..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-3 px-4 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 shadow-sm"
          />
          <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProperties.map((property) => (
          <div
            key={property.id}
            className={`bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300 hover:shadow-2xl ${
              property.status === 'ocupado' ? 'bg-gray-100' : ''
            }`}
          >
            {property.images && property.images.length > 0 && (
              <img
                src={URL.createObjectURL(property.images[0])}
                alt={property.title}
                className="w-full h-56 object-cover"
              />
            )}
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-900">{property.title}</h3>
                <span className="text-green-600 font-bold text-xl">${property.price.toLocaleString()}</span>
              </div>

              <p className="text-gray-600 mb-4 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-blue-500" />
                {property.address}
              </p>

              <div className="flex space-x-4 text-gray-600 mb-6">
                <span className="flex items-center">
                  <FaBed className="mr-2 text-blue-500" />
                  {property.bedrooms} dormitorios
                </span>
                <span className="flex items-center">
                  <FaBath className="mr-2 text-blue-500" />
                  {property.bathrooms} baños
                </span>
                <span className="flex items-center">
                  <FaRulerCombined className="mr-2 text-blue-500" />
                  {property.squareMeters} m²
                </span>
              </div>

              <div className="flex items-center mb-4">
                <FaTag className="mr-2 text-blue-500" />
                <span className="text-gray-600">Tipo: {property.type}</span>
              </div>

              <div className="text-gray-600 mb-6">
                <p className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-blue-500" />
                  Barrio: {property.neighborhood}
                </p>
                <p className="flex items-center">
                  Localidad: {property.locality}
                </p>
                <p className="flex items-center">
                  Provincia: {property.province}
                </p>
              </div>

              <div className="text-gray-600 mb-6">
                <p className="flex items-center">
                  Estado: {property.status}
                </p>
                {property.status === 'reservado' && (
                  <div>
                    <p className="text-gray-600">Locador: {property.lessor}</p>
                    <p className="text-gray-600">Locatario: {property.lessee}</p>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(property)}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition duration-300"
                >
                  <FaEdit />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => onDelete(property.id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition duration-300"
                >
                  <FaTrash />
                  <span>Eliminar</span>
                </button>
                <button
                  onClick={() => handleViewProperty(property)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition duration-300"
                >
                  <FaEye />
                  <span>Ver</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredProperties.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No se encontraron propiedades.
          </div>
        )}
      </div>

      {isModalOpen && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 overflow-y-auto max-h-screen">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{selectedProperty.title}</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {selectedProperty.images.map((image, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt={`Imagen ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
            <p className="text-gray-600 mb-4 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-blue-500" />
              {selectedProperty.address}
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-600">Tipo: {selectedProperty.type}</p>
                <p className="text-gray-600">Precio: ${selectedProperty.price.toLocaleString()}</p>
                <p className="text-gray-600">Dormitorios: {selectedProperty.bedrooms}</p>
                <p className="text-gray-600">Baños: {selectedProperty.bathrooms}</p>
                <p className="text-gray-600">Metros cuadrados: {selectedProperty.squareMeters} m²</p>
              </div>
              <div>
                <p className="text-gray-600">Barrio: {selectedProperty.neighborhood}</p>
                <p className="text-gray-600">Localidad: {selectedProperty.locality}</p>
                <p className="text-gray-600">Provincia: {selectedProperty.province}</p>
              </div>
            </div>
            <div className="text-gray-600 mb-6">
              <p className="flex items-center">
                Estado: {selectedProperty.status}
              </p>
              {selectedProperty.status === 'reservado' && (
                <div>
                  <p className="text-gray-600">Locador: {selectedProperty.lessor}</p>
                  <p className="text-gray-600">Locatario: {selectedProperty.lessee}</p>
                </div>
              )}
            </div>
            <div className="text-gray-600 mb-6">
              <p className="text-gray-600">Descripción: {selectedProperty.description}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={closeModal}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition duration-300"
              >
                <span>Cerrar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyList;