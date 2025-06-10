import React, { useState, useEffect } from 'react';
import { Menu, X, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from "../../../logo/logo.png";

const Header = ({ userRole }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuLinks, setMenuLinks] = useState([]);

  // Toggle menu function
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Update menu links when userRole changes
  useEffect(() => {
    const links = getMenuLinks(userRole);
    setMenuLinks(links);
    console.log("Current user role:", userRole); // For debugging
  }, [userRole]);

  // Function to get links based on role
  const getMenuLinks = (role) => {
    console.log("Getting menu links for role:", role); // For debugging
    
    switch (role) {
      case 'cliente':
        return [
          { to: "/cliente/iniciocliente", text: "Inicio" },
          { to: "/cliente/propiedades", text: "Propiedades" },
          { to: "/cliente/misdatos", text: "Mis datos" },
        ];
      case 'admin':
        return [
          { to: "/admin/propiedades", text: "Propiedades" },
          { to: "/admin/alquilerTemporarios", text: "Alquileres Temporarios" },
          { to: "/admin/clientes", text: "Clientes" },
        ];
      default:
        return [
          { to: "/", text: "Inicio" },
          { to: "/venta", text: "Venta" },
          { to: "/alquiler", text: "Alquiler" },
          { to: "/alquilerTemporario", text: "Alquiler Temporario" },
          { to: "/tasaciones", text: "Tasaciones" },
          { to: "/contacto", text: "Contacto" },
        ];
    }
  };

  return (
    <nav className="bg-white shadow-md py-6">
      <div className="max-w-full w-full px-20 mx-auto">
        <div className="flex items-center">
          {/* Logo area */}
          <div className="flex-none md:mr-8 flex-1 md:flex-none flex justify-center md:justify-start">
            <Link to="/">
              <img src={logo} alt="Logo" className="h-14 md:h-24 cursor-pointer" />
            </Link>
          </div>
          
          {/* Mobile menu button (Left on mobile) */}
          <div className="md:hidden absolute left-4">
            <button onClick={toggleMenu} className="text-gray-700">
              {isMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
          
          {/* Desktop central menu */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="flex space-x-8">
              {menuLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.to}
                  className="text-gray-700 hover:text-blue-600 font-medium text-xl"
                >
                  {link.text}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Login button (right side on desktop) */}
          <div className="hidden md:block flex-none ml-8">
            {userRole && userRole !== 'guest' ? (
              <Link to="/perfil" className="text-white bg-blue-600 hover:bg-blue-700 font-bold rounded-md border border-blue-600 px-5 py-3 text-xl">
                Perfil
              </Link>
            ) : (
              <Link to="/iniciarsesion" className="text-white bg-blue-600 hover:bg-blue-700 font-bold rounded-md border border-blue-600 px-5 py-3 text-xl">
                Iniciar Sesión
              </Link>
            )}
          </div>
          
          {/* User icon (Right on mobile) */}
          <div className="md:hidden absolute right-4">
            <Link to={userRole && userRole !== 'guest' ? "/perfil" : "/iniciarsesion"} className="text-gray-700 hover:text-blue-600">
              <User className="h-8 w-8" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4">
          <div className="px-4 pt-4 pb-4 space-y-1">
            <div className="flex flex-col items-center space-y-4 mt-4">
              {menuLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.to}
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium text-xl"
                >
                  {link.text}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;