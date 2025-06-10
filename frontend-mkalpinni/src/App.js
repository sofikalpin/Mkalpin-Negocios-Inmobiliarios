import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtegerRuta from "./ProtectedRoute";
import { UserProvider } from "./Context/UserContext";
import "./App.css";

// Importar los componentes

// Iniciar Sesion - Registrarse
import Login from "./componentes/Login/Login";
import { Registrar } from "./componentes/Registrar/Registrar";

// Inicio
import Inicio from "./componentes/inicio/Inicio/Inicio";
import Comprar from "./componentes/inicio/Comprar/Comprar";
import Ventadetalle from "./componentes/inicio/Comprar/VentaDetalle";
import Alquiler from "./componentes/inicio/Alquiler/Alquiler";
import AlquilerDetalle from "./componentes/inicio/Alquiler/AlquilerDetalle";
import AlquilerTemporario from "./componentes/inicio/AlquilerTemporario/AlquilerTemporario";
import AlquilerTemporarioDetalle from "./componentes/inicio/AlquilerTemporario/AlquilerTemporarioDetalle";
import Tasaciones from "./componentes/inicio/Tasaciones/Tasaciones";
import Contacto from "./componentes/inicio/Contacto/Contacto";
import Terminos from "./componentes/inicio/Componentes/Terminos";
import Privacidad from "./componentes/inicio/Componentes/Privacidad";

// Inquilino
import Inquilino from "./componentes/Inquilino/Inquilino";
import Forms from "./componentes/Inquilino/Forms";
import MisDatos from "./componentes/Inquilino/MisDatos";
import InicioInquilino from "./componentes/Inquilino/InicioInquilino";
import Propiedades from "./componentes/Inquilino/Propiedades";

// Perfil
import Perfil from "./componentes/Perfil/Perfil";
import EditPerfil from "./componentes/Perfil/EditarPerfil";

// Admin
import Admin from "./componentes/Admin/Admi";
import PropiedadesA from "./componentes/Admin/Propiedades/Propiedades";
import AlquilerTem from "./componentes/Admin/AlquilerTemporario/Temporarios";
import RegistroCliente from "./componentes/Admin/Clientes/RegistroCliente";

function App() {
  return (
    <UserProvider>
      <div className="App">
        <Routes>
          {/* Rutas Publicas */}
          {/* Iniciar Sesión - Registrarse */}
          <Route path="/iniciarsesion" element={<Login />} />
          <Route path="/registrarse" element={<Registrar />} />
          

          {/* Inicio */}
          <Route path="/" element={<Inicio />} />
          <Route path="/venta" element={<Comprar />} />
          <Route path="/venta/detalle" element={<Ventadetalle />} />
          <Route path="/alquiler" element={<Alquiler />} />
          <Route path="/alquiler/detalle" element={<AlquilerDetalle />} />
          <Route path="/alquilerTemporario" element={<AlquilerTemporario />} />
          <Route path="/alquilerTemporario/detalle" element={<AlquilerTemporarioDetalle />} />
          <Route path="/tasaciones" element={<Tasaciones />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/terminos" element={<Terminos />} />
          <Route path="/privacidad" element={<Privacidad />} />

          {/* Inquilino */}
          <Route path="/cliente" element={<Inquilino />} />
          <Route path="/cliente/formulario" element={<Forms />} />
          <Route path="/cliente/misdatos" element={<MisDatos />} />
          <Route path="/cliente/iniciocliente" element={<InicioInquilino />} />
          <Route path="/cliente/propiedades" element={<Propiedades />} />

          {/* Admin */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/propiedades" element={<PropiedadesA />} />
          <Route path="/admin/alquilerTemporarios" element={<AlquilerTem />} />
          <Route path="/admin/clientes" element={<RegistroCliente />} />

          {/* Perfil */}
          <Route path="/perfil" element={<ProtegerRuta><Perfil /></ProtegerRuta>} />
          <Route path="/editarperfil" element={<ProtegerRuta><EditPerfil /></ProtegerRuta>} />

          

          {/* Redirigir rutas no encontradas */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </UserProvider>
  );
}

export default App;