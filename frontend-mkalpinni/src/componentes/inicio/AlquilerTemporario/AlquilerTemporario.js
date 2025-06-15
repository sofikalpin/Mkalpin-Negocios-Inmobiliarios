import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from '../Componentes/Header';
import { MapPin, Home, Bath, Maximize, Search, Bookmark, DollarSign, BedDouble, Filter, Calendar, User, Loader2 } from 'lucide-react';
import Footer from '../Componentes/Footer';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { API_BASE_URL } from '../../../config/apiConfig';
import { useNavigate, useLocation } from 'react-router-dom';


const AlquilerTemporario = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Estado para las propiedades obtenidas de la API (sin filtrar por fecha/huéspedes aún)
    const [propiedadesRaw, setPropiedadesRaw] = useState([]);
    // Estado para los filtros aplicados
    const [filtros, setFiltros] = useState({
        precioMin: '',
        precioMax: '',
        banos: '',
        tipo: location.state?.tipoPropiedad || '',
        barrio: location.state?.barrio || '',
        checkIn: location.state?.checkIn || '', // Fecha de check-in
        checkOut: location.state?.checkOut || '', // Fecha de check-out
        adultos: location.state?.adultos || 1, // Número de adultos (para filtro local)
        niños: location.state?.menores || 0, // Para filtro local
        habitacionesFiltro: location.state?.habitaciones || 1, // Número de habitaciones (para filtro local)
    });

    const [searchTerm, setSearchTerm] = useState(''); // Para el input de texto de búsqueda de ubicación
    const [propiedadesFiltradas, setPropiedadesFiltradas] = useState([]); // Propiedades después de todos los filtros (API + local)
    const [propiedadSeleccionada, setPropiedadSeleccionada] = useState(null);
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [mostrarSelectorHuespedes, setMostrarSelectorHuespedes] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const mapContainerRef = useRef(null);

    // Función para obtener propiedades de la API
    // Esta función solo se encarga de los filtros que la API puede manejar
    const fetchPropiedades = useCallback(async (apiParams = {}) => {
        setLoading(true);
        setError(null);
        try {
            const query = new URLSearchParams();
            if (apiParams.barrio) query.append('barrio', apiParams.barrio);
            if (apiParams.precioMin) query.append('precioMin', apiParams.precioMin);
            if (apiParams.precioMax) query.append('precioMax', apiParams.precioMax);
            if (apiParams.habitacionesMin) query.append('habitacionesMin', apiParams.habitacionesMin);
            if (apiParams.tipoPropiedad) query.append('tipoPropiedad', apiParams.tipoPropiedad);

            const url = `${API_BASE_URL}/Propiedad/Buscar?${query.toString()}`;
            console.log('Fetching from URL:', url);

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
                    habitaciones: p.habitaciones,
                    banos: p.banos,
                    superficie: p.superficieM2,
                    tipo: p.tipoPropiedad,
                    coordenadas: { lat: p.latitud, lng: p.longitud },
                    favorito: false,
                    // Si tu API proporciona capacidad de huéspedes o disponibilidad, mapea esos campos aquí
                    capacidadHuespedes: p.capacidadHuespedes || p.habitaciones * 2, // Ejemplo: estimar capacidad
                    disponibilidad: p.disponibilidad || true // Ejemplo: si la API lo proporciona
                }));
                setPropiedadesRaw(mappedProperties); // Guarda las propiedades tal cual vienen de la API
            } else {
                setError(data.msg || 'Error al cargar las propiedades.');
                setPropiedadesRaw([]);
            }
        } catch (err) {
            console.error("Error fetching properties:", err);
            setError('No se pudieron cargar las propiedades. Intenta de nuevo más tarde.');
            setPropiedadesRaw([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Efecto para cargar propiedades al inicio y cuando los filtros de API cambian
    useEffect(() => {
        // Al montar el componente o cuando se aplican filtros desde la búsqueda principal/lateral que afectan la API
        const apiFilterParams = {
            barrio: filtros.barrio,
            precioMin: filtros.precioMin,
            precioMax: filtros.precioMax,
            habitacionesMin: filtros.habitaciones,
            tipoPropiedad: filtros.tipo,
        };
        fetchPropiedades(apiFilterParams);
    }, [fetchPropiedades, filtros.barrio, filtros.precioMin, filtros.precioMax, filtros.habitaciones, filtros.tipo]);


    // Función principal para aplicar todos los filtros (API + locales)
    const aplicarTodosLosFiltros = useCallback(() => {
        let currentFilteredProperties = [...propiedadesRaw]; // Partimos de las propiedades obtenidas de la API

        // --- Filtros Locales ---

        // 1. Filtrar por Check-in y Check-out (lógica simplificada, idealmente la API debería manejar esto)
        if (filtros.checkIn && filtros.checkOut) {
            const checkInDate = new Date(filtros.checkIn);
            const checkOutDate = new Date(filtros.checkOut);
            // Simplemente un ejemplo: si la propiedad tiene alguna lógica de disponibilidad, se aplicaría aquí.
            // Para una lógica de disponibilidad real, necesitarías datos de fechas reservadas en cada propiedad.
            // Por ahora, asumimos que todas están disponibles si no hay un sistema de reservas complejo.
            // currentFilteredProperties = currentFilteredProperties.filter(prop => {
            //   // Lógica para verificar disponibilidad de la propiedad entre checkInDate y checkOutDate
            //   // Esto es un placeholder; la implementación real es más compleja.
            //   return prop.disponibilidadParaRangoDeFechas(checkInDate, checkOutDate);
            // });
        }

        // 2. Filtrar por Huéspedes y Habitaciones (filtro local de capacidad)
        if (filtros.adultos > 0 || filtros.niños > 0) {
            const totalHuespedesDeseados = parseInt(filtros.adultos) + parseInt(filtros.niños);
            currentFilteredProperties = currentFilteredProperties.filter(prop => {
                // Suponemos que cada habitación puede alojar al menos 2 huéspedes para esta lógica,
                // o la propiedad tiene un campo 'capacidadHuespedes'.
                // También verificamos si la propiedad tiene al menos el número de habitaciones solicitado.
                return (prop.capacidadHuespedes >= totalHuespedesDeseados) &&
                       (prop.habitaciones >= filtros.habitacionesFiltro);
            });
        }
        
        // 3. Filtrar por Baños (esto debería ser manejado por la API si es posible para datasets grandes)
        if (filtros.banos) {
            currentFilteredProperties = currentFilteredProperties.filter(prop => 
                prop.banos >= parseInt(filtros.banos)
            );
        }

        setPropiedadesFiltradas(currentFilteredProperties);
    }, [propiedadesRaw, filtros]); // Dependencias para re-aplicar filtros locales


    // Re-aplicar filtros locales cada vez que `propiedadesRaw` o `filtros` cambian
    useEffect(() => {
        aplicarTodosLosFiltros();
    }, [propiedadesRaw, filtros, aplicarTodosLosFiltros]); // Incluimos aplicarTodosLosFiltros para evitar advertencias de eslint, aunque useCallback ya lo memoiza


    // Manejar cambios en los filtros del formulario principal y lateral
    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prevFiltros => ({
            ...prevFiltros,
            [name]: value
        }));
    };

    // Manejar búsqueda por ubicación desde el input principal
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleMainSearch = () => {
        // Actualiza el filtro de ubicación con el término de búsqueda
        setFiltros(prevFiltros => ({
            ...prevFiltros,
            barrio: searchTerm
        }));
        // El useEffect de `fetchPropiedades` se encargará de llamar a la API
        // y luego el useEffect de `aplicarTodosLosFiltros` se encargará de los filtros locales.
        setMostrarFiltros(false); // Ocultar filtros después de buscar
    };

    // Manejar tecla Enter en la búsqueda principal
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleMainSearch();
        }
    };

    // Obtener opciones únicas para filtros (se basan en las propiedades RAW obtenidas de la API)
    // Esto asegura que solo se puedan seleccionar ubicaciones que realmente existen en tus datos.
    const ubicacionesOptions = [...new Set(propiedadesRaw.map(p => p.barrio))].filter(Boolean);
    const tiposOptions = [...new Set(propiedadesRaw.map(p => p.tipo))].filter(Boolean);
    const habitacionesApiOptions = [...new Set(propiedadesRaw.map(p => p.habitaciones))].sort((a, b) => a - b).filter(Boolean);
    const banosApiOptions = [...new Set(propiedadesRaw.map(p => p.banos))].sort((a, b) => a - b).filter(Boolean);


    // Total de huéspedes para mostrar en el botón
    const totalHuespedesDisplay = parseInt(filtros.adultos) + parseInt(filtros.niños);

    // Aplicar selección de huéspedes (no llama a la API, solo actualiza el estado y los filtros locales se re-aplican)
    const handleAplicarHuespedes = () => {
        setMostrarSelectorHuespedes(false);
        // aplicarTodosLosFiltros ya se ejecutará gracias a la dependencia 'filtros' en su useEffect
    };

    // Inicializar el mapa
    useEffect(() => {
        if (!mapRef.current && mapContainerRef.current) {
            mapRef.current = L.map(mapContainerRef.current).setView([-34.603, -58.381], 12);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19
            }).addTo(mapRef.current);
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

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
            mapRef.current.setView([-34.603, -58.381], 12);
        }
    };

    // Actualizar marcadores cuando cambian las propiedades filtradas
    useEffect(() => {
        updateMapMarkers(propiedadesFiltradas);
    }, [propiedadesFiltradas, propiedadSeleccionada]);

    // Centrar el mapa en la propiedad seleccionada
    useEffect(() => {
        if (propiedadSeleccionada && mapRef.current) {
            if (propiedadSeleccionada.coordenadas && typeof propiedadSeleccionada.coordenadas.lat === 'number' && typeof propiedadSeleccionada.coordenadas.lng === 'number') {
                mapRef.current.setView([propiedadSeleccionada.coordenadas.lat, propiedadSeleccionada.coordenadas.lng], 14);
            }

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
                                    list="ubicaciones-datalist" // Conectar con el datalist
                                />
                                <datalist id="ubicaciones-datalist">
                                    {ubicacionesOptions.map(ubicacion => (
                                        <option key={ubicacion} value={ubicacion} />
                                    ))}
                                </datalist>
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
                                    {totalHuespedesDisplay} huéspedes, {filtros.habitacionesFiltro} habitaciones
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
                                                    {[...Array(10).keys()].map(num => (
                                                        <option key={num + 1} value={num + 1}>{num + 1} Habitación{num + 1 > 1 ? 'es' : ''}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="pt-2">
                                                <button
                                                    onClick={handleAplicarHuespedes}
                                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all shadow-sm hover:shadow"
                                                >
                                                    Aplicar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-6">
                            <button
                                onClick={handleMainSearch}
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
                                            {banosApiOptions.map(num => (
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
                                            {tiposOptions.map(tipo => (
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

                                <div className="pt-4 space-y-3">
                                    <button
                                        onClick={() => {
                                            // Cuando se aplican filtros desde el panel lateral,
                                            // el useEffect ya manejará la llamada a la API y el filtrado local.
                                            // Solo necesitamos cerrar el panel.
                                            setMostrarFiltros(false);
                                        }}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 className="mr-2 animate-spin" size={18} /> : null}
                                        Aplicar filtros
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