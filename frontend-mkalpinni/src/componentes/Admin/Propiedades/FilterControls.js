import React from 'react';

const FilterControls = ({ filters, onFilterChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4">Filtrar Propiedades</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo de Operación</label>
          <select
            name="operationType"
            value={filters.operationType}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Todos</option>
            <option value="venta">Venta</option>
            <option value="alquiler">Alquiler</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo de Propiedad</label>
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Todos</option>
            <option value="Casa">Casa</option>
            <option value="Apartamento">Apartamento</option>
            <option value="Terreno">Terreno</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Habitaciones</label>
          <input
            type="number"
            name="bedrooms"
            value={filters.bedrooms}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Baños</label>
          <input
            type="number"
            name="bathrooms"
            value={filters.bathrooms}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Rango de Precio</label>
          <div className="flex gap-2">
            <input
              type="number"
              name="priceRange.min"
              value={filters.priceRange.min}
              onChange={(e) => onFilterChange({ ...filters, priceRange: { ...filters.priceRange, min: e.target.value } })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="Mínimo"
            />
            <input
              type="number"
              name="priceRange.max"
              value={filters.priceRange.max}
              onChange={(e) => onFilterChange({ ...filters, priceRange: { ...filters.priceRange, max: e.target.value } })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="Máximo"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Estado</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Todos</option>
            <option value="disponible">Disponible</option>
            <option value="alquilada">Alquilada</option>
            <option value="vendida">Vendida</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Permite Mascotas</label>
          <select
            name="allowsPets"
            value={filters.allowsPets}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Todos</option>
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;