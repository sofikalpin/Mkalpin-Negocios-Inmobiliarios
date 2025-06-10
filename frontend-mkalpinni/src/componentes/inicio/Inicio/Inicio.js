import React, { useState, useEffect, useRef } from 'react';
import { Search, Home, MapPin, ChevronRight, ChevronLeft, User, Heart, ChevronDown } from 'lucide-react';
import Header from '../Componentes/Header';
import Footer from '../Componentes/Footer';
import video1 from "../video1.mp4";
import video2 from "../video2.mp4";
import video3 from "../video3.mp4";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Componente del Banner de Cookies
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

// Componente principal de la página
const InmobiliariaLanding = () => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const officeCoordinates = [-34.6062866, -58.3752128];

  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: '',
  });

  // Estado para las pestañas de operación
  const [activeTab, setActiveTab] = useState('venta');

  // Estado para el dropdown de huéspedes
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
  const [guestsInfo, setGuestsInfo] = useState({
    adults: 1,
    children: 0,
    rooms: 1,
  });

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Manejar cambios en el dropdown de huéspedes
  const handleGuestChange = (type, value) => {
    setGuestsInfo({
      ...guestsInfo,
      [type]: value,
    });
  };

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);
    alert("Gracias por tu mensaje. Nos pondremos en contacto contigo pronto.");
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      asunto: '',
      mensaje: '',
    });
  };

  // Carrusel de videos
  const carouselVideos = [
    { url: video1, caption: "Encuentra tu hogar ideal" },
    { url: video2, caption: "Propiedades exclusivas para ti" },
    { url: video3, caption: "Tu inversión segura en bienes raíces" },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRefs = useRef([]);

  // Propiedades destacadas
  const propiedadesDestacadas = [
    {
      id: 1,
      titulo: "Departamento de lujo en Palermo",
      precio: "$250,000",
      imagen: "https://cdn.prod.website-files.com/61e9b342b016364181c41f50/62a014dd84797690c528f25e_38.jpg",
      ubicacion: "Palermo, Buenos Aires",
      caracteristicas: { dormitorios: 3, banos: 2, superficie: "120m²" },
    },
    {
      id: 2,
      titulo: "Casa con jardín en Almagro",
      precio: "$320,000",
      imagen: "https://interioristica.com/wp-content/uploads/2023/08/diseno-de-interiores-casas-pequenas.jpg",
      ubicacion: "Almagro, Buenos Aires",
      caracteristicas: { dormitorios: 4, banos: 3, superficie: "180m²" },
    },
    {
      id: 3,
      titulo: "Ático moderno en Recoleta",
      precio: "$420,000",
      imagen: "https://interioristica.com/wp-content/uploads/2023/08/diseno-de-interiores-casas.jpg",
      ubicacion: "Recoleta, Buenos Aires",
      caracteristicas: { dormitorios: 2, banos: 2, superficie: "95m²" },
    },
    {
      id: 4,
      titulo: "Loft en San Telmo",
      precio: "$180,000",
      imagen: "https://st1.uvnimg.com/dims4/default/c60f8f8/2147483647/thumbnail/1024x576%3E/quality/75/?url=https%3A%2F%2Fuvn-brightspot.s3.amazonaws.com%2Fassets%2Fvixes%2Fimj%2Fhogartotal%2Ff%2Ffotos-de-interiores.jpg",
      ubicacion: "San Telmo, Buenos Aires",
      caracteristicas: { dormitorios: 1, banos: 1, superficie: "75m²" },
    },
  ];

  const [currentProperty, setCurrentProperty] = useState(0);
  const [isHoveringProperties, setIsHoveringProperties] = useState(false);

  // Efectos para el carrusel de videos y propiedades
  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, carouselVideos.length);
  }, [carouselVideos.length]);

  useEffect(() => {
    videoRefs.current.forEach((videoRef) => {
      if (videoRef) {
        videoRef.pause();
        videoRef.currentTime = 0;
      }
    });

    if (videoRefs.current[currentSlide]) {
      const playPromise = videoRefs.current[currentSlide].play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Auto-play was prevented:", error);
        });
      }
    }

    const handleVideoEnd = () => {
      setCurrentSlide((prev) => (prev === carouselVideos.length - 1 ? 0 : prev + 1));
    };

    const currentVideo = videoRefs.current[currentSlide];
    if (currentVideo) {
      currentVideo.addEventListener('ended', handleVideoEnd);
      return () => {
        currentVideo.removeEventListener('ended', handleVideoEnd);
      };
    }
  }, [currentSlide, carouselVideos.length]);

  useEffect(() => {
    let interval;
    if (!isHoveringProperties) {
      interval = setInterval(() => {
        setCurrentProperty((prev) => (prev === propiedadesDestacadas.length - 1 ? 0 : prev + 1));
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isHoveringProperties, propiedadesDestacadas.length]);

  // Funciones para navegar en el carrusel
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === carouselVideos.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? carouselVideos.length - 1 : prev - 1));
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

      {/* Sección del carrusel de videos */}
      <div className="relative h-[600px] overflow-hidden">
        {carouselVideos.map((video, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <video 
              ref={el => videoRefs.current[index] = el}
              src={video.url}
              className="w-full h-full object-cover"
              muted
              playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col items-center justify-center text-white">
              <div className="max-w-4xl px-6 text-center">
                <h1 className="text-5xl font-bold mb-6 leading-tight">{video.caption}</h1>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg transition duration-300 text-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Explorar propiedades
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Flechas de navegación */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/40 transition-all duration-300 transform hover:scale-110"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/40 transition-all duration-300 transform hover:scale-110"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>
        
        {/* Indicadores */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
          {carouselVideos.map((_, index) => (
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

      {/* Sección de búsqueda */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          {/* Pestañas de operación */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => setActiveTab('venta')}
              className={`px-6 py-3 rounded-lg text-lg font-medium transition-all duration-300 ${
                activeTab === 'venta'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Venta
            </button>
            <button
              onClick={() => setActiveTab('alquiler')}
              className={`px-6 py-3 rounded-lg text-lg font-medium transition-all duration-300 ${
                activeTab === 'alquiler'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Alquiler
            </button>
            <button
              onClick={() => setActiveTab('alquilerTemp')}
              className={`px-6 py-3 rounded-lg text-lg font-medium transition-all duration-300 ${
                activeTab === 'alquilerTemp'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Alquiler Temporario
            </button>
          </div>

          {/* Campos de búsqueda */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {activeTab === 'alquilerTemp' ? (
              // Campos específicos para Alquiler Temporario
              <>
                {/* ¿Adónde vas? */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">¿Adónde vas?</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      className="pl-10 pr-3 py-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg" 
                      placeholder="Ingresa un destino"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Check-in */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">Check-in</label>
                  <input 
                    type="date" 
                    className="pl-3 pr-3 py-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  />
                </div>

                {/* Check-out */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">Check-out</label>
                  <input 
                    type="date" 
                    className="pl-3 pr-3 py-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  />
                </div>

                {/* Huéspedes y habitaciones - Dropdown */}
                <div className="relative">
                  <label className="block text-lg font-medium text-gray-700 mb-2">Huéspedes</label>
                  <button 
                    type="button"
                    className="flex justify-between items-center pl-3 pr-3 py-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    onClick={() => setShowGuestsDropdown(!showGuestsDropdown)}
                  >
                    <span>{guestsInfo.adults + guestsInfo.children} huéspedes, {guestsInfo.rooms} habitaciones</span>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </button>
                  
                  {/* Dropdown para seleccionar huéspedes */}
                  {showGuestsDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4">
                      <div className="space-y-4">
                        {/* Adultos */}
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Adultos</p>
                            <p className="text-sm text-gray-500">Desde 13 años</p>
                          </div>
                          <div className="flex items-center">
                            <button 
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                              onClick={() => handleGuestChange('adults', Math.max(1, guestsInfo.adults - 1))}
                            >-</button>
                            <span className="mx-3">{guestsInfo.adults}</span>
                            <button 
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                              onClick={() => handleGuestChange('adults', guestsInfo.adults + 1)}
                            >+</button>
                          </div>
                        </div>
                        
                        {/* Niños */}
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Niños</p>
                            <p className="text-sm text-gray-500">De 0 a 12 años</p>
                          </div>
                          <div className="flex items-center">
                            <button 
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                              onClick={() => handleGuestChange('children', Math.max(0, guestsInfo.children - 1))}
                            >-</button>
                            <span className="mx-3">{guestsInfo.children}</span>
                            <button 
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                              onClick={() => handleGuestChange('children', guestsInfo.children + 1)}
                            >+</button>
                          </div>
                        </div>
                        
                        {/* Habitaciones */}
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Habitaciones</p>
                          </div>
                          <div className="flex items-center">
                            <button 
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                              onClick={() => handleGuestChange('rooms', Math.max(1, guestsInfo.rooms - 1))}
                            >-</button>
                            <span className="mx-3">{guestsInfo.rooms}</span>
                            <button 
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                              onClick={() => handleGuestChange('rooms', guestsInfo.rooms + 1)}
                            >+</button>
                          </div>
                        </div>
                        
                        <button 
                          className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-lg"
                          onClick={() => setShowGuestsDropdown(false)}
                        >
                          Aplicar
                        </button>
                      </div>
                      
                    </div>
                    
                  )}
                </div>
                {/* Botón de búsqueda */}
  {/* Botón de búsqueda */}
  <div className="flex items-end ">
                  <button className="w-full px-6 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center text-xl">
                    <Search className="h-5 w-5 mr-2" />
                    Buscar
                  </button>
                
  </div>
              </>
            ) : (
              <>
                {/* Ubicación */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">Ubicación</label>
                  <div className="relative">
                    <select className="pl-3 pr-10 py-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg appearance-none">
                      <option>Cualquier ubicación</option>
                      <option>Palermo</option>
                      <option>Recoleta</option>
                      <option>Almagro</option>
                      <option>San Telmo</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <ChevronDown className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                {/* Tipo de propiedad */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">Tipo de propiedad</label>
                  <div className="relative">
                    <select className="pl-3 pr-10 py-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg appearance-none">
                      <option>Cualquier tipo</option>
                      <option>Casa</option>
                      <option>Departamento</option>
                      <option>Dúplex</option>
                      <option>Oficina</option>
                      <option>Edificio</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <ChevronDown className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                {/* Dormitorios */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">Dormitorios</label>
                  <div className="relative">
                    <select className="pl-3 pr-10 py-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg appearance-none">
                      <option>Cualquier cantidad</option>
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <ChevronDown className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                {/* Botón de búsqueda */}
                <div className="flex items-end">
                  <button className="w-full px-6 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center text-xl">
                    <Search className="h-5 w-5 mr-2" />
                    Buscar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sección de Propiedades Destacadas */}
      <div className="py-20 bg-gray-50">
        <div className="max-full mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Propiedades Destacadas</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Descubre nuestras propiedades más exclusivas seleccionadas especialmente para ti
            </p>
          </div>

          {/* Carrusel de propiedades destacadas */}
          <div 
            className="relative w-full"
            onMouseEnter={() => setIsHoveringProperties(true)}
            onMouseLeave={() => setIsHoveringProperties(false)}
          >
            {/* Card container con fondo blanco y sombra */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mx-4">
              <div 
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentProperty * 100}%)` }}
              >
                {propiedadesDestacadas.map((propiedad) => (
                  <div key={propiedad.id} className="w-full flex-shrink-0">
                    <div className="flex flex-col lg:flex-row">
                      {/* Imagen de la propiedad */}
                      <div className="relative lg:w-1/2">
                        <img 
                          src={propiedad.imagen} 
                          alt={propiedad.titulo} 
                          className="w-full h-96 lg:h-116 object-cover"
                        />
                        <div className="absolute top-4 right-4">
                          <button className="bg-white/80 hover:bg-white p-2 rounded-full backdrop-blur-sm transition-all">
                            <Heart className="h-5 w-5 text-red-500" />
                          </button>
                        </div>
                        <div className="absolute bottom-4 left-4">
                          <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium text-xl">
                            {propiedad.precio}
                          </span>
                        </div>
                      </div>
                      
                      {/* Detalles de la propiedad */}
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
                        
                        <a href="#" className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300">
                          Ver Detalles
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Flechas de navegación */}
            <button 
              onClick={prevProperty}
              className="absolute top-1/2 -translate-y-1/2 -left-5 bg-white shadow-lg p-3 rounded-full hover:bg-gray-100 transition-all duration-300 z-10"
              aria-label="Anterior propiedad"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
            <button 
              onClick={nextProperty}
              className="absolute top-1/2 -translate-y-1/2 -right-5 bg-white shadow-lg p-3 rounded-full hover:bg-gray-100 transition-all duration-300 z-10"
              aria-label="Siguiente propiedad"
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>

            {/* Indicadores de posición */}
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
                  aria-label={`Ir a propiedad ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sección Sobre Nosotros */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Imagen */}
            <div className="relative rounded-xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-[1.02]">
              <img 
                src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Sobre Nosotros" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
            </div>

            {/* Contenido */}
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                  Sobre Nosotros
                </span>
              </h2>
              <div className="w-24 h-1 bg-blue-600 rounded-full"></div>
              <p className="text-lg text-gray-600">
                En <strong>Mkalpin Negocios Inmobiliarios</strong>, nos especializamos en ofrecer soluciones inmobiliarias integrales 
                tanto para clientes particulares como inversores. Con más de 8 años de experiencia en el mercado, 
                nos hemos consolidado como líderes en el sector, gracias a nuestro compromiso con la excelencia 
                y la satisfacción de nuestros clientes.
              </p>
              <p className="text-lg text-gray-600">
                Nuestro equipo de profesionales altamente capacitados está dedicado a brindarte un servicio 
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

      {/* Sección de Contacto con Mapa y Formulario */}
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
            {/* Mapa */}
            <div className="lg:col-span-2 flex flex-col">
              <div
                ref={mapContainerRef}
                className="h-96 rounded-xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
              >
                {/* El mapa se renderizará aquí */}
              </div>

              {/* Información de contacto */}
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

            {/* Formulario */}
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default InmobiliariaLanding;