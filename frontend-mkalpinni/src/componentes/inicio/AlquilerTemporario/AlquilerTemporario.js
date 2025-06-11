import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Componentes/Header';
import { MapPin, Home, Bath, Maximize, Search, Bookmark, DollarSign, BedDouble, Filter, Calendar, User, Loader2 } from 'lucide-react'; // Agregamos Loader2 para el estado de carga
import Footer from '../Componentes/Footer';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { API_BASE_URL } from '../../../config/apiConfig';

const AlquilerTemporario = () => {
  const navigate = useNavigate();

  // Estado para las propiedades y filtros
  const [propiedades, setPropiedades] = useState([]);
  const [filtros, setFiltros] = useState({
    precioMin: '', // Cambiamos a string vacío para mejor manejo de input
    precioMax: '', // Cambiamos a string vacío para mejor manejo de input
    habitaciones: '',
    banos: '',
    tipo: '',
    ubicacion: '',
    checkIn: '',
    checkOut: '',
    adultos: 1,
    niños: 0,
    habitacionesFiltro: 1
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [propiedadesFiltradas, setPropiedadesFiltradas] = useState([]);
  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [mostrarSelectorHuespedes, setMostrarSelectorHuespedes] = useState(false);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de errores

  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const mapContainerRef = useRef(null);

  // Función para obtener propiedades de la API
  const fetchPropiedades = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      // Mapear los nombres de los filtros del frontend a los del backend
      if (params.ubicacion) query.append('ubicacion', params.ubicacion);
      if (params.barrio) query.append('barrio', params.barrio);
      if (params.precioMin) query.append('precioMin', params.precioMin);
      if (params.precioMax) query.append('precioMax', params.precioMax);
      if (params.habitaciones) query.append('habitacionesMin', params.habitaciones); // habitaciones en backend es habitacionesMin
      if (params.tipo) query.append('tipoPropiedad', params.tipo); // tipo en backend es tipoPropiedad
      // No hay un filtro directo para baños en la API actual
      // No hay filtros de checkIn, checkOut, adultos, niños en la API actual para la búsqueda general

      const url = `${API_BASE_URL}/Propiedad/Buscar?${query.toString()}`;
      console.log('Fetching from URL:', url); // Para depuración

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      if (data.status) {
        const mappedProperties = data.value.map(p => ({
            id: p.idPropiedad,
            titulo: p.titulo,
            precio: p.precio,
            ubicacion: p.ubicacion,
            barrio: p.barrio,
            habitaciones: p.habitaciones, // Mapear a nombre de frontend
            banos: p.banos, // Mapear a nombre de frontend
            superficie: p.superficieM2, // Mapear a nombre de frontend
            tipo: p.tipoPropiedad, // Mapear a nombre de frontend
            coordenadas: { lat: p.latitud, lng: p.longitud }, // Mapear a nombre de frontend
            favorito: false // Asumimos false, la API no devuelve este estado
        }));
        setPropiedades(mappedProperties);
        setPropiedadesFiltradas(mappedProperties);
      } else {
        setError(data.msg || 'Error al cargar las propiedades.');
        setPropiedades([]);
        setPropiedadesFiltradas([]);
      }
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError('No se pudieron cargar las propiedades. Intenta de nuevo más tarde.');
      setPropiedades([]);
      setPropiedadesFiltradas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar propiedades al inicio del componente
  useEffect(() => {
    fetchPropiedades(filtros); // Cargar con los filtros iniciales
  }, [fetchPropiedades]);

  // Manejar cambios en los filtros
  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros({
      ...filtros,
      [name]: value
    });
  };

  // Manejar búsqueda por ubicación (ajustado para usar el filtro de la API)
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    // La búsqueda principal ahora se convierte en un filtro de 'ubicacion' o 'barrio' para la API
    // Si searchTerm está vacío, se borra el filtro de ubicación
    if (!searchTerm.trim()) {
      aplicarFiltros({ ...filtros, ubicacion: '', barrio: '' });
      return;
    }
    
    // Intentamos buscar por barrio o ubicación en los datos existentes para ver si coincide
    // Aunque la API lo maneja, esto podría dar una mejor UX si ya tenemos los datos
    const matchingBarrios = propiedades.filter(prop => 
        prop.barrio.toLowerCase().includes(searchTerm.toLowerCase()) || 
        prop.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (matchingBarrios.length > 0) {
        // Si hay una coincidencia, aplicamos los filtros incluyendo la ubicación/barrio de la coincidencia
        const firstMatch = matchingBarrios[0];
        setFiltros(prevFiltros => ({
            ...prevFiltros,
            ubicacion: firstMatch.ubicacion,
            barrio: firstMatch.barrio // Asumimos que la API puede buscar por barrio también si lo mandamos
        }));
        aplicarFiltros({ ...filtros, ubicacion: firstMatch.ubicacion, barrio: firstMatch.barrio });
    } else {
        // Si no hay coincidencia local, intentamos buscar con el término tal cual en la API
        aplicarFiltros({ ...filtros, ubicacion: searchTerm, barrio: searchTerm });
    }
  };

  // Aplicar filtros (modificado para llamar a la API)
  const aplicarFiltros = (currentFiltros = filtros) => {
    // Aquí es donde llamamos a la API con los filtros actuales
    // Transformamos los filtros del frontend a los nombres esperados por la API
    const apiParams = {
        ubicacion: currentFiltros.ubicacion,
        barrio: currentFiltros.ubicacion, // Si se busca por ubicación, también podríamos buscar por barrio
        precioMin: currentFiltros.precioMin ? parseInt(currentFiltros.precioMin) : null,
        precioMax: currentFiltros.precioMax ? parseInt(currentFiltros.precioMax) : null,
        habitacionesMin: currentFiltros.habitaciones ? parseInt(currentFiltros.habitaciones) : null,
        tipoPropiedad: currentFiltros.tipo,
        // La API actual no soporta banos, checkIn, checkOut, adultos, niños directamente en la búsqueda
        // Tendríamos que filtrar estos en el frontend si es crítico o extender la API
    };
    fetchPropiedades(apiParams);
    setMostrarFiltros(false);
  };

  // Alternar favorito (se mantiene localmente ya que la API no lo maneja)
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

  // Actualizar marcadores en el mapa
  const updateMapMarkers = (propiedadesToDisplay) => {
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

    propiedadesToDisplay.forEach(propiedad => {
      // Asegurarse de que las coordenadas sean válidas
      if (propiedad.coordenadas && typeof propiedad.coordenadas.lat === 'number' && typeof propiedad.coordenadas.lng === 'number') {
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
      } else {
        console.warn('Propiedad con coordenadas inválidas, omitiendo marcador:', propiedad);
      }
    });

    if (propiedadesToDisplay.length > 0) {
      const validCoordinates = propiedadesToDisplay.filter(p => p.coordenadas && typeof p.coordenadas.lat === 'number' && typeof p.coordenadas.lng === 'number').map(p => [p.coordenadas.lat, p.coordenadas.lng]);
      if (validCoordinates.length > 0) {
        const bounds = L.latLngBounds(validCoordinates);
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    } else {
        // Si no hay propiedades, centrar el mapa en una ubicación predeterminada (e.g., Buenos Aires)
        mapRef.current.setView([-34.603, -58.381], 12);
    }
  };

  // Manejar tecla Enter en la búsqueda
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Obtener opciones únicas para filtros
  const ubicaciones = [...new Set(propiedades.map(p => p.ubicacion))];
  const tipos = [...new Set(propiedades.map(p => p.tipo))];
  const habitacionesOptions = [...new Set(propiedades.map(p => p.habitaciones))].sort((a, b) => a - b);
  const banosOptions = [...new Set(propiedades.map(p => p.banos))].sort((a, b) => a - b);

  // Total de huéspedes
  const totalHuespedes = filtros.adultos + filtros.niños;

  // Aplicar selección de huéspedes
  const handleAplicarHuespedes = () => {
    setMostrarSelectorHuespedes(false);
    aplicarFiltros(); // Re-aplicar filtros después de cambiar huéspedes/habitaciones
  };

  // Inicializar el mapa
  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([-34.603, -58.381], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(mapRef.current);

      // No se actualiza aquí, se actualiza en el useEffect de propiedadesFiltradas
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Actualizar marcadores cuando cambian las propiedades filtradas
  useEffect(() => {
    updateMapMarkers(propiedadesFiltradas);
  }, [propiedadesFiltradas, propiedadSeleccionada]); // Dependencia propiedadSeleccionada para actualizar el icono

  // Centrar el mapa en la propiedad seleccionada
  useEffect(() => {
    if (propiedadSeleccionada && mapRef.current) {
      // Asegurarse de que las coordenadas son válidas antes de centrar
      if (propiedadSeleccionada.coordenadas && typeof propiedadSeleccionada.coordenadas.lat === 'number' && typeof propiedadSeleccionada.coordenadas.lng === 'number') {
        mapRef.current.setView([propiedadSeleccionada.coordenadas.lat, propiedadSeleccionada.coordenadas.lng], 14);
      }
      
      // Actualizar el estilo de los marcadores para reflejar la selección
      markersRef.current.forEach(marker => {
        const markerElement = marker._icon;
        if (markerElement) {
          if (marker.options.propiedadId === propiedadSeleccionada.id) {
            markerElement.classList.add('selected-marker');
            markerElement.querySelector('.marker-pin').classList.remove('bg-blue-600');
            markerElement.querySelector('.marker-pin').classList.add('bg-red-500', 'animate-pulse');
          } else {
            markerElement.classList.remove('selected-marker');
            markerElement.querySelector('.marker-pin').classList.remove('bg-red-500', 'animate-pulse');
            markerElement.querySelector('.marker-pin').classList.add('bg-blue-600');
          }
        }
      });
    }
  }, [propiedadSeleccionada]);

  return (
    <div className="flex flex-col min-h-screen bg-white-50">
      <Header />

      <div className="bg-gray-200 text-black py-16 mb-10 mt-1">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Encuentra su alojamiento</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">Explora nuestra selección de propiedades exclusivas y encuentra tu hogar perfecto con nosotros.</p>

          <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">¿Adónde vas?</label>
                <input
                  type="text"
                  placeholder="Ubicación"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Check-in</label>
                <input
                  type="date"
                  name="checkIn"
                  value={filtros.checkIn}
                  onChange={handleFiltroChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Check-out</label>
                <input
                  type="date"
                  name="checkOut"
                  value={filtros.checkOut}
                  onChange={handleFiltroChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Huéspedes</label>
                <button
                  onClick={() => setMostrarSelectorHuespedes(!mostrarSelectorHuespedes)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
                >
                  {totalHuespedes} huéspedes, {filtros.habitacionesFiltro} habitaciones
                </button>
                {mostrarSelectorHuespedes && (
                  <div className="absolute bg-white p-4 rounded-lg shadow-lg mt-2 z-50">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Adultos</label>
                        <select
                          name="adultos"
                          value={filtros.adultos}
                          onChange={handleFiltroChange}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {[...Array(10).keys()].map(num => (
                            <option key={num + 1} value={num + 1}>{num + 1} Adulto{num + 1 > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Niños</label>
                        <select
                          name="niños"
                          value={filtros.niños}
                          onChange={handleFiltroChange}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {[...Array(6).keys()].map(num => (
                            <option key={num} value={num}>{num} Niño{num > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Habitaciones</label>
                        <select
                          name="habitacionesFiltro"
                          value={filtros.habitacionesFiltro}
                          onChange={handleFiltroChange}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {[...Array(5).keys()].map(num => (
                            <option key={num + 1} value={num + 1}>{num + 1} Habitación{num + 1 > 1 ? 'es' : ''}</option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={handleAplicarHuespedes}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => aplicarFiltros()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 animate-spin" size={18} /> : <Search size={18} className="mr-2" />}
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
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

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-blue-600" />
                      Barrio
                    </div>
                  </label>
                  <div className="relative">
                    <select
                      name="ubicacion" // Usamos 'ubicacion' para mapear a 'barrio' o 'ubicacion' en la API
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

                <div className="pt-4 space-y-3">
                  <button
                    onClick={() => aplicarFiltros()}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="mr-2 animate-spin" size={18} /> : null}
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

              {loading ? (
                <div className="flex flex-col items-center justify-center bg-white p-8 rounded-xl shadow-md">
                  <Loader2 className="animate-spin text-blue-500 w-12 h-12 mb-4" />
                  <p className="text-gray-700 text-lg">Cargando propiedades...</p>
                </div>
              ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">¡Error!</strong>
                  <span className="block sm:inline"> {error}</span>
                </div>
              ) : propiedadesFiltradas.length === 0 ? (
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
                          onClick={() => navigate(`/alquilertemporario/detalle/${propiedad.id}`)} 
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

export default AlquilerTemporario;