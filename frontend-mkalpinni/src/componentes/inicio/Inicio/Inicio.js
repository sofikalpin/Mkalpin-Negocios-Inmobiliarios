import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FaHome, FaBuilding, FaUsers, FaCalendarAlt, FaChartBar, FaCog, FaSignOutAlt, FaPlus, FaSearch, FaTh, FaList, FaFilter, FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaTag, FaEdit, FaTrash, FaEye, FaCheck, FaMoneyBillWave, FaTimes, FaDownload, FaSave, FaUser, FaRuler, FaSun, FaCalendarAlt as FaCalendar } from "react-icons/fa";
import { Search, Home, MapPin, ChevronRight, ChevronLeft, User, Heart, ChevronDown } from 'lucide-react';
import Header from '../Componentes/Header';
import Footer from '../Componentes/Footer';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import imagen1 from './pexels-asphotograpy-101808.jpg';
import imagen2 from './pexels-sofia-falco-1148410914-32506369.jpg';
import imagen3 from './pexels-vividcafe-681333.jpg';
import HomeSearch from './HomeSearch';
import { propertyService } from '../../../services/api';
import { API_STATIC_URL } from '../../../config/apiConfig';



const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const hasAcceptedCookies = localStorage.getItem('cookiesAccepted');
    if (!hasAcceptedCookies) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex justify-between items-center z-50">
      <div className="flex-1">
        <p className="text-sm">
          Utilizamos cookies para mejorar tu experiencia en nuestro sitio web.
          Al continuar navegando, aceptas nuestro uso de cookies.
        </p>
      </div>
      <button
        onClick={handleAcceptCookies}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
      >
        Aceptar
      </button>
    </div>
  );
};

const InmobiliariaLanding = () => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const navigate = useNavigate(); // Inicializar useNavigate
  const [propertyType, setPropertyType] = useState(''); // Estado para el tipo de propiedad

  const officeCoordinates = [-34.603387, -58.375253];

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: '',
  });

  // Estados que ahora controlarán HomeSearch
  const [activeTab, setActiveTab] = useState('venta');
  const [searchTerm, setSearchTerm] = useState('');
  const [guestsInfo, setGuestsInfo] = useState({
    adults: 1,
    children: 0,
    rooms: 1,
  });
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Función de manejo de búsqueda que se pasará a HomeSearch
  const handleSearch = () => {
    // Validar campos requeridos
    if (!searchTerm.trim()) {
      alert('Por favor ingresa una ubicación para buscar');
      return;
    }

    // Validar fechas para alquiler temporario
    if (activeTab === 'alquilerTemp') {
      if (!checkInDate || !checkOutDate) {
        alert('Por favor selecciona las fechas de check-in y check-out');
        return;
      }
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkIn < today) {
        alert('La fecha de check-in no puede ser anterior a hoy');
        return;
      }
      if (checkOut <= checkIn) {
        alert('La fecha de check-out debe ser posterior al check-in');
        return;
      }
    }

    let path = '';
    const queryParams = new URLSearchParams();

    // El término de búsqueda siempre se envía como 'ubicacion'
    queryParams.append('ubicacion', searchTerm.trim());

    // Determinamos la ruta y el tipo de transacción según la pestaña activa
    switch (activeTab) {
      case 'venta':
        path = '/venta';
        queryParams.append('transaccionTipo', 'Venta');
        break;
      case 'alquiler':
        path = '/alquiler';
        queryParams.append('transaccionTipo', 'Alquiler');
        break;
      case 'alquilerTemp':
        path = '/alquilerTemporario';
        queryParams.append('transaccionTipo', 'Alquiler Temporario');
        // Agregamos los filtros de fechas y huéspedes solo para alquiler temporario
        if (checkInDate) queryParams.append('checkIn', checkInDate);
        if (checkOutDate) queryParams.append('checkOut', checkOutDate);
        if (guestsInfo.adults) queryParams.append('adultos', guestsInfo.adults.toString());
        if (guestsInfo.children) queryParams.append('ninos', guestsInfo.children.toString());
        if (guestsInfo.rooms) queryParams.append('habitacionesFiltro', guestsInfo.rooms.toString());
        break;
      default:
        path = '/venta';
        queryParams.append('transaccionTipo', 'Venta');
    }

    // Navegamos a la ruta con los parámetros de consulta
    const finalUrl = `${path}?${queryParams.toString()}`;
    navigate(finalUrl);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Gracias por tu mensaje. Nos pondremos en contacto contigo pronto.");
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      asunto: '',
      mensaje: '',
    });
  };

  const carouselImages = [
    {
      url: imagen1,
      caption: "Encuentra tu hogar ideal",
      description: "Propiedades exclusivas en las mejores ubicaciones"
    },
    {
      url: imagen2,
      caption: "Viviendas diseñadas para ti",
      description: "Descubre espacios que se adaptan a tu estilo de vida"
    },
    {
      url: imagen3,
      caption: "Invierte en tu futuro",
      description: "Oportunidades únicas de inversión inmobiliaria"
    },
  ];

  const carouselItems = carouselImages.map(item => ({ ...item, type: 'image' }));

  const [currentSlide, setCurrentSlide] = useState(0);

  // Cargar propiedades desde la API
  useEffect(() => {
    const fetchPropiedades = async () => {
      try {
        setIsLoadingProperties(true);
        const response = await propertyService.getAll();
        
        if (response.status && response.value) {
          // Tomar solo las primeras 4 propiedades para mostrar como destacadas
          const propiedades = response.value.slice(0, 4).map(prop => ({
            id: prop._id,
            titulo: prop.titulo,
            precio: prop.precio ? `$${prop.precio.toLocaleString('es-AR')}` : 'Precio a consultar',
            imagen: prop.imagenes && prop.imagenes.length > 0 
              ? `${API_STATIC_URL}/uploads/${prop.imagenes[0].rutaArchivo}`
              : "https://cdn.prod.website-files.com/61e9b342b016364181c41f50/62a014dd84797690c528f25e_38.jpg",
            ubicacion: `${prop.ubicacion || ''}${prop.localidad ? `, ${prop.localidad}` : ''}${prop.provincia ? `, ${prop.provincia}` : ''}`,
            caracteristicas: { 
              dormitorios: prop.habitaciones || 0, 
              banos: prop.banos || 0, 
              superficie: `${prop.superficieM2 || 0}m²` 
            },
          }));
          setPropiedadesDestacadas(propiedades);
        } else {
          setPropertiesError('No se pudieron cargar las propiedades');
        }
      } catch (err) {
        console.error('Error cargando propiedades:', err);
        setPropertiesError('Error al cargar las propiedades');
      } finally {
        setIsLoadingProperties(false);
      }
    };

    fetchPropiedades();
  }, []);

  const [currentProperty, setCurrentProperty] = useState(0);
  const [isHoveringProperties, setIsHoveringProperties] = useState(false);
  const [propiedadesDestacadas, setPropiedadesDestacadas] = useState([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);
  const [propertiesError, setPropertiesError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1));
    }, 15000);

    return () => clearTimeout(timer);
  }, [currentSlide, carouselItems.length]);

  useEffect(() => {
    let interval;
    if (!isHoveringProperties) {
      interval = setInterval(() => {
        setCurrentProperty((prev) => (prev === propiedadesDestacadas.length - 1 ? 0 : prev + 1));
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isHoveringProperties, propiedadesDestacadas.length]);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current).setView(officeCoordinates, 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      L.marker(officeCoordinates)
        .addTo(map)
        .bindPopup('Nuestra Oficina Central: Florida 142, oficina: 8° i (Edificio Boston)')
        .openPopup();

      mapRef.current = map;
    }
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [officeCoordinates]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? carouselItems.length - 1 : prev - 1));
  };

  const nextProperty = () => {
    setCurrentProperty((prev) => (prev === propiedadesDestacadas.length - 1 ? 0 : prev + 1));
  };

  const prevProperty = () => {
    setCurrentProperty((prev) => (prev === 0 ? propiedadesDestacadas.length - 1 : prev - 1));
  };

  const goToProperty = (index) => {
    setCurrentProperty(index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CookieBanner />
      <Header />

      <div className="relative h-[600px] overflow-hidden">
        {carouselItems.map((item, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            {item.type === 'youtube' ? (
              <iframe
                src={item.url}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full object-cover"
                title={item.caption}
              ></iframe>
            ) : (
              <img
                src={item.url}
                alt={item.caption}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col items-center justify-center text-white">
              <div className="max-w-4xl px-6 text-center">
                <h1 className="text-5xl font-bold mb-6 leading-tight">{item.caption}</h1>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/40 transition-all duration-300 transform hover:scale-110"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/40 transition-all duration-300 transform hover:scale-110"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-blue-600 w-8'
                  : 'bg-white/60 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Aquí pasamos los props a HomeSearch */}
      <HomeSearch
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        guestsInfo={guestsInfo}
        setGuestsInfo={setGuestsInfo}
        checkInDate={checkInDate}
        setCheckInDate={setCheckInDate}
        checkOutDate={checkOutDate}
        setCheckOutDate={setCheckOutDate}
        handleSearch={handleSearch} // Pasamos la función de búsqueda
        propertyType={propertyType} // Pasamos el tipo de propiedad
        setPropertyType={setPropertyType} // Pasamos la función para actualizar el tipo de propiedad
      />

      <div className="py-20 bg-gray-50">
        <div className="max-full mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Propiedades Destacadas</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Descubre nuestras propiedades más exclusivas seleccionadas especialmente para ti
            </p>
          </div>

          {/* Estado de carga de propiedades */}
          {isLoadingProperties && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Cargando propiedades...</p>
            </div>
          )}
          
          {/* Estado de error de propiedades */}
          {propertiesError && (
            <div className="text-center py-20">
              <p className="text-red-600 mb-4">{propertiesError}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
              >
                Reintentar
              </button>
            </div>
          )}
          
          {/* Propiedades cargadas */}
          {!isLoadingProperties && !propertiesError && propiedadesDestacadas.length > 0 && (
            <div
              className="relative w-full"
              onMouseEnter={() => setIsHoveringProperties(true)}
              onMouseLeave={() => setIsHoveringProperties(false)}
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mx-4">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${currentProperty * 100}%)` }}
                >
                  {propiedadesDestacadas.map((propiedad) => (
                  <div key={propiedad.id} className="w-full flex-shrink-0">
                    <div className="flex flex-col lg:flex-row">
                      <div className="relative lg:w-1/2">
                        <img
                          src={propiedad.imagen}
                          alt={propiedad.titulo}
                          className="w-full h-96 lg:h-116 object-cover"
                        />
                        <div className="absolute top-4 right-4">
                          <button
                            className="bg-white/80 hover:bg-white p-2 rounded-full backdrop-blur-sm transition-all"
                            aria-label="Add to favorites"
                          >
                            <Heart className="h-5 w-5 text-red-500" />
                          </button>
                        </div>
                        <div className="absolute bottom-4 left-4">
                          <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium text-xl">
                            {propiedad.precio}
                          </span>
                        </div>
                      </div>

                      <div className="p-8 lg:w-1/2 flex flex-col justify-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{propiedad.titulo}</h3>
                        <p className="text-gray-600 mb-6 flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          {propiedad.ubicacion}
                        </p>

                        <div className="grid grid-cols-3 gap-6 mb-8">
                          <div className="text-center">
                            <span className="block text-xl font-semibold text-gray-800">{propiedad.caracteristicas.dormitorios}</span>
                            <span className="text-sm text-gray-500">Dorm.</span>
                          </div>
                          <div className="text-center">
                            <span className="block text-xl font-semibold text-gray-800">{propiedad.caracteristicas.banos}</span>
                            <span className="text-sm text-gray-500">Baños</span>
                          </div>
                          <div className="text-center">
                            <span className="block text-xl font-semibold text-gray-800">{propiedad.caracteristicas.superficie}</span>
                            <span className="text-sm text-gray-500">Área</span>
                          </div>
                        </div>

                        <button className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300">
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={prevProperty}
              className="absolute top-1/2 -translate-y-1/2 -left-5 bg-white shadow-lg p-3 rounded-full hover:bg-gray-100 transition-all duration-300 z-10"
              aria-label="Previous property"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
            <button
              onClick={nextProperty}
              className="absolute top-1/2 -translate-y-1/2 -right-5 bg-white shadow-lg p-3 rounded-full hover:bg-gray-100 transition-all duration-300 z-10"
              aria-label="Next property"
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>

            <div className="flex justify-center mt-8 space-x-2">
              {propiedadesDestacadas.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToProperty(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentProperty
                      ? 'bg-blue-600 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to property ${index + 1}`}
                />
              ))}
            </div>
          </div>
          )}
          
          {/* Mensaje cuando no hay propiedades */}
          {!isLoadingProperties && !propertiesError && propiedadesDestacadas.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-600">No hay propiedades disponibles en este momento.</p>
            </div>
          )}
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative rounded-xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-[1.02]">
              <img
                src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Sobre Nosotros"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                  Sobre Nosotros
                </span>
              </h2>
              <div className="w-24 h-1 bg-blue-600 rounded-full"></div>
              <p className="text-lg text-gray-600">
                En **Mkalpin Negocios Inmobiliarios**, nos especializamos en ofrecer soluciones inmobiliarias integrales
                tanto para clientes particulares como inversores. Con más de 8 años de experiencia en el mercado,
                nos hemos consolidado como líderes en el sector, gracias a nuestro compromiso con la excelencia
                y la satisfacción de nuestros clientes.
              </p>
              <p className="text-lg text-gray-600">
                Nuestro equipo de profesionales altamente capacitado está dedicado a brindarte un servicio
                personalizado, adaptado a tus necesidades específicas. Ya sea que estés buscando comprar, vender,
                alquilar o invertir en propiedades, estamos aquí para guiarte en cada paso del proceso.
              </p>
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Home className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">+5,000</h4>
                    <p className="text-gray-600">Propiedades gestionadas</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">+10,000</h4>
                    <p className="text-gray-600">Clientes satisfechos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contacto" className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              <span className="bg-clip-text text-transparent bg-blue-600">
                Contáctanos
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Estamos aquí para responder tus preguntas y ayudarte en lo que necesites
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2 flex flex-col">
              <div
                ref={mapContainerRef}
                className="h-96 rounded-xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                aria-label="Google Maps showing office location"
              >
              </div>

              <div className="mt-8 bg-white p-8 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3">Información</h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-gray-900">Dirección</h4>
                      <p className="text-gray-600 mt-1">Florida 142, oficina: 8° i (Edificio Boston), Ciudad Autónoma de Buenos Aires</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-gray-900">Teléfono</h4>
                      <p className="text-gray-600 mt-1">(011) 5669-0002</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-1">
                      <h4 className="text-lg font-semibold text-gray-900">Email</h4>
                      <p className="text-gray-600 mt-1">mkalpinni@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 bg-white p-8 md:p-12 rounded-xl shadow-xl">
              <h3 className="text-3xl font-bold text-gray-900 mb-16">Envíanos un mensaje</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="nombre" className="block text-xl font-medium text-gray-700 mb-1">Nombre completo</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                      placeholder="Tu nombre"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xl font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="telefono" className="block text-xl font-medium text-gray-700 mb-1">Telefono</label>
                  <input
                    type="text"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                    placeholder="(011) 123456789"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="asunto" className="block text-xl font-medium text-gray-700 mb-1">Asunto</label>
                  <input
                    type="text"
                    id="asunto"
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                    placeholder="Asunto de tu mensaje"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="mensaje" className="block text-xl font-medium text-gray-700 mb-1">Mensaje</label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                    placeholder="¿En qué podemos ayudarte?"
                    required
                  ></textarea>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-8 py-4 bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-xl"
                  >
                    Enviar mensaje
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default InmobiliariaLanding;