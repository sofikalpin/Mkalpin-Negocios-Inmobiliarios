import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FaHome, FaBuilding, FaUsers, FaCalendarAlt, FaChartBar, FaCog, FaSignOutAlt, FaPlus, FaSearch, FaTh, FaList, FaFilter, FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaTag, FaEdit, FaTrash, FaEye, FaCheck, FaMoneyBillWave, FaTimes, FaDownload, FaSave, FaUser, FaRuler, FaSun, FaCalendarAlt as FaCalendar } from "react-icons/fa";

const EditPropertyForm = ({ property, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: { city: '', address: '' },
    capacity: '',
    services: [],
    price: { night: 0, week: 0, month: 0 },
    images: [],
    rules: {
      checkIn: '',
      checkOut: '',
      cancellationPolicy: '',
      houseRules: '',
    },
    securityDeposit: 0,
    paymentMethods: [],
  });

  // Cargar los datos de la propiedad al montar el componente
  useEffect(() => {
    if (property) {
      setFormData(property);
    }
  }, [property]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Manejar cambios en campos anidados (como location, price, etc.)
  const handleNestedChange = (parent, key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [parent]: {
        ...prevData[parent],
        [key]: value,
      },
    }));
  };

  // Manejar la selección de imágenes
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setFormData((prevData) => ({
      ...prevData,
      images: [...prevData.images, ...imageUrls],
    }));
  };

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-4xl mx-auto max-h-[80vh] overflow-y-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Editar Propiedad</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
            />
          </div>

          {/* Descripción */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
              rows="4"
            />
          </div>

          {/* Ubicación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
            <input
              type="text"
              value={formData.location.city}
              onChange={(e) => handleNestedChange('location', 'city', e.target.value)}
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input
              type="text"
              value={formData.location.address}
              onChange={(e) => handleNestedChange('location', 'address', e.target.value)}
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
            />
          </div>

          {/* Capacidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
            />
          </div>

          {/* Precios */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio por noche</label>
            <input
              type="number"
              value={formData.price.night}
              onChange={(e) => handleNestedChange('price', 'night', e.target.value)}
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio por semana</label>
            <input
              type="number"
              value={formData.price.week}
              onChange={(e) => handleNestedChange('price', 'week', e.target.value)}
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio por mes</label>
            <input
              type="number"
              value={formData.price.month}
              onChange={(e) => handleNestedChange('price', 'month', e.target.value)}
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
            />
          </div>

          {/* Servicios */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Servicios</label>
            <input
              type="text"
              value={formData.services.join(', ')}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  services: e.target.value.split(',').map((s) => s.trim()),
                }))
              }
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
            />
          </div>

          {/* Imágenes */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Imágenes</label>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
            />
            <div className="mt-4 flex flex-wrap gap-4">
              {formData.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Imagen ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition duration-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPropertyForm;