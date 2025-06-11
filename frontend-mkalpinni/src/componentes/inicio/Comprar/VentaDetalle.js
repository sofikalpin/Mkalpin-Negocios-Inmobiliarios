import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Importa useParams
import Header from '../Componentes/Header';
import Footer from '../Componentes/Footer';
import { FaBed, FaBath, FaCar, FaRuler, FaTree, FaBuilding, FaSun, FaSnowflake, FaSwimmingPool, FaLock, FaMapMarkerAlt } from 'react-icons/fa';
import { API_BASE_URL } from '../../../config/apiConfig';

const DetalleInmueble = () => {
    const { id } = useParams(); // Obtener el ID de la URL
    const [inmueble, setInmueble] = useState(null); // Estado para los datos de la propiedad
    const [loading, setLoading] = useState(true); // Estado de carga
    const [error, setError] = useState(null); // Estado de error
    const [mainImage, setMainImage] = useState("/api/placeholder/800/500");
    const [activeTab, setActiveTab] = useState("caracteristicas");
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: ''
    });

    // useEffect para cargar los datos de la propiedad
    useEffect(() => {
        const fetchInmueble = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/Propiedad/ObtenerPorId/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                
                // Asegúrate de que data.value exista y sea un objeto
                if (data.status && data.value) {
                    setInmueble(data.value);
                    // Establecer la primera imagen como principal al cargar la propiedad
                    // Usamos 'imagenes' con 'i' minúscula si la API devuelve camelCase
                    if (data.value.imagenes && data.value.imagenes.length > 0) {
                        setMainImage(data.value.imagenes[0]);
                    } else {
                        setMainImage("/api/placeholder/800/500"); // Imagen por defecto si no hay
                    }
                } else {
                    setError(data.msg || "No se pudo cargar la propiedad.");
                }
            } catch (err) {
                setError("Hubo un problema al conectar con el servidor: " + err.message);
                console.error("Error fetching inmueble:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchInmueble();
        }
    }, [id]); // Dependencia: el efecto se ejecuta cuando cambia el ID

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
        // Verifica si lat y lng son valores numéricos válidos antes de mostrar
        if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
            return <p className="text-gray-500">Ubicación no disponible o inválida.</p>;
        }
        return (
            <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden relative">
                <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                    <div className="text-center">
                        <FaMapMarkerAlt className="text-red-600 text-4xl mb-2 mx-auto" />
                        <p className="text-gray-700 font-medium">Ubicación de la propiedad</p>
                        <p className="text-gray-600 text-sm">Lat: {lat.toFixed(6)}, Lng: {lng.toFixed(6)}</p>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                <p className="text-gray-700 text-lg">Cargando detalles de la propiedad...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                <p className="text-red-500 text-lg">Error: {error}</p>
            </div>
        );
    }

    // Si no hay inmueble después de la carga y sin error, indica que no se encontró
    if (!inmueble) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                <p className="text-gray-700 text-lg">No se encontró la propiedad con el ID {id}.</p>
            </div>
        );
    }

    // Mapeo de características y especificaciones de la API a los iconos existentes
    // ¡Asegúrate de que los nombres de las propiedades en tu DTO de C# coincidan con esto
    // Si la API devuelve camelCase, entonces 'superficieM2' en lugar de 'SuperficieM2'!
    const getCaracteristicasDisplay = (inmueble) => [
        { icon: <FaBuilding />, texto: inmueble.superficieM2 ? `${inmueble.superficieM2} m² construidos` : null },
        { icon: <FaTree />, texto: inmueble.terrenoM2 ? `${inmueble.terrenoM2} m² de terreno` : null },
        { icon: <FaBed />, texto: inmueble.numeroHabitaciones ? `${inmueble.numeroHabitaciones} Habitaciones` : null },
        { icon: <FaBath />, texto: inmueble.numeroBanios ? `${inmueble.numeroBanios} Baños` : null },
        { icon: <FaCar />, texto: inmueble.estacionamientos ? `${inmueble.estacionamientos} Estacionamientos` : (inmueble.estacionamientos === 0 ? 'Sin estacionamiento' : null) },
        { icon: <FaRuler />, texto: inmueble.cocinaEquipada !== undefined && inmueble.cocinaEquipada !== null ? (inmueble.cocinaEquipada ? "Cocina equipada" : "Cocina no equipada") : null }
    ].filter(item => item.texto !== null); // Filtra los elementos que son null

    const getEspecificacionesDisplay = (inmueble) => [
        { icon: <FaBuilding />, texto: inmueble.antiguedad ? `Antigüedad: ${inmueble.antiguedad} años` : null },
        { icon: <FaSun />, texto: inmueble.orientacion ? `Orientación: ${inmueble.orientacion}` : null },
        { icon: <FaSnowflake />, texto: inmueble.aireAcondicionado !== undefined && inmueble.aireAcondicionado !== null ? (inmueble.aireAcondicionado ? "Aire acondicionado" : "Sin aire acondicionado") : null },
        { icon: <FaSwimmingPool />, texto: inmueble.piscina !== undefined && inmueble.piscina !== null ? (inmueble.piscina ? "Piscina" : "Sin piscina") : null },
        { icon: <FaLock />, texto: inmueble.seguridad24hs !== undefined && inmueble.seguridad24hs !== null ? (inmueble.seguridad24hs ? "Seguridad 24hs" : "Sin seguridad") : null }
    ].filter(item => item.texto !== null); // Filtra los elementos que son null


    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Título y dirección */}
                <div className="text-center mb-10 mt-10">
                    <h1 className="text-3xl font-bold text-gray-900">{inmueble.titulo || 'Título no disponible'}</h1>
                    <p className="mt-2 text-gray-600">{inmueble.ubicacion || 'Dirección no disponible'}</p>
                    <p className="mt-4 text-2xl font-semibold text-gray-900">${inmueble.precio?.toLocaleString('es-AR') || 'Precio no disponible'}</p>
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
                        {/* Usamos 'imagenes' con 'i' minúscula */}
                        <div className="grid grid-cols-5 gap-2 mt-4">
                            {inmueble.imagenes?.map((img, index) => (
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
                                    {getCaracteristicasDisplay(inmueble).map((item, index) => (
                                        <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                                            <span className="text-gray-700 text-xl mr-3">{item.icon}</span>
                                            <span className="text-gray-700">{item.texto}</span>
                                        </div>
                                    ))}
                                    {getCaracteristicasDisplay(inmueble).length === 0 && (
                                        <p className="text-gray-500 col-span-2">No hay características disponibles.</p>
                                    )}
                                </div>
                            )}

                            {activeTab === "descripcion" && (
                                <div>
                                    <p className="text-gray-700 leading-relaxed">{inmueble.descripcion || 'No hay descripción disponible para esta propiedad.'}</p>
                                </div>
                            )}

                            {activeTab === "especificaciones" && (
                                <div className="grid grid-cols-2 gap-4">
                                    {getEspecificacionesDisplay(inmueble).map((item, index) => (
                                        <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                                            <span className="text-gray-700 text-xl mr-3">{item.icon}</span>
                                            <span className="text-gray-700">{item.texto}</span>
                                        </div>
                                    ))}
                                     {getEspecificacionesDisplay(inmueble).length === 0 && (
                                        <p className="text-gray-500 col-span-2">No hay detalles o especificaciones disponibles.</p>
                                    )}
                                </div>
                            )}

                            {activeTab === "ubicacion" && (
                                <div>
                                    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                                        <h3 className="font-medium text-gray-900 mb-2">Ubicación de la propiedad</h3>
                                        <p className="text-gray-700 mb-4">{inmueble.ubicacion|| 'Dirección no disponible.'}</p>
                                        {/* Usamos 'latitud' y 'longitud' con 'l' minúscula */}
                                        <Mapa lat={inmueble.latitud} lng={inmueble.longitud} />
                                    </div>
                                    {/* Puntos de interés cercanos podrían venir de la API o ser un dato estático */}
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

                        {/* Formulario de contacto (con los ajustes de estilo solicitados previamente) */}
                        <div className="mt-8 bg-white p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">¿Te interesa esta propiedad?</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    id="nombre"
                                    value={formData.nombre}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 placeholder-gray-500"
                                    placeholder="Nombre completo"
                                    required
                                />
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 placeholder-gray-500"
                                    placeholder="Email"
                                    required
                                />
                                <input
                                    type="tel"
                                    id="telefono"
                                    value={formData.telefono}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 placeholder-gray-500"
                                    placeholder="Teléfono"
                                />
                                <textarea
                                    id="mensaje"
                                    value={formData.mensaje}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 placeholder-gray-500"
                                    placeholder="Me interesa esta propiedad..."
                                    required
                                ></textarea>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-3 rounded-md transition duration-200"
                                >
                                    Contactar ahora
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    );
};

export default DetalleInmueble;