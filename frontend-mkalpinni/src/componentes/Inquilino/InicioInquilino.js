import { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Heart } from "lucide-react";
import Header from "../inicio/Componentes/Header";
import Footer from "../inicio/Componentes/Footer";

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

export default function Propiedades() {
  const [currentProperty, setCurrentProperty] = useState(0);

  const prevProperty = () => {
    setCurrentProperty((prev) => (prev === 0 ? propiedadesDestacadas.length - 1 : prev - 1));
  };

  const nextProperty = () => {
    setCurrentProperty((prev) => (prev === propiedadesDestacadas.length - 1 ? 0 : prev + 1));
  };

  return (
    <div>
      <Header userRole="cliente" />
      <div className="text-center py-40 bg-blue-100 ">
        
        <h1 className="text-3xl font-bold text-gray-800">Bienvenido/a Maria Jose</h1>
        <p className="text-lg text-gray-600 mt-2">Estamos agradecidos de que alquile con MKalpin Negocios Inmobiliarios</p>
      </div>
      
      <div className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Propiedades Destacadas</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Aquí encuentra otro de nuestros inmuebles destacados en alquiler o venta
            </p>
          </div>
          
          <div className="relative w-full">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mx-4">
              <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentProperty * 100}%)` }}>
                {propiedadesDestacadas.map((propiedad) => (
                  <div key={propiedad.id} className="w-full flex-shrink-0">
                    <div className="flex flex-col lg:flex-row">
                      <div className="relative lg:w-1/2">
                        <img src={propiedad.imagen} alt={propiedad.titulo} className="w-full h-96 lg:h-116 object-cover" />
                        <div className="absolute bottom-4 left-4">
                          <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium text-xl">
                            {propiedad.precio}
                          </span>
                        </div>
                      </div>
                      <div className="p-8 lg:w-1/2 flex flex-col justify-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{propiedad.titulo}</h3>
                        <p className="text-gray-600 mb-6 flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" /> {propiedad.ubicacion}
                        </p>
                        <a href="#" className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300">
                          Ver Detalles
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button onClick={prevProperty} className="absolute top-1/2 -translate-y-1/2 -left-5 bg-white shadow-lg p-3 rounded-full hover:bg-gray-100 transition-all duration-300 z-10">
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
            <button onClick={nextProperty} className="absolute top-1/2 -translate-y-1/2 -right-5 bg-white shadow-lg p-3 rounded-full hover:bg-gray-100 transition-all duration-300 z-10">
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
