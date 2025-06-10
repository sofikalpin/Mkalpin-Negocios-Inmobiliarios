import React, { useState } from 'react';
import Header from '../../inicio/Componentes/Header';

// Mock data for clients - you would fetch this from your API
const mockClients = [
  {
    id: 1,
    nombreApellido: 'Juan Pérez',
    dni: '30123456',
    telefono: '11-1234-5678',
    email: 'juan@example.com',
    domicilio: 'Av. Rivadavia 1234, CABA',
    rol: 'Locatario',
    tipoAlquiler: 'Alquiler Temporario',
    fechaNacimiento: '1985-05-15',
    nacionalidad: 'Argentina',
    estadoCivil: 'Casado',
    profesion: 'Ingeniero',
    empresa: 'Tech Solutions',
    ingresosMensuales: '250000',
    cuitCuil: '20-30123456-7',
    imageUrl: '/api/placeholder/320/320'
  },
  {
    id: 2,
    nombreApellido: 'María González',
    dni: '28765432',
    telefono: '11-8765-4321',
    email: 'maria@example.com',
    domicilio: 'Corrientes 5678, CABA',
    rol: 'Locador',
    tipoAlquiler: 'Alquiler',
    fechaNacimiento: '1982-09-22',
    nacionalidad: 'Argentina',
    estadoCivil: 'Soltera',
    profesion: 'Abogada',
    empresa: 'Estudio Jurídico González',
    ingresosMensuales: '300000',
    cuitCuil: '27-28765432-4',
    imageUrl: '/api/placeholder/320/320'
  },
  {
    id: 3,
    nombreApellido: 'Carlos Rodríguez',
    dni: '25987654',
    telefono: '11-4567-8901',
    email: 'carlos@example.com',
    domicilio: 'Santa Fe 910, CABA',
    rol: 'Locatario',
    tipoAlquiler: 'Alquiler',
    fechaNacimiento: '1979-03-10',
    nacionalidad: 'Argentina',
    estadoCivil: 'Divorciado',
    profesion: 'Contador',
    empresa: 'Banco Nacional',
    ingresosMensuales: '280000',
    cuitCuil: '20-25987654-5',
    imageUrl: '/api/placeholder/320/320'
  },
  {
    id: 4,
    nombreApellido: 'Laura Méndez',
    dni: '32456789',
    telefono: '11-2345-6789',
    email: 'laura@example.com',
    domicilio: 'Callao 1234, CABA',
    rol: 'Propietario',
    fechaNacimiento: '1987-11-25',
    nacionalidad: 'Argentina',
    estadoCivil: 'Casada',
    profesion: 'Arquitecta',
    empresa: 'Estudio Méndez',
    ingresosMensuales: '320000',
    cuitCuil: '27-32456789-8',
    imageUrl: '/api/placeholder/320/320'
  },
  {
    id: 5,
    nombreApellido: 'Roberto Gómez',
    dni: '27345678',
    telefono: '11-3456-7890',
    email: 'roberto@example.com',
    domicilio: 'Belgrano 567, CABA',
    rol: 'Comprador',
    fechaNacimiento: '1983-07-14',
    nacionalidad: 'Argentina',
    estadoCivil: 'Soltero',
    profesion: 'Médico',
    empresa: 'Hospital Central',
    ingresosMensuales: '350000',
    cuitCuil: '20-27345678-9',
    imageUrl: '/api/placeholder/320/320'
  }
];

const RegistroClienteForm = ({ rolSeleccionado, tipoAlquiler, clienteData, onSave }) => {
  const [formData, setFormData] = useState(clienteData || {
    nombreApellido: '',
    dni: '',
    fechaNacimiento: '',
    nacionalidad: '',
    estadoCivil: '',
    telefono: '',
    email: '',
    domicilio: '',
    profesion: '',
    empresa: '',
    ingresosMensuales: '',
    reciboSueldo: null,
    cuitCuil: '',
    tienePropiedad: false,
    rol: rolSeleccionado || '',
    tipoAlquiler: tipoAlquiler || ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : 
              type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
    // Here you would send data to server
    if (onSave) onSave(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <Header userRole="admin" />
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {clienteData ? 'Detalles del Cliente' : 'Registro de Cliente'}
        </h2>
        <div className="flex space-x-2">
          <div className="bg-green-100 text-green-800 py-1 px-4 rounded-full font-medium">
            Rol: {formData.rol || "No seleccionado"}
          </div>
          {formData.tipoAlquiler && (
            <div className="bg-blue-100 text-blue-800 py-1 px-4 rounded-full font-medium">
              Tipo: {formData.tipoAlquiler}
            </div>
          )}
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Datos Personales */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Datos Personales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="nombreApellido">
                Nombre y Apellido *
              </label>
              <input
                type="text"
                id="nombreApellido"
                name="nombreApellido"
                value={formData.nombreApellido}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                readOnly={clienteData !== null}
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="dni">
                DNI o Documento de Identidad *
              </label>
              <input
                type="text"
                id="dni"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                readOnly={clienteData !== null}
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="fechaNacimiento">
                Fecha de Nacimiento *
              </label>
              <input
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                readOnly={clienteData !== null}
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="nacionalidad">
                Nacionalidad *
              </label>
              <input
                type="text"
                id="nacionalidad"
                name="nacionalidad"
                value={formData.nacionalidad}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                readOnly={clienteData !== null}
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="estadoCivil">
                Estado Civil *
              </label>
              <select
                id="estadoCivil"
                name="estadoCivil"
                value={formData.estadoCivil}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                disabled={clienteData !== null}
              >
                <option value="">Seleccionar...</option>
                <option value="Soltero">Soltero/a</option>
                <option value="Casado">Casado/a</option>
                <option value="Divorciado">Divorciado/a</option>
                <option value="Viudo">Viudo/a</option>
                <option value="Unión Civil">Unión Civil</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2" htmlFor="rol">
                Rol *
              </label>
              <select
                id="rol"
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                disabled={clienteData !== null}
              >
                <option value="">Seleccionar...</option>
                <option value="Locador">Locador</option>
                <option value="Locatario">Locatario</option>
                <option value="Propietario">Propietario</option>
                <option value="Comprador">Comprador</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Datos de Contacto */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Datos de Contacto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="telefono">
                Teléfono *
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                readOnly={clienteData !== null}
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Correo Electrónico *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                readOnly={clienteData !== null}
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2" htmlFor="domicilio">
                Domicilio Real *
              </label>
              <input
                type="text"
                id="domicilio"
                name="domicilio"
                value={formData.domicilio}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                readOnly={clienteData !== null}
              />
            </div>
          </div>
        </div>
        
        {/* Información Laboral y Financiera */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Información Laboral y Financiera 
            <span className="text-sm font-normal text-gray-500 ml-2">
              (especialmente para alquileres o compras a crédito)
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="profesion">
                Profesión u Ocupación
              </label>
              <input
                type="text"
                id="profesion"
                name="profesion"
                value={formData.profesion}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                readOnly={clienteData !== null}
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="empresa">
                Nombre de la Empresa
              </label>
              <input
                type="text"
                id="empresa"
                name="empresa"
                value={formData.empresa}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                readOnly={clienteData !== null}
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="ingresosMensuales">
                Ingresos Mensuales
              </label>
              <input
                type="number"
                id="ingresosMensuales"
                name="ingresosMensuales"
                value={formData.ingresosMensuales}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                readOnly={clienteData !== null}
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="cuitCuil">
                CUIT/CUIL
              </label>
              <input
                type="text"
                id="cuitCuil"
                name="cuitCuil"
                value={formData.cuitCuil}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                readOnly={clienteData !== null}
              />
            </div>
            
            {!clienteData && (
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2" htmlFor="reciboSueldo">
                  Recibo de Sueldo o Constancia de Ingresos
                </label>
                <input
                  type="file"
                  id="reciboSueldo"
                  name="reciboSueldo"
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Propiedad */}
        {!clienteData && (
          <div className="mb-8">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="tienePropiedad"
                name="tienePropiedad"
                checked={formData.tienePropiedad}
                onChange={handleChange}
                className="mr-2 h-5 w-5 text-green-500 focus:ring-green-500"
              />
              <label className="text-gray-700" htmlFor="tienePropiedad">
                ¿Ya tiene una propiedad registrada?
              </label>
            </div>
            
            {!formData.tienePropiedad && (
              <div className="mt-4 flex justify-start">
                <button
                  type="button"
                  className="flex items-center bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-full transition-colors duration-300"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Agregar Propiedad
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Botones de acción */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-6 rounded-full transition-colors duration-300"
            onClick={() => window.history.back()}
          >
            {clienteData ? 'Volver' : 'Cancelar'}
          </button>
          {!clienteData && (
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-full transition-colors duration-300"
            >
              Guardar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

// Generic component for displaying client tiles - works for all roles
const ClientesTilesView = ({ rolSeleccionado, tipoAlquiler, onSelect, onBack, onNewClient }) => {
  // Filter clients by role and rental type if applicable
  const filteredClients = mockClients.filter(client => {
    if (rolSeleccionado === 'Propietario' || rolSeleccionado === 'Comprador') {
      return client.rol === rolSeleccionado;
    } else {
      return (client.rol === rolSeleccionado) && (client.tipoAlquiler === tipoAlquiler);
    }
  });

  return (
    <div className="p-8">
      <button 
        className="mb-6 flex items-center text-green-600 hover:text-green-800 font-medium"
        onClick={onBack}
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        Volver
      </button>
      
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Clientes</h2>
            <p className="text-gray-600">
              {rolSeleccionado === 'Propietario' || rolSeleccionado === 'Comprador' 
                ? rolSeleccionado 
                : `${tipoAlquiler} - ${rolSeleccionado}`
              }
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 text-green-800 py-1 px-4 rounded-full font-medium">
              Rol: {rolSeleccionado}
            </div>
            {(rolSeleccionado === 'Locador' || rolSeleccionado === 'Locatario') && (
              <div className="bg-blue-100 text-blue-800 py-1 px-4 rounded-full font-medium">
                Tipo: {tipoAlquiler}
              </div>
            )}
            <button 
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-full transition-colors duration-300 flex items-center"
              onClick={onNewClient}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Nuevo Cliente
            </button>
          </div>
        </div>
        
        {filteredClients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <div 
                key={client.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => onSelect(client)}
              >
                <div className="flex p-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={client.imageUrl}
                      alt={client.nombreApellido}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-grow">
                    <h3 className="text-xl font-bold text-gray-800">{client.nombreApellido}</h3>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">DNI:</span> {client.dni}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Teléfono:</span> {client.telefono}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Email:</span> {client.email}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        <span className="font-medium">Domicilio:</span> {client.domicilio}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 flex justify-end">
                  <button className="text-green-600 hover:text-green-800 font-medium">
                    Ver detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">No hay clientes registrados para este rol.</p>
            <button 
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-full transition-colors duration-300"
              onClick={onNewClient}
            >
              Registrar Nuevo Cliente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const TipoAlquilerOptions = ({ rolSeleccionado, onSelect, onBack }) => {
  // Definimos las opciones de alquiler
  const options = [
    { title: "Alquiler Temporario", imageUrl: "/api/placeholder/320/320" },
    { title: "Alquiler", imageUrl: "/api/placeholder/320/320" }
  ];

  // Filtramos las opciones si el rol no es "Locador" o "Locatario"
  const filteredOptions = (rolSeleccionado === "Locador" || rolSeleccionado === "Locatario") 
    ? options 
    : [];

  return (
    <div className="p-8">
      <button 
        className="mb-6 flex items-center text-green-600 hover:text-green-800 font-medium"
        onClick={onBack}
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        Volver
      </button>
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Seleccione el tipo de alquiler</h2>
          <div className="bg-green-100 text-green-800 py-1 px-4 rounded-full font-medium">
            Rol: {rolSeleccionado}
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center w-64 bg-white rounded-lg shadow-md p-6 m-2 cursor-pointer"
                onClick={() => onSelect(option.title)}
              >
                <div className="w-32 h-32 rounded-full overflow-hidden mb-6">
                  <img
                    src={option.imageUrl}
                    alt={option.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{option.title}</h3>
                <button 
                  className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-full transition-colors duration-300"
                >
                  Seleccionar
                </button>
              </div>
            ))
          ) : (
            <div className="text-center w-full">
              <p className="text-gray-600 mb-6">Este rol no requiere selección de tipo de alquiler.</p>
              <button 
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-full transition-colors duration-300"
                onClick={() => onSelect(null)}
              >
                Continuar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RegistroCliente = () => {
  const [view, setView] = useState('main'); // 'main', 'tipoAlquiler', 'clientesTiles', 'form', 'clienteDetail'
  const [rolSeleccionado, setRolSeleccionado] = useState('');
  const [tipoAlquiler, setTipoAlquiler] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  
  const badgeTypes = [
    { title: "Locador", count: 2, imageUrl: "/api/placeholder/320/320" },
    { title: "Locatario", count: 3, imageUrl: "/api/placeholder/320/320" },
    { title: "Propietario", count: 1, imageUrl: "/api/placeholder/320/320" },
    { title: "Comprador", count: 0, imageUrl: "/api/placeholder/320/320" }
  ];
  
  const InmoBadge = ({ title, count = 0, imageUrl }) => {
    return (
      <div className="flex flex-col items-center w-64 bg-white rounded-lg shadow-md p-6 m-2 cursor-pointer">
        {/* Circle with Image */}
        <div className="w-32 h-32 rounded-full overflow-hidden mb-6">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Info below image */}
        <h3 className="text-xl font-bold text-gray-800 mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{count} Registros</p>
        
        {/* Button */}
        <button 
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-full transition-colors duration-300"
          onClick={() => {
            setRolSeleccionado(title);
            if (title === 'Propietario' || title === 'Comprador') {
              // Go directly to client tiles for Propietario and Comprador
              setTipoAlquiler(null);
              setView('clientesTiles');
            } else {
              // For Locador and Locatario, go to tipo alquiler selection
              setView('tipoAlquiler');
            }
          }}
        >
          Ver detalles
        </button>
      </div>
    );
  };
  const renderView = () => {
    switch(view) {
      case 'main':
        return (
          <div className="flex flex-col items-center p-8">
            <div className="w-full max-w-6xl flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Clientes</h1>
              <button 
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-full transition-colors duration-300 flex items-center"
                onClick={() => setView('form')}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Registrar
              </button>
            </div>
            
            <div className="flex flex-wrap justify-center items-center">
              {badgeTypes.map((badge, index) => (
                <InmoBadge
                  key={index}
                  title={badge.title}
                  count={badge.count}
                  imageUrl={badge.imageUrl}
                />
              ))}
            </div>
          </div>
        );
      
      case 'tipoAlquiler':
        return (
          <TipoAlquilerOptions 
            rolSeleccionado={rolSeleccionado}
            onSelect={(tipo) => {
              setTipoAlquiler(tipo);
              setView('clientesTiles'); // Changed to show tiles view instead of form
            }}
            onBack={() => setView('main')}
          />
        );
      
      case 'clientesTiles':
        return (
          <ClientesTilesView
            rolSeleccionado={rolSeleccionado}
            tipoAlquiler={tipoAlquiler}
            onSelect={(client) => {
              setSelectedClient(client);
              // Here you could navigate to client details view
              console.log('Cliente seleccionado:', client);
            }}
            onBack={() => setView('tipoAlquiler')}
            onNewClient={() => {
              setSelectedClient(null);
              setView('form');
            }}
          />
        );
      
      case 'form':
        return (
          <div className="p-8">
            <button 
              className="mb-6 flex items-center text-green-600 hover:text-green-800 font-medium"
              onClick={() => {
                if (tipoAlquiler) {
                  setView('clientesTiles');
                } else {
                  setView('main');
                }
              }}
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Volver
            </button>
            <RegistroClienteForm 
              rolSeleccionado={rolSeleccionado} 
              tipoAlquiler={tipoAlquiler}
            />
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-gray-100 min-h-screen">
      {renderView()}
    </div>
  );
};

export default RegistroCliente;