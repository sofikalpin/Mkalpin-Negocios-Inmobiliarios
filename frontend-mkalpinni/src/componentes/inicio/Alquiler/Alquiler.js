import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import Header from '../Componentes/Header';
import { MapPin, Home, Bath, Maximize, Search, Bookmark, RefreshCw, DollarSign, BedDouble, Filter, Loader2 } from 'lucide-react';
import Footer from '../Componentes/Footer';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { API_BASE_URL } from '../../../config/apiConfig';

const Alquiler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [propiedades, setPropiedades] = useState([]);
  const [propiedadesFiltradas, setPropiedadesFiltradas] = useState([]);
  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState(null);

  const [filtros, setFiltros] = useState({
    precioMin: '',
    precioMax: '',
    habitaciones: '',
    banos: '',
    tipo: location.state?.tipoPropiedad || '',
    barrio: location.state?.barrio || '',
    transaccionTipo: 'Alquiler', 
  });

  const [searchTerm, setSearchTerm] = useState('');

  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const mapContainerRef = useRef(null);

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

  const fetchPropiedades = useCallback(async (currentFilters, currentSearchTerm) => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();

      queryParams.append('transaccionTipo', 'Alquiler');

      if (currentFilters.precioMin) queryParams.append('precioMin', currentFilters.precioMin);
      if (currentFilters.precioMax) queryParams.append('precioMax', currentFilters.precioMax);
      if (currentFilters.habitaciones) queryParams.append('habitacionesMin', currentFilters.habitaciones);
      if (currentFilters.banos) queryParams.append('banos', currentFilters.banos);
      if (currentFilters.tipo) queryParams.append('tipoPropiedad', currentFilters.tipo);

      if (currentSearchTerm) {
        queryParams.append('barrio', currentSearchTerm);
      } else if (currentFilters.barrio) {
        queryParams.append('barrio', currentFilters.barrio);
      }

      const url = `${API_BASE_URL}/Propiedad/Buscar?${queryParams.toString()}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.status) {
        const mappedProperties = data.value.map(prop => ({
          id: prop._id,
          idPropiedad: prop._id,
          titulo: prop.titulo,
          descripcion: prop.descripcion,
          direccion: prop.direccion,
          barrio: prop.barrio,
          localidad: prop.localidad,
          provincia: prop.provincia,
          ubicacion: prop.ubicacion,
          tipoPropiedad: prop.tipoPropiedad,
          tipo: prop.tipoPropiedad,
          transaccionTipo: prop.transaccionTipo,
          precio: prop.precio,
          habitaciones: prop.habitaciones,
          banos: prop.banos,
          superficieM2: prop.superficieM2,
          superficie: prop.superficieM2,
          estado: prop.estado,
          latitud: prop.latitud,
          longitud: prop.longitud,
          coordenadas: { lat: prop.latitud || -34.603, lng: prop.longitud || -58.381 },
          favorito: prop.favorito || false,
          imagenes: prop.imagenes || [],
          fechaCreacion: prop.fechaCreacion,
        }));
        setPropiedades(mappedProperties);
        setPropiedadesFiltradas(mappedProperties);
      } else {
        setError(data.msg || 'No se pudieron cargar las propiedades.');
        setPropiedades([]);
        setPropiedadesFiltradas([]);
      }
    } catch (err) {
      console.error("Error al obtener propiedades:", err);
      setError('Hubo un problema al conectar con el servidor. Inténtalo de nuevo más tarde.');
      setPropiedades([]);
      setPropiedadesFiltradas([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (location.state) {
      const { tipoPropiedad, barrio } = location.state;
      const newFiltros = {
        ...filtros,
        tipo: tipoPropiedad || '',
        barrio: barrio || '',
      };
      setFiltros(newFiltros);
      fetchPropiedades(newFiltros, '');
    } else {
      fetchPropiedades(filtros, '');
    }
  }, [location.state, fetchPropiedades, filtros]);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros({
      ...filtros,
      [name]: value
    });
  };

  const aplicarFiltros = (currentFilters, currentSearchTerm) => {
    fetchPropiedades(currentFilters, currentSearchTerm);
    setMostrarFiltros(false);
  };

  const resetFiltros = () => {
    setFiltros({
      precioMin: '',
      precioMax: '',
      habitaciones: '',
      banos: '',
      tipo: '',
      ubicacion: ''
    });
    setSearchTerm('');
    fetchPropiedades({
      precioMin: '',
      precioMax: '',
      habitaciones: '',
      banos: '',
      tipo: '',
      ubicacion: ''
    }, '');
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

  const updateMapMarkers = useCallback((propertiesToDisplay) => {
    if (!mapRef.current) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    propertiesToDisplay.forEach(propiedad => {
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

    if (propertiesToDisplay.length > 0) {
      const bounds = L.latLngBounds(propertiesToDisplay.map(p => [p.coordenadas.lat, p.coordenadas.lng]));
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    } else {
      mapRef.current.setView([-34.603, -58.381], 12);
    }
  }, [propiedadSeleccionada, selectedIcon, defaultIcon]);

  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([-34.603, -58.381], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(mapRef.current);

      fetchPropiedades(filtros, searchTerm);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [fetchPropiedades, filtros, searchTerm]);

  useEffect(() => {
    updateMapMarkers(propiedadesFiltradas);
  }, [propiedadesFiltradas, updateMapMarkers]);

  useEffect(() => {
    if (propiedadSeleccionada && mapRef.current) {
      mapRef.current.setView([propiedadSeleccionada.coordenadas.lat, propiedadSeleccionada.coordenadas.lng], 14);

      markersRef.current.forEach(marker => {
        const markerElement = marker._icon;
        if (markerElement) {
          if (marker.options.propiedadId === propiedadSeleccionada.id) {
            markerElement.parentNode.classList.add('selected-marker-container');
            marker.setIcon(selectedIcon);
          } else {
            markerElement.parentNode.classList.remove('selected-marker-container');
            marker.setIcon(defaultIcon);
          }
        }
      });
    }
  }, [propiedadSeleccionada, defaultIcon, selectedIcon]);

  const barrios = [...new Set(propiedades.map(p => p.barrio))].sort();
  const tipos = [...new Set(propiedades.map(p => p.tipo))].sort();
  const habitacionesOptions = [...new Set(propiedades.map(p => p.habitaciones))].sort((a, b) => a - b);
  const banosOptions = [...new Set(propiedades.map(p => p.banos))].sort((a, b) => a - b);

  return (
    <div className="flex flex-col min-h-screen bg-white-50">
      <Header />

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

                {!searchTerm && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-blue-600" />
                        Ubicación / Barrio
                      </div>
                    </label>
                    <div className="relative">
                      <select
                        name="barrio"
                        value={filtros.barrio}
                        onChange={handleFiltroChange}
                        className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      >
                        <option value="">Todas</option>
                        {barrios.map(barrio => (
                          <option key={barrio} value={barrio}>{barrio}</option>
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
                    onClick={() => aplicarFiltros(filtros, searchTerm)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                  >
                    Aplicar filtros
                  </button>
                  <button
                    onClick={resetFiltros}
                    className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                  >
                    <RefreshCw size={18} className="mr-2" />
                    Limpiar filtros
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
                {isLoading ? (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <Loader2 size={16} className="animate-spin mr-2" /> Cargando...
                  </span>
                ) : (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {propiedadesFiltradas.length} resultados
                  </span>
                )}
              </div>

              {error && (
                <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4" role="alert">
                  <p className="font-semibold">Error:</p>
                  <p>{error}</p>
                </div>
              )}

              {!isLoading && propiedadesFiltradas.length === 0 && !error ? (
                <div className="bg-white p-8 rounded-xl shadow-md text-center">
                  <div className="text-blue-500 mx-auto w-16 h-16 mb-4 flex items-center justify-center bg-blue-50 rounded-full">
                    <Search size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No se encontraron resultados</h3>
                  <p className="text-gray-600 mt-2">Intenta modificar los filtros de búsqueda</p>
                  <button
                    onClick={resetFiltros}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center mx-auto"
                  >
                    <RefreshCw size={16} className="mr-2" />
                    Reiniciar búsqueda
                  </button>
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
                          onClick={() => navigate(`/alquiler/detalle/${propiedad.id}`)} 
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

export default Alquiler;