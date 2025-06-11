import React, { useState, useEffect } from 'react';
import Header from '../Componentes/Header';
import Footer from '../Componentes/Footer';
import { FaBed, FaBath, FaCar, FaRuler, FaTree, FaBuilding, FaSun, FaSnowflake, FaSwimmingPool, FaLock, FaMapMarkerAlt } from 'react-icons/fa';
import { API_BASE_URL } from '../../../config/apiConfig';
import { useParams } from 'react-router-dom'; // Necesitarás react-router-dom para obtener el ID de la URL

const AlquilerDetalle = () => {
    // Usamos useParams para obtener el ID de la URL, por ejemplo, /alquiler/1
    const { id } = useParams(); 

    const [propiedad, setPropiedad] = useState(null); // Estado para almacenar los datos de la propiedad
    const [loading, setLoading] = useState(true); // Estado para indicar si la carga de datos está en progreso
    const [error, setError] = useState(null); // Estado para manejar errores de la API

    const [mainImage, setMainImage] = useState("/api/placeholder/800/500");
    const [activeTab, setActiveTab] = useState("caracteristicas");
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: ''
    });

    // useEffect para cargar la propiedad cuando el componente se monta o el ID cambia
    useEffect(() => {
        const fetchPropiedad = async () => {
            try {
                if (!id) {
                    setError("ID de propiedad no proporcionado en la URL.");
                    setLoading(false);
                    return;
                }
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/Propiedad/ObtenerPorId/${id}`);
                const data = await response.json();

                if (data.status) {
                    setPropiedad(data.value);
                    if (data.value && data.value.imagenes && data.value.imagenes.length > 0) {
                        setMainImage(data.value.imagenes[0].url); // Asume que PropiedadDTO tiene una lista de objetos con 'url'
                    }
                } else {
                    setError(data.msg || "Error al cargar la propiedad.");
                }
            } catch (err) {
                console.error("Error al obtener la propiedad:", err);
                setError("No se pudo conectar con el servidor o cargar la propiedad.");
            } finally {
                setLoading(false);
            }
        };

        fetchPropiedad();
    }, [id]); // El efecto se ejecuta cuando 'id' cambia

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Aquí podrías enviar el formulario de contacto a un nuevo endpoint en tu API si lo creas.
        // Por ahora, solo simulación.
        console.log("Formulario enviado:", formData);
        alert("¡Gracias por tu interés! Te contactaremos pronto.");
        // Opcional: podrías limpiar el formulario después de enviar
        setFormData({
            nombre: '',
            email: '',
            telefono: '',
            mensaje: ''
        });
    };

    // Componente simple de mapa
    const Mapa = ({ lat, lng }) => {
        return (
            <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden relative">
                <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                    <div className="text-center">
                        <FaMapMarkerAlt className="text-red-600 text-4xl mb-2 mx-auto" />
                        <p className="text-gray-700 font-medium">Ubicación de la propiedad</p>
                        <p className="text-gray-600 text-sm">Lat: {lat || 'N/A'}, Lng: {lng || 'N/A'}</p>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                <p className="text-lg text-gray-700">Cargando detalles de la propiedad...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                <p className="text-lg text-red-600">Error: {error}</p>
                <p className="text-md text-gray-500 mt-2">Por favor, intenta de nuevo más tarde.</p>
            </div>
        );
    }

    if (!propiedad) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                <p className="text-lg text-gray-700">No se encontró la propiedad.</p>
            </div>
        );
    }

    // Mapeo de PropiedadDTO a la estructura que el componente espera
    // Asegúrate de que tu PropiedadDTO en C# tenga las propiedades adecuadas
    // para los campos aquí, como Direccion, Precio, Descripcion, etc.
    const inmuebleDisplay = {
        titulo: propiedad.titulo || "Propiedad sin título",
        precio: `$${propiedad.precio?.toLocaleString('es-AR')}` || "Precio no disponible",
        direccion: propiedad.ubicacion || "Dirección no disponible",
        coordenadas: {
            lat: propiedad.latitud || null,
            lng: propiedad.longitud || null
        },
        descripcion: propiedad.descripcion || "No hay descripción disponible para esta propiedad.",
        caracteristicas: [
            { icon: <FaBuilding />, texto: `${propiedad.superficieM2 || 'N/A'} m² construidos` },
            { icon: <FaTree />, texto: `${propiedad.terrenoM2 || 'N/A'} m² de terreno` }, // Asume que tienes terrenoM2 en tu DTO
            { icon: <FaBed />, texto: `${propiedad.habitaciones || 'N/A'} Habitaciones` },
            { icon: <FaBath />, texto: `${propiedad.banos || 'N/A'} Baños` },
            { icon: <FaCar />, texto: `${propiedad.estacionamientos || 'N/A'} Estacionamientos` }, // Asume que tienes estacionamientos
            { icon: <FaRuler />, texto: propiedad.cocinaEquipada ? "Cocina equipada" : "Cocina no equipada" } // Asume cocinaEquipada
        ].filter(item => item.texto !== 'N/A m² construidos' || item.texto !== 'N/A m² de terreno' || item.texto !== 'N/A Habitaciones' || item.texto !== 'N/A Baños' || item.texto !== 'N/A Estacionamientos'), // Filtra características vacías
        especificaciones: [
            { icon: <FaBuilding />, texto: `Antigüedad: ${propiedad.antiguedad || 'N/A'} años` }, // Asume antiguedad
            { icon: <FaSun />, texto: `Orientación: ${propiedad.orientacion || 'N/A'}` }, // Asume orientacion
            { icon: <FaSnowflake />, texto: propiedad.aireAcondicionado ? "Aire acondicionado" : "No tiene A/C" }, // Asume aireAcondicionado
            { icon: <FaSwimmingPool />, texto: propiedad.piscina ? "Piscina" : "No tiene piscina" }, // Asume piscina
            { icon: <FaLock />, texto: propiedad.seguridad24hs ? "Seguridad 24hs" : "No tiene seguridad 24hs" } // Asume seguridad24hs
        ].filter(item => !item.texto.includes('N/A') && !item.texto.includes('No tiene')), // Filtra especificaciones vacías
        imagenes: propiedad.imagenes && propiedad.imagenes.length > 0 ? propiedad.imagenes.map(img => img.url) : ["/api/placeholder/800/500"], // Asume que imagenes es un array de objetos con `url`
        similares: [] // Podrías implementar una lógica para obtener propiedades similares de tu API
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Título y dirección */}
                <div className="text-center mb-10 mt-10">
                    <h1 className="text-3xl font-bold text-gray-900">{inmuebleDisplay.titulo}</h1>
                    <p className="mt-2 text-gray-600">{inmuebleDisplay.direccion}</p>
                    <p className="mt-4 text-2xl font-semibold text-gray-900">{inmuebleDisplay.precio}</p>
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
                            {inmuebleDisplay.imagenes.map((img, index) => (
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
                                className={`py-2 px-4 font-medium ${activeTab === "caracteristicas" ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-500 hover:text-gray-900"}`}
                                onClick={() => setActiveTab("caracteristicas")}
                            >
                                Características
                            </button>
                            <button
                                className={`py-2 px-4 font-medium ${activeTab === "descripcion" ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-500 hover:text-gray-900"}`}
                                onClick={() => setActiveTab("descripcion")}
                            >
                                Descripción
                            </button>
                            <button
                                className={`py-2 px-4 font-medium ${activeTab === "especificaciones" ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-500 hover:text-gray-900"}`}
                                onClick={() => setActiveTab("especificaciones")}
                            >
                                Detalles
                            </button>
                            <button
                                className={`py-2 px-4 font-medium ${activeTab === "ubicacion" ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-500 hover:text-gray-900"}`}
                                onClick={() => setActiveTab("ubicacion")}
                            >
                                Ubicación
                            </button>
                        </div>

                        {/* Contenido de las pestañas */}
                        <div className="mt-4">
                            {activeTab === "caracteristicas" && (
                                <div className="grid grid-cols-2 gap-4">
                                    {inmuebleDisplay.caracteristicas.map((item, index) => (
                                        <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                                            <span className="text-gray-700 text-xl mr-3">{item.icon}</span>
                                            <span className="text-gray-700">{item.texto}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === "descripcion" && (
                                <div>
                                    <p className="text-gray-700 leading-relaxed">{inmuebleDisplay.descripcion}</p>
                                </div>
                            )}

                            {activeTab === "especificaciones" && (
                                <div className="grid grid-cols-2 gap-4">
                                    {inmuebleDisplay.especificaciones.map((item, index) => (
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
                                        <p className="text-gray-700 mb-4">{inmuebleDisplay.direccion}</p>
                                        <Mapa lat={inmuebleDisplay.coordenadas.lat} lng={inmuebleDisplay.coordenadas.lng} />
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
                {inmuebleDisplay.similares.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Inmuebles Similares</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {inmuebleDisplay.similares.map((similar, index) => (
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
                )}
            </div>
            <Footer />
        </div>
    );
};

export default AlquilerDetalle;