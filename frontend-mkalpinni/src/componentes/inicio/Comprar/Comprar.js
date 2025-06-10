import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Componentes/Header';
import { MapPin, Home, Bath, Maximize, Search, Bookmark, ArrowRight, RefreshCw, DollarSign, BedDouble, Filter } from 'lucide-react';
import Footer from '../Componentes/Footer';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Comprar = () => {
  const navigate = useNavigate();

  const [propiedades, setPropiedades] = useState([
    { id: 1, titulo: 'Apartamento moderno', precio: 250000, ubicacion: 'Centro', barrio: 'Microcentro', habitaciones: 2, banos: 1, superficie: 75, tipo: 'Apartamento', coordenadas: { lat: -34.603, lng: -58.381 }, favorito: false },
    { id: 2, titulo: 'Casa con jardín', precio: 320000, ubicacion: 'Zona Norte', barrio: 'Belgrano', habitaciones: 3, banos: 2, superficie: 150, tipo: 'Casa', coordenadas: { lat: -34.570, lng: -58.450 }, favorito: false },
    { id: 3, titulo: 'Loft industrial', precio: 180000, ubicacion: 'Puerto', barrio: 'Puerto Madero', habitaciones: 1, banos: 1, superficie: 60, tipo: 'Loft', coordenadas: { lat: -34.628, lng: -58.370 }, favorito: false },
    { id: 4, titulo: 'Penthouse de lujo', precio: 450000, ubicacion: 'Centro', barrio: 'Recoleta', habitaciones: 4, banos: 3, superficie: 200, tipo: 'Penthouse', coordenadas: { lat: -34.600, lng: -58.390 }, favorito: false }
  ]);

  const [filtros, setFiltros] = useState({
    precioMin: 0,
    precioMax: 1000000,
    habitaciones: '',
    banos: '',
    tipo: '',
    ubicacion: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [propiedadesFiltradas, setPropiedadesFiltradas] = useState(propiedades);
  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const mapContainerRef = useRef(null);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros({
      ...filtros,
      [name]: value
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      // Si no hay término de búsqueda, reiniciar el filtro de ubicación
      setFiltros({
        ...filtros,
        ubicacion: ''
      });
      aplicarFiltros('');
      return;
    }
    
    // Find matching barrios based on the search term
    const matchingBarrios = propiedades.filter(prop => 
      prop.barrio.toLowerCase().includes(searchTerm.toLowerCase()) || 
      prop.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // If there are matching properties, update the ubicacion filter
    if (matchingBarrios.length > 0) {
      // Set the ubicacion filter to the first matching ubicacion
      const firstMatch = matchingBarrios[0];
      setFiltros({
        ...filtros,
        ubicacion: firstMatch.ubicacion
      });
      
      // Apply the filter automatically
      aplicarFiltros(firstMatch.ubicacion);
    }
  };

  const aplicarFiltros = (ubicacionOverride = null) => {
    const filtradas = propiedades.filter(propiedad => {
      if (filtros.precioMin && propiedad.precio < parseInt(filtros.precioMin)) return false;
      if (filtros.precioMax && propiedad.precio > parseInt(filtros.precioMax)) return false;
      if (filtros.habitaciones && propiedad.habitaciones !== parseInt(filtros.habitaciones)) return false;
      if (filtros.banos && propiedad.banos !== parseInt(filtros.banos)) return false;
      if (filtros.tipo && propiedad.tipo !== filtros.tipo) return false;
      
      // Use override if provided (from search), otherwise use the filter value
      const ubicacionToCheck = ubicacionOverride || filtros.ubicacion;
      if (ubicacionToCheck && propiedad.ubicacion !== ubicacionToCheck) return false;
      
      return true;
    });

    setPropiedadesFiltradas(filtradas);
    setMostrarFiltros(false);
    updateMapMarkers(filtradas);
  };

  const toggleFavorito = (id, e) => {
    e.stopPropagation();
    const nuevasPropiedades = propiedades.map(prop => 
      prop.id === id ? { ...prop, favorito: !prop.favorito } : prop
    );
    setPropiedades(nuevasPropiedades);
    setPropiedadesFiltradas(prevFiltradas => 
      prevFiltradas.map(prop => 
        prop.id === id ? { ...prop, favorito: !prop.favorito } : prop
      )
    );
  };

  const updateMapMarkers = (propiedades) => {
    if (!mapRef.current) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const defaultIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div class="marker-pin bg-blue-600 text-white flex items-center justify-center rounded-full shadow-lg" style="width: 30px; height: 30px;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    });

    const selectedIcon = L.divIcon({
      className: 'custom-marker selected',
      html: `<div class="marker-pin bg-red-500 text-white flex items-center justify-center rounded-full shadow-lg animate-pulse" style="width: 36px; height: 36px;"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 36]
    });

    propiedades.forEach(propiedad => {
      const isSelected = propiedadSeleccionada?.id === propiedad.id;
      const icon = isSelected ? selectedIcon : defaultIcon;

      const marker = L.marker([propiedad.coordenadas.lat, propiedad.coordenadas.lng], {
        icon: icon,
        propiedadId: propiedad.id
      }).addTo(mapRef.current);

      marker.on('click', () => {
        setPropiedadSeleccionada(propiedad);
      });

      marker.bindPopup(`
        <div class="font-semibold">${propiedad.titulo}</div>
        <div class="text-blue-600 font-medium">$${propiedad.precio.toLocaleString()}</div>
        <div class="text-sm text-gray-600">${propiedad.barrio}</div>
      `);

      markersRef.current.push(marker);
    });

    if (propiedades.length > 0) {
      const bounds = L.latLngBounds(propiedades.map(p => [p.coordenadas.lat, p.coordenadas.lng]));
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([-34.603, -58.381], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(mapRef.current);

      updateMapMarkers(propiedadesFiltradas);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    updateMapMarkers(propiedadesFiltradas);
  }, [propiedadesFiltradas]);

  useEffect(() => {
    if (propiedadSeleccionada && mapRef.current) {
      mapRef.current.setView([propiedadSeleccionada.coordenadas.lat, propiedadSeleccionada.coordenadas.lng], 14);

      markersRef.current.forEach(marker => {
        const markerElement = marker._icon;
        if (markerElement) {
          if (marker.options.propiedadId === propiedadSeleccionada.id) {
            markerElement.classList.add('selected-marker');
          } else {
            markerElement.classList.remove('selected-marker');
          }
        }
      });
    }
  }, [propiedadSeleccionada]);

  // Handle keyboard Enter key for search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const ubicaciones = [...new Set(propiedades.map(p => p.ubicacion))];
  const tipos = [...new Set(propiedades.map(p => p.tipo))];
  const habitacionesOptions = [...new Set(propiedades.map(p => p.habitaciones))].sort((a, b) => a - b);
  const banosOptions = [...new Set(propiedades.map(p => p.banos))].sort((a, b) => a - b);

  return (
    <div className="flex flex-col min-h-screen bg-white-50">
      <Header />

      <div className="bg-gray-200 text-black py-16 mb-10 mt-1">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Encuentra la propiedad de tus sueños</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">Explora nuestra selección de propiedades exclusivas y encuentra tu hogar perfecto con nosotros.</p>

          <div className="bg-white rounded-full shadow-lg p-2 flex items-center max-w-3xl mx-auto">
            <div className="flex-1 pl-4">
              <input
                type="text"
                placeholder="¿Qué zona te interesa?"
                className="w-full text-gray-800 focus:outline-none py-2"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
              />
            </div>
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full py-3 px-6 flex items-center font-medium transition-colors"
              onClick={handleSearch}
            >
              <Search size={18} className="mr-2" />
              Buscar
            </button>
          </div>
        </div>
      </div>

      <main className="container mx-auto p-4 flex-grow">
        <div className="md:hidden mb-4">
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="w-full bg-white shadow rounded-lg p-3 flex items-center justify-center text-gray-700 font-medium"
          >
            <Filter size={18} className="mr-2 text-blue-600" />
            {mostrarFiltros ? 'Ocultar filtros' : 'Mostrar filtros'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className={`${mostrarFiltros ? 'block' : 'hidden'} md:block w-full md:w-1/4 transition-all duration-300`}>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <Filter size={20} className="mr-2 text-blue-600" />
                Filtrar propiedades
              </h2>

              <div className="space-y-5">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Precio</label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                        <DollarSign size={16} />
                      </span>
                      <input
                        type="number"
                        name="precioMin"
                        placeholder="Mínimo"
                        value={filtros.precioMin}
                        onChange={handleFiltroChange}
                        className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <span className="text-gray-400">-</span>
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                        <DollarSign size={16} />
                      </span>
                      <input
                        type="number"
                        name="precioMax"
                        placeholder="Máximo"
                        value={filtros.precioMax}
                        onChange={handleFiltroChange}
                        className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <BedDouble size={16} className="text-blue-600" />
                      Habitaciones
                    </div>
                  </label>
                  <div className="relative">
                    <select
                      name="habitaciones"
                      value={filtros.habitaciones}
                      onChange={handleFiltroChange}
                      className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    >
                      <option value="">Todas</option>
                      {habitacionesOptions.map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Bath size={16} className="text-blue-600" />
                      Baños
                    </div>
                  </label>
                  <div className="relative">
                    <select
                      name="banos"
                      value={filtros.banos}
                      onChange={handleFiltroChange}
                      className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    >
                      <option value="">Todos</option>
                      {banosOptions.map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Home size={16} className="text-blue-600" />
                      Tipo de propiedad
                    </div>
                  </label>
                  <div className="relative">
                    <select
                      name="tipo"
                      value={filtros.tipo}
                      onChange={handleFiltroChange}
                      className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    >
                      <option value="">Todos</option>
                      {tipos.map(tipo => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {searchTerm && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-blue-600" />
                        Barrio
                      </div>
                    </label>
                    <div className="relative">
                      <select
                        name="ubicacion"
                        value={filtros.ubicacion}
                        onChange={handleFiltroChange}
                        className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      >
                        <option value="">Todas</option>
                        {ubicaciones.map(ubicacion => (
                          <option key={ubicacion} value={ubicacion}>{ubicacion}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 space-y-3">
                  <button
                    onClick={() => aplicarFiltros()}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-3/4 space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-md h-64 md:h-96 relative overflow-hidden">
              <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <MapPin size={18} className="mr-2 text-blue-600" />
                Ubicación de propiedades
              </h2>
              <div
                ref={mapContainerRef}
                className="absolute inset-0 mt-16 rounded-lg overflow-hidden z-10"
                style={{ height: 'calc(100% - 4rem)' }}
              />

              {propiedadSeleccionada && (
                <div className="absolute bottom-4 left-4 right-4 bg-white p-3 rounded-lg shadow-lg z-20">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold">{propiedadSeleccionada.titulo}</h3>
                    <span className="text-blue-600 font-semibold">${propiedadSeleccionada.precio.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-gray-600">{propiedadSeleccionada.barrio}</div>
                </div>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <Home size={20} className="mr-2 text-blue-600" />
                  Propiedades disponibles
                </h2>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {propiedadesFiltradas.length} resultados
                </span>
              </div>

              {propiedadesFiltradas.length === 0 ? (
                <div className="bg-white p-8 rounded-xl shadow-md text-center">
                  <div className="text-blue-500 mx-auto w-16 h-16 mb-4 flex items-center justify-center bg-blue-50 rounded-full">
                    <Search size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No se encontraron resultados</h3>
                  <p className="text-gray-600 mt-2">Intenta modificar los filtros de búsqueda</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {propiedadesFiltradas.map(propiedad => (
                    <div
                      key={propiedad.id}
                      className={`bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all hover:shadow-lg
                        ${propiedadSeleccionada?.id === propiedad.id ? 'ring-2 ring-blue-500 transform scale-102' : ''}`}
                      onClick={() => setPropiedadSeleccionada(propiedad)}
                    >
                      <div className="h-52 bg-gray-200 relative">
                        <div className="absolute top-0 left-0 right-0 bottom-0">
                          <img src={`https://picsum.photos/seed/${propiedad.id}/400/300`} alt={propiedad.titulo} className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-start">
                          <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
                            {propiedad.tipo}
                          </div>
                          <button
                            onClick={(e) => toggleFavorito(propiedad.id, e)}
                            className={`p-2 rounded-full shadow-md transition-colors ${propiedad.favorito ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:text-red-500'}`}
                          >
                            <Bookmark size={18} className={propiedad.favorito ? 'fill-current' : ''} />
                          </button>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-bold text-gray-900">{propiedad.titulo}</h3>
                          <span className="text-lg font-bold text-blue-600">${propiedad.precio.toLocaleString()}</span>
                        </div>
                        <p className="text-gray-600 mt-1 flex items-center">
                          <MapPin size={14} className="mr-1 text-blue-500" />
                          {propiedad.ubicacion} - {propiedad.barrio}
                        </p>
                        <div className="flex gap-4 mt-4 text-sm">
                          <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg">
                            <BedDouble size={16} />
                            <span>{propiedad.habitaciones}</span>
                          </div>
                          <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg">
                            <Bath size={16} />
                            <span>{propiedad.banos}</span>
                          </div>
                          <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg">
                            <Maximize size={16} />
                            <span>{propiedad.superficie} m²</span>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/venta/detalle`)}
                          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all shadow-sm hover:shadow flex items-center justify-center"
                        >
                          Ver detalles
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Comprar;