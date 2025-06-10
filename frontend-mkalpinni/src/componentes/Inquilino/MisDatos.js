import React, { useState, useEffect } from "react";
import Header from "../inicio/Componentes/Header";
import Footer from "../inicio/Componentes/Footer";

const MisDatos = () => {
  // Estado para almacenar los datos del usuario
  const [userData, setUserData] = useState({
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    phone: "+123456789",
    files: ["documento1.pdf", "imagen.png", "reporte.xlsx"],
    uploadTime: new Date().toISOString(), // Guardamos la fecha y hora de subida
  });

  // Estado para controlar si la edición está permitida
  const [isEditingAllowed, setIsEditingAllowed] = useState(true);

  // Estado para controlar si el usuario está editando
  const [isEditing, setIsEditing] = useState(false);

  // Función para verificar si han pasado más de 24 horas desde la subida
  const checkEditingTime = () => {
    const uploadTime = new Date(userData.uploadTime);
    const currentTime = new Date();
    const timeDifference = currentTime - uploadTime; // Diferencia en milisegundos
    const hoursDifference = timeDifference / (1000 * 60 * 60); // Convertir a horas

    // Si han pasado más de 24 horas, deshabilitar la edición
    if (hoursDifference > 24) {
      setIsEditingAllowed(false);
    }
  };

  // Verificar el tiempo de edición al cargar el componente
  useEffect(() => {
    checkEditingTime();
  }, []);

  // Función para manejar cambios en los campos editables
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Función para guardar los cambios
  const handleSave = () => {
    setIsEditing(false); // Desactiva el modo de edición
    // Aquí podrías enviar los datos actualizados a una API
    console.log("Datos guardados:", userData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header userRole="cliente" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Mis Datos
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Tarjeta de Información Personal */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Información Personal
              </h2>
              {isEditingAllowed && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  {isEditing ? "Cancelar" : "Editar"}
                </button>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 font-medium">Nombre:</span>
                {isEditing && isEditingAllowed ? (
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleInputChange}
                    className="border rounded-md p-2 flex-1"
                  />
                ) : (
                  <span className="text-gray-800">{userData.name}</span>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 font-medium">Email:</span>
                {isEditing && isEditingAllowed ? (
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    className="border rounded-md p-2 flex-1"
                  />
                ) : (
                  <span className="text-gray-800">{userData.email}</span>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 font-medium">Teléfono:</span>
                {isEditing && isEditingAllowed ? (
                  <input
                    type="text"
                    name="phone"
                    value={userData.phone}
                    onChange={handleInputChange}
                    className="border rounded-md p-2 flex-1"
                  />
                ) : (
                  <span className="text-gray-800">{userData.phone}</span>
                )}
              </div>
              {isEditing && isEditingAllowed && (
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  Guardar Cambios
                </button>
              )}
            </div>
          </div>

          {/* Tarjeta de Archivos Subidos */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
              Archivos Subidos
            </h2>
            <ul className="space-y-4">
              {userData.files.map((file, index) => (
                <li
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
                >
                  <span className="text-gray-700">{file}</span>
                  <button className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                    Descargar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mensaje de tiempo restante para editar */}
        {isEditingAllowed && (
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Puedes editar tus datos durante las primeras 24 horas después de la
              subida.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MisDatos;