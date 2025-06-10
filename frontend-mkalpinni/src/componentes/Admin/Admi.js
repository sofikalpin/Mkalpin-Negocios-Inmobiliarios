import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../inicio/Componentes/Header';
import Footer from '../inicio/Componentes/Footer';


// Componente para mostrar las tarjetas de estadísticas
const StatCard = ({ icon, title, values }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${icon.bgColor}`}>
        {icon.svg}
      </div>
      <div className="ml-4">
        <h2 className="font-semibold text-gray-600">{title}</h2>
        <div className="flex space-x-2 text-sm">
          {values.map((value, index) => (
            <React.Fragment key={index}>
              <span className={value.color}>{value.label}</span>
              {index < values.length - 1 && <span className="text-gray-600">|</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Componente para mostrar listas de propiedades o pagos
const ListCard = ({ title, link, items, renderItem }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      <Link to={link} className="text-blue-600 hover:text-blue-800">Ver todas</Link>
    </div>
    <div className="divide-y">
      {items.slice(0, 5).map((item, index) => (
        <div key={index} className="py-3">
          {renderItem(item)}
        </div>
      ))}
    </div>
  </div>
);

const Admin = ({ isAuthenticated, user, propiedades = [], clientes = [], contratos = [], pagos = [] }) => {
  const [stats, setStats] = useState({
    propiedadesDisponibles: 0,
    propiedadesOcupadas: 0,
    propietarios: 0,
    inquilinos: 0,
    contratosActivos: 0,
    pagosPendientes: 0,
    ingresosMensuales: 0
  });

  useEffect(() => {
    if (propiedades && clientes && contratos && pagos) {
      const propiedadesDisponibles = propiedades.filter(p => p.disponible).length;
      const propiedadesOcupadas = propiedades.length - propiedadesDisponibles;
      const propietarios = clientes.filter(c => c.tipo === 'propietario').length;
      const inquilinos = clientes.filter(c => c.tipo === 'inquilino').length;
      const contratosActivos = contratos.filter(c => c.estado === 'activo').length;
      const pagosPendientes = pagos.filter(p => p.estado === 'pendiente').length;

      const ingresosMensuales = contratos
        .filter(c => c.estado === 'activo')
        .reduce((sum, contrato) => sum + contrato.valor_mensual, 0);

      setStats({
        propiedadesDisponibles,
        propiedadesOcupadas,
        propietarios,
        inquilinos,
        contratosActivos,
        pagosPendientes,
        ingresosMensuales
      });
    }
  }, [propiedades, clientes, contratos, pagos]);

  const statCards = [
    {
      icon: {
        svg: (
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
        ),
        bgColor: 'bg-blue-100'
      },
      title: 'Propiedades',
      values: [
        { label: `${stats.propiedadesDisponibles} disponibles`, color: 'text-green-600' },
        { label: `${stats.propiedadesOcupadas} ocupadas`, color: 'text-blue-600' }
      ]
    },
    {
      icon: {
        svg: (
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
        ),
        bgColor: 'bg-green-100'
      },
      title: 'Clientes',
      values: [
        { label: `${stats.propietarios} propietarios`, color: 'text-green-600' },
        { label: `${stats.inquilinos} inquilinos`, color: 'text-blue-600' }
      ]
    },
    {
      icon: {
        svg: (
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        ),
        bgColor: 'bg-purple-100'
      },
      title: 'Contratos',
      values: [
        { label: `${stats.contratosActivos} activos`, color: 'text-green-600' }
      ]
    },
    {
      icon: {
        svg: (
          <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        ),
        bgColor: 'bg-yellow-100'
      },
      title: 'Pagos',
      values: [
        { label: `${stats.pagosPendientes} pendientes`, color: 'text-red-600' }
      ]
    }
  ];

  return (
    <div>
      <div className="mb-6">
        <Header userRole={'admin'}/>
        <h1 className="text-3xl font-bold text-gray-800 mt-10">Bienvenido Marcelo</h1>
        <Link 
          to="/registrar-cliente" 
          className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Crear Nuevo Cliente
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen Financiero</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Ingresos Mensuales</h3>
            <p className="text-2xl font-bold text-green-600">${stats.ingresosMensuales.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ListCard
          title="Últimas Propiedades"
          link="/propiedades"
          items={propiedades}
          renderItem={(propiedad) => (
            <>
              <h3 className="font-semibold">{propiedad.tipo} - {propiedad.direccion}</h3>
              <div className="flex justify-between text-sm">
                <span>${propiedad.precio.toLocaleString()}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${propiedad.disponible ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                  {propiedad.disponible ? 'Disponible' : 'Ocupada'}
                </span>
              </div>
            </>
          )}
        />

        <ListCard
          title="Pagos Recientes"
          link="/pagos"
          items={pagos}
          renderItem={(pago) => (
            <>
              <div className="flex justify-between">
                <h3 className="font-semibold">{pago.concepto}</h3>
                <span className="font-bold">${pago.monto.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>{pago.fecha}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  pago.estado === 'pagado' ? 'bg-green-100 text-green-800' : 
                  pago.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {pago.estado}
                </span>
              </div>
            </>
          )}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Admin;