import React, { useState } from 'react';
import Header from '../Componentes/Header';
import Footer from '../Componentes/Footer';
import { FaBed, FaBath, FaCar, FaRuler, FaTree, FaBuilding, FaSun, FaSnowflake, FaSwimmingPool, FaLock, FaMapMarkerAlt } from 'react-icons/fa';

const DetalleInmueble = () => {
  const [mainImage, setMainImage] = useState("/api/placeholder/800/500");
  const [activeTab, setActiveTab] = useState("caracteristicas");
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  });

  const inmueble = {
    titulo: "Casa Moderna en Barrio Exclusivo",
    precio: "$250,000",
    direccion: "Calle Principal 123, Ciudad, Provincia",
    coordenadas: {
      lat: -34.603722,
      lng: -58.381592
    },
    descripcion: "Hermosa propiedad en una de las zonas más exclusivas y seguras de la ciudad. Esta casa cuenta con excelentes acabados, amplios espacios y una ubicación privilegiada, a pocos minutos de centros comerciales, escuelas y parques. La propiedad ha sido recientemente renovada con materiales de primera calidad, ofreciendo comodidad y elegancia en cada detalle. Ideal para familias que buscan un hogar con estilo y confort.",
    caracteristicas: [
      { icon: <FaBuilding />, texto: "180 m² construidos" },
      { icon: <FaTree />, texto: "320 m² de terreno" },
      { icon: <FaBed />, texto: "3 Habitaciones" },
      { icon: <FaBath />, texto: "2.5 Baños" },
      { icon: <FaCar />, texto: "2 Estacionamientos" },
      { icon: <FaRuler />, texto: "Cocina equipada" }
    ],
    especificaciones: [
      { icon: <FaBuilding />, texto: "Antigüedad: 5 años" },
      { icon: <FaSun />, texto: "Orientación: Norte" },
      { icon: <FaSnowflake />, texto: "Aire acondicionado" },
      { icon: <FaSwimmingPool />, texto: "Piscina" },
      { icon: <FaLock />, texto: "Seguridad 24hs" }
    ],
    imagenes: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://plus.unsplash.com/premium_photo-1661962841993-99a07c27c9f4?q=80&w=1031&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ],
    similares: [
      {
        titulo: "Casa con Jardín",
        precio: "$230,000",
        direccion: "Av. Siempre Viva 742, Ciudad",
        imagen: "/api/placeholder/350/200",
        detalles: ["170 m²", "3 Hab.", "2 Baños"]
      },
      {
        titulo: "Chalet Moderno",
        precio: "$275,000",
        direccion: "Calle Secundaria 456, Ciudad",
        imagen: "/api/placeholder/350/200",
        detalles: ["200 m²", "4 Hab.", "3 Baños"]
      },
      {
        titulo: "Casa en Esquina",
        precio: "$245,000",
        direccion: "Av. Principal 789, Ciudad",
        imagen: "/api/placeholder/350/200",
        detalles: ["175 m²", "3 Hab.", "2.5 Baños"]
      }
    ]
  };

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
    alert("¡Gracias por tu interés! Te contactaremos pronto.");
  };

  // Componente simple de mapa
  const Mapa = ({ lat, lng }) => {
    return (
      <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden relative">
        {/* Aquí normalmente usarías un servicio de mapas como Google Maps, Mapbox, etc. */}
        {/* Por ahora, usaremos un placeholder con un marcador */}
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
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Galería de imágenes */}
          <div>
            <img
              src={mainImage}
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
                Detalles
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
                </div>
              )}

              {activeTab === "especificaciones" && (
                <div className="grid grid-cols-2 gap-4">
                  {inmueble.especificaciones.map((item, index) => (
                    <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="text-gray-700 text-xl mr-3">{item.icon}</span>
                      <span className="text-gray-700">{item.texto}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "ubicacion" && (
                <div>
                  <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                    <h3 className="font-medium text-gray-900 mb-2">Ubicación de la propiedad</h3>
                    <p className="text-gray-700 mb-4">{inmueble.direccion}</p>
                    <Mapa lat={inmueble.coordenadas.lat} lng={inmueble.coordenadas.lng} />
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-medium text-gray-900 mb-2">Puntos de interés cercanos</h3>
                    <ul className="text-gray-700 space-y-2 pl-5 list-disc">
                      <li>Centro comercial a 5 minutos</li>
                      <li>Escuelas y colegios a 10 minutos</li>
                      <li>Parque público a 8 minutos</li>
                      <li>Transporte público a 3 minutos</li>
                      <li>Supermercado a 5 minutos</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Formulario de contacto */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">¿Te interesa esta propiedad?</h3>
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
                <textarea
                  id="mensaje"
                  value={formData.mensaje}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
                  placeholder="Me interesa esta propiedad..."
                  required
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-md transition duration-200"
                >
                  Contactar ahora
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Inmuebles similares */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Inmuebles Similares</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {inmueble.similares.map((similar, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                <img src={similar.imagen} alt={similar.titulo} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{similar.titulo}</h3>
                  <p className="text-gray-600 text-sm mb-3">{similar.direccion}</p>
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

export default DetalleInmueble;