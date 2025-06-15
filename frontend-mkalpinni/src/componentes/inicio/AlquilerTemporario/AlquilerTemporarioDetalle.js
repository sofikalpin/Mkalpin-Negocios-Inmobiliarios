import React, { useState, useEffect } from 'react';
import Header from '../Componentes/Header';
import Footer from '../Componentes/Footer';
import { FaBed, FaBath, FaCar, FaRuler, FaTree, FaBuilding, FaSun, FaSnowflake, FaSwimmingPool, FaLock, FaMapMarkerAlt, FaWifi, FaTv, FaUtensils, FaCalendarAlt, FaCheck, FaTimes } from 'react-icons/fa';
import { API_BASE_URL } from '../../../config/apiConfig';
import { useParams } from 'react-router-dom'; // Importa useParams para obtener el ID de la URL
import axios from 'axios'; // Importa axios

const AlquilerTemporarioDetalle = () => {
  const { id } = useParams(); // Obtiene el ID de la propiedad desde la URL
  const [inmueble, setInmueble] = useState(null); // El estado para los datos del inmueble
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  const [mainImage, setMainImage] = useState(""); // Inicializa vacío, se llenará con la primera imagen
  const [activeTab, setActiveTab] = useState("caracteristicas");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    fechaIngreso: '',
    fechaSalida: '',
    cantidadPersonas: '',
    mensaje: ''
  });

  // Efecto para cargar los datos del inmueble al montar el componente o cambiar el ID
  useEffect(() => {
    const fetchInmueble = async () => {
      try {
        setLoading(true);
        setError(null);
        // Ajusta la URL de la API según tu configuración en apiConfig.js y tu controlador
        const response = await axios.get(`${API_BASE_URL}/Propiedad/ObtenerPorId/${id}`);
        if (response.data.status) {
          const fetchedInmueble = response.data.value;
          setInmueble({
            ...fetchedInmueble,
            // Asumiendo que las imágenes vienen como una lista de URLs en fetchedInmueble.Imagenes
            imagenes: fetchedInmueble.imagenes || [], // Asegúrate de que exista
            // Aquí puedes mapear tus datos reales a la estructura que ya tenías
            // Por ejemplo, si tienes 'MetrosCuadradosConstruidos' en el backend:
            caracteristicas: [
              { icon: <FaBuilding />, texto: `${fetchedInmueble.metrosCuadradosConstruidos || 'N/A'} m² construidos` },
              { icon: <FaTree />, texto: `${fetchedInmueble.metrosCuadradosTerreno || 'N/A'} m² de terreno` },
              { icon: <FaBed />, texto: `${fetchedInmueble.habitaciones || 'N/A'} Habitaciones` },
              { icon: <FaBath />, texto: `${fetchedInmueble.banos || 'N/A'} Baños` },
              { icon: <FaCar />, texto: `${fetchedInmueble.estacionamientos || 'N/A'} Estacionamientos` },
              { icon: <FaWifi />, texto: fetchedInmueble.tieneWifi ? "WiFi de alta velocidad" : "Sin WiFi" }
            ],
            especificaciones: [
              { icon: <FaUtensils />, texto: fetchedInmueble.cocinaEquipada ? "Cocina equipada" : "Cocina básica" },
              { icon: <FaTv />, texto: fetchedInmueble.tieneSmartTv ? "Smart TV" : "TV" },
              { icon: <FaSnowflake />, texto: fetchedInmueble.tieneAireAcondicionado ? "Aire acondicionado" : "Sin Aire Acondicionado" },
              { icon: <FaSwimmingPool />, texto: fetchedInmueble.tienePiscina ? "Piscina" : "Sin Piscina" },
              { icon: <FaLock />, texto: fetchedInmueble.seguridad24hs ? "Seguridad 24hs" : "Sin Seguridad 24hs" }
            ],
            disponibilidad: fetchedInmueble.disponibilidad || { minEstadia: 1, maxEstadia: 365, fechasOcupadas: [] }, // Asegúrate de que exista
            precio: `$${fetchedInmueble.precio} / semana` // Ajusta según cómo manejes el precio
          });
          setMainImage(fetchedInmueble.imagenes && fetchedInmueble.imagenes.length > 0 ? fetchedInmueble.imagenes[0] : "/api/placeholder/800/500");
        } else {
          setError(response.data.msg || "No se pudo cargar la propiedad.");
        }
      } catch (err) {
        setError("Error al conectar con el servidor o cargar la propiedad.");
        console.error("Error fetching inmueble:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInmueble();
    }
  }, [id]); // Dependencia del ID para recargar si cambia

  // Si aún está cargando
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-700">Cargando detalles de la propiedad...</p>
      </div>
    );
  }

  // Si hay un error
  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center text-center p-4">
        <p className="text-xl text-red-600 mb-4">{error}</p>
        <p className="text-gray-600">Por favor, intenta de nuevo más tarde o verifica la URL.</p>
        {/* Aquí podrías añadir un botón para volver a la lista o recargar */}
      </div>
    );
  }

  // Si no se encontró el inmueble (después de cargar y sin errores específicos, pero inmueble es null)
  if (!inmueble) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center text-center p-4">
        <p className="text-xl text-gray-700 mb-4">No se encontró la propiedad.</p>
        <p className="text-gray-600">Es posible que la propiedad que buscas no exista o haya sido eliminada.</p>
      </div>
    );
  }

  // Función para generar calendario (sin cambios)
  const generarCalendario = (mes, año) => {
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);
    const diasMes = ultimoDia.getDate();
    const diaSemanaInicio = primerDia.getDay(); // 0 = Domingo, 1 = Lunes, etc.
    
    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    
    let diasCalendario = [];
    
    for (let i = 0; i < diaSemanaInicio; i++) {
      diasCalendario.push(null);
    }
    
    for (let i = 1; i <= diasMes; i++) {
      diasCalendario.push(i);
    }
    
    return {
      diasSemana,
      diasCalendario
    };
  };
  
  // Función para verificar si una fecha está ocupada (sin cambios)
  const esFechaOcupada = (dia) => {
    if (!dia || !inmueble.disponibilidad || !inmueble.disponibilidad.fechasOcupadas) return false;
    
    const fecha = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    return inmueble.disponibilidad.fechasOcupadas.includes(fecha);
  };
  
  // Función para avanzar/retroceder mes (sin cambios)
  const cambiarMes = (incremento) => {
    let nuevoMes = selectedMonth + incremento;
    let nuevoAño = selectedYear;
    
    if (nuevoMes > 11) {
      nuevoMes = 0;
      nuevoAño++;
    } else if (nuevoMes < 0) {
      nuevoMes = 11;
      nuevoAño--;
    }
    
    setSelectedMonth(nuevoMes);
    setSelectedYear(nuevoAño);
  };
  
  const { diasSemana, diasCalendario } = generarCalendario(selectedMonth, selectedYear);
  
  const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const cambiarImagenPrincipal = (img) => {
    setMainImage(img);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);
    alert("¡Gracias por tu interés! Te contactaremos pronto para confirmar disponibilidad.");
    // Aquí podrías enviar estos datos a una nueva API de contacto/reserva
  };

  // Componente simple de mapa (sin cambios)
  const Mapa = ({ lat, lng }) => {
    return (
      <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden relative">
        <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
          <div className="text-center">
            <FaMapMarkerAlt className="text-red-600 text-4xl mb-2 mx-auto" />
            <p className="text-gray-700 font-medium">Ubicación de la propiedad</p>
            <p className="text-gray-600 text-sm">Lat: {lat}, Lng: {lng}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título y dirección */}
        <div className="text-center mb-10 mt-10">
          <h1 className="text-3xl font-bold text-gray-900">{inmueble.titulo}</h1>
          <p className="mt-2 text-gray-600">{inmueble.direccion}</p>
          <p className="mt-4 text-2xl font-semibold text-gray-900">{inmueble.precio}</p>
          <div className="mt-2 inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            Disponible para alquiler temporario
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Galería de imágenes */}
          <div>
            <img
              src={mainImage || "/api/placeholder/800/500"} // Fallback si no hay imagen principal
              alt="Imagen principal"
              className="w-full h-96 object-cover rounded-lg shadow-sm"
            />
            <div className="grid grid-cols-5 gap-2 mt-4">
              {inmueble.imagenes.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Vista ${index + 1}`}
                  className="w-full h-16 object-cover rounded-md cursor-pointer hover:opacity-75 transition duration-200"
                  onClick={() => cambiarImagenPrincipal(img)}
                />
              ))}
            </div>
          </div>

          {/* Detalles del inmueble */}
          <div>
            {/* Pestañas */}
            <div className="flex space-x-4 border-b border-gray-200 mb-6 overflow-x-auto">
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === "caracteristicas"
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-500 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("caracteristicas")}
              >
                Características
              </button>
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === "descripcion"
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-500 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("descripcion")}
              >
                Descripción
              </button>
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === "especificaciones"
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-500 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("especificaciones")}
              >
                Servicios
              </button>
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === "ubicacion"
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-500 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("ubicacion")}
              >
                Ubicación
              </button>
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === "disponibilidad"
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-500 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("disponibilidad")}
              >
                Disponibilidad
              </button>
            </div>

            {/* Contenido de las pestañas */}
            <div className="mt-4">
              {activeTab === "caracteristicas" && (
                <div className="grid grid-cols-2 gap-4">
                  {inmueble.caracteristicas.map((item, index) => (
                    <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="text-gray-700 text-xl mr-3">{item.icon}</span>
                      <span className="text-gray-700">{item.texto}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "descripcion" && (
                <div>
                  <p className="text-gray-700 leading-relaxed">{inmueble.descripcion}</p>
                  <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
                    <h4 className="font-medium text-yellow-800">Información importante</h4>
                    <ul className="mt-2 text-yellow-700 space-y-1 list-disc pl-5">
                      <li>Check-in: 15:00hs - Check-out: 11:00hs</li>
                      <li>No se permiten fiestas o eventos</li>
                      <li>No se permiten mascotas</li>
                      <li>Prohibido fumar dentro de la propiedad</li>
                      <li>Se solicita depósito de garantía reembolsable</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "especificaciones" && (
                <div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {inmueble.especificaciones.map((item, index) => (
                      <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                        <span className="text-gray-700 text-xl mr-3">{item.icon}</span>
                        <span className="text-gray-700">{item.texto}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-medium text-gray-900 mb-2">Servicios incluidos</h3>
                    <ul className="text-gray-700 space-y-2 pl-5 list-disc grid grid-cols-2">
                      <li>Limpieza inicial</li>
                      <li>Ropa de cama y toallas</li>
                      <li>WiFi de alta velocidad</li>
                      <li>TV por cable</li>
                      <li>Estacionamiento cubierto</li>
                      <li>Aire acondicionado</li>
                      <li>Servicio de conserjería</li>
                      <li>Kit de bienvenida</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "ubicacion" && (
                <div>
                  <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                    <h3 className="font-medium text-gray-900 mb-2">Ubicación de la propiedad</h3>
                    <p className="text-gray-700 mb-4">{inmueble.direccion}</p>
                    <Mapa lat={inmueble.coordenadas.lat} lng={inmueble.coordenadas.lng} />
                  </div>
                </div>
              )}

              {activeTab === "disponibilidad" && (
                <div>
                  <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                    <h3 className="font-medium text-gray-900 mb-4">Información de reserva</h3>
                    <div className="space-y-3">
                      <p className="flex justify-between"><span>Estadía mínima:</span> <span className="font-medium">{inmueble.disponibilidad.minEstadia} noches</span></p>
                      <p className="flex justify-between"><span>Estadía máxima:</span> <span className="font-medium">{inmueble.disponibilidad.maxEstadia} noches</span></p>
                      <p className="flex justify-between"><span>Hora de check-in:</span> <span className="font-medium">15:00hs</span></p>
                      <p className="flex justify-between"><span>Hora de check-out:</span> <span className="font-medium">11:00hs</span></p>
                    </div>
                  </div>
                  
                  {/* Calendario de disponibilidad */}
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900">Calendario de disponibilidad</h3>
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center text-sm"><span className="w-3 h-3 inline-block bg-green-100 border border-green-400 rounded-sm mr-1"></span> Disponible</span>
                        <span className="flex items-center text-sm"><span className="w-3 h-3 inline-block bg-red-100 border border-red-400 rounded-sm mr-1"></span> No disponible</span>
                      </div>
                    </div>
                    
                    <div className="mb-4 flex items-center justify-between">
                      <button 
                        onClick={() => cambiarMes(-1)} 
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <h4 className="text-gray-800 font-medium">
                        {nombresMeses[selectedMonth]} {selectedYear}
                      </h4>
                      <button 
                        onClick={() => cambiarMes(1)} 
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1">
                      {/* Días de la semana */}
                      {diasSemana.map((dia, index) => (
                        <div key={`dia-${index}`} className="text-center text-xs font-medium text-gray-500 py-1">
                          {dia}
                        </div>
                      ))}
                      
                      {/* Días del mes */}
                      {diasCalendario.map((dia, index) => (
                        <div 
                          key={`numero-${index}`} 
                          className={`text-center py-2 text-sm ${!dia ? '' : esFechaOcupada(dia) 
                            ? 'bg-red-100 text-red-800 rounded' 
                            : 'bg-green-100 text-green-800 rounded'}`}
                        >
                          {dia ? (
                            <span className="flex items-center justify-center">
                              {dia}
                              {esFechaOcupada(dia) ? (
                                <FaTimes className="ml-1 text-xs text-red-600" />
                              ) : (
                                <FaCheck className="ml-1 text-xs text-green-600" />
                              )}
                            </span>
                          ) : ''}
                        </div>
                      ))}
                    </div>
                    
                    <p className="mt-4 text-sm text-gray-600">
                      Las fechas en rojo ya están reservadas. Para consultar disponibilidad específica, por favor complete el formulario de contacto.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Formulario de contacto */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">¿Te interesa este alquiler temporario?</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  id="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
                  placeholder="Nombre completo"
                  required
                />
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
                  placeholder="Email"
                  required
                />
                <input
                  type="tel"
                  id="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
                  placeholder="Teléfono"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fechaIngreso" className="block text-sm text-gray-600 mb-1">Fecha de ingreso</label>
                    <input
                      type="date"
                      id="fechaIngreso"
                      value={formData.fechaIngreso}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
                    />
                  </div>
                  <div>
                    <label htmlFor="fechaSalida" className="block text-sm text-gray-600 mb-1">Fecha de salida</label>
                    <input
                      type="date"
                      id="fechaSalida"
                      value={formData.fechaSalida}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="cantidadPersonas" className="block text-sm text-gray-600 mb-1">Cantidad de personas</label>
                  <input
                    type="number"
                    id="cantidadPersonas"
                    value={formData.cantidadPersonas}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-900"
                    min="1"
                  />
                </div>
                <div>
                  <label htmlFor="mensaje" className="block text-sm text-gray-600 mb-1">Mensaje</label>
                  <textarea
                    id="mensaje"
                    value={formData.mensaje}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
                    placeholder="Me interesa alquilar esta propiedad..."
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-md transition duration-200"
                >
                  Consultar disponibilidad
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Inmuebles similares */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Otras Propiedades en Alquiler Temporario</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {inmueble.similares && inmueble.similares.map((similar, index) => ( // Asegúrate de que similares exista
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                <img src={similar.imagen} alt={similar.titulo} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{similar.titulo}</h3>
                  <p className="text-gray-600 text-sm mb-3">{similar.direccion}</p>
                  <p className="font-semibold text-gray-900 mb-3">{similar.precio}</p>
                  <div className="flex space-x-2 text-sm text-gray-700">
                    {similar.detalles.map((detalle, idx) => (
                      <span key={idx} className="bg-gray-100 px-3 py-1 rounded-full">{detalle}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AlquilerTemporarioDetalle;