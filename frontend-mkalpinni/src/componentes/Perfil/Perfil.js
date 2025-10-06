import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';
import { useUser } from '../../Context/UserContext';
import logo from "../../logo/logo.png";
import { ArrowLeft } from 'lucide-react';

const getRandomColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 70%, 50%)`;
};

const Perfil = () => {
  const { user, logout } = useUser();
  const [photo, setPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (user?.correo) {
      cargarFotoExistente();
    }
  }, [user?.correo]);

  const cargarFotoExistente = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/Usuario/ObtenerFoto/${user.correo}`,
        {
          responseType: 'blob'
        }
      );
      const url = URL.createObjectURL(response.data);
      setPhotoUrl(url);
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error('Error al cargar la foto existente:', error);
      }
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeletePhoto = () => {
    setPhoto(null);
    setPhotoUrl(null);
  };

  const handleUpdatePhoto = async () => {
    if (!photo) return;
    setIsUpdating(true);
    setError('');

    try {
      const token = sessionStorage.getItem('authToken');
      const response = await axios.post(
        `${API_BASE_URL}/Usuario/ActualizarFoto`,
        {
          correo: user.correo,
          foto: photo
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status) {
        alert('Foto actualizada con éxito');
        setPhotoUrl(photo);
      } else {
        setError('No se pudo actualizar la foto');
      }
    } catch (error) {
      console.error('Error al actualizar la foto:', error);
      setError('Error al conectar con el servidor');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false); 
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  const getRoleBadgeColor = (rol) => {
    switch (rol) {
      case 1: return "bg-indigo-600";
      case 2: return "bg-emerald-600";
      case 3: return "bg-violet-600";
      default: return "bg-slate-600";
    }
  };

  const getRoleText = (rol) => {
    switch (rol) {
      case 1: return "Propietario";
      case 2: return "Inquilino";
      case 3: return "Administrador";
      default: return "No especificado";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white/70 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50" style={{ backgroundColor: '#00A89F' }}>
        <div className="max-w-7xl mx-auto px-6" >
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-6">
              <img 
                src={logo}
                alt="Logo"
                className="w-48"
                onClick={() => navigate(-1)}
              />
            </div>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="px-6 py-2.5 text-sm font-medium text-white hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-lg transition-all duration-200 hover:shadow-md bg-red-600"
              aria-label="Cerrar sesión"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors font-medium mt-5 ml-10"
      >
        <ArrowLeft className="w-6 h-6" />
        <span>Volver</span>
      </button>

     
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-grey-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold text-slate-800">¿Seguro que quieres cerrar sesión?</h3>
            <div className="mt-4 flex justify-between gap-4">
              <button
                onClick={handleLogout}
                className="px-6 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
              >
                Sí, cerrar sesión
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-6 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
        
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
              <div className="relative h-48" style={{ backgroundColor: getRandomColor(user.correo) }}>
                <div className="absolute -bottom-16 left-8 p-1.5 bg-white rounded-2xl shadow-lg">
                  <div className="h-32 w-32 rounded-xl overflow-hidden bg-slate-100">
                    {photoUrl ? (
                      <img src={photoUrl} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                        <span className="text-4xl font-bold text-slate-400">
                          {user.nombrecompleto?.charAt(0) || '?'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-20 p-8">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">{user.nombrecompleto}</h2>
                <div className="flex items-center gap-3 mb-6">
                  <span className={`inline-flex px-4 py-1.5 rounded-lg text-sm font-medium text-white ${getRoleBadgeColor(user.rol)}`}>
                    {getRoleText(user.idrol)}
                  </span>
                  {user.idnivel && (
                    <span className="inline-flex px-4 py-1.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-600">
                      Nivel {user.idnivel}
                    </span>
                  )}
                </div>
                <p className="text-lg text-left text-slate-600"> Correo: {user.correo}</p>
              </div>
            </div>
          </div>

       
          <div className="flex flex-col gap-6 w-80">
         
          <div className="rounded-2xl shadow-sm border border-slate-200/60 p-6" style={{ backgroundColor: '#d2d2db' }}>

              <h3 className="text-xl font-semibold text-slate-800 mb-4">Foto de Perfil</h3>
              <div className="space-y-4">
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" id="photo-upload" />
                <button
                  onClick={() => document.getElementById('photo-upload').click()}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
                >
                  Cambiar foto
                </button>

                {photo && (
                  <div className="space-y-3">
                    <button
                      onClick={handleUpdatePhoto}
                      disabled={isUpdating}
                      className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
                    >
                      {isUpdating ? 'Actualizando...' : 'Guardar cambios'}
                    </button>
                    <button
                      onClick={handleDeletePhoto}
                      disabled={isUpdating}
                      className="w-full px-6 py-3 text-red-600 hover:bg-red-50 font-medium rounded-xl transition-colors border border-red-200 hover:border-red-300 disabled:opacity-50"
                    >
                      Eliminar foto
                    </button>
                  </div>
                )}

                {error && <p className="text-sm text-red-600">{error}</p>}
              </div>
            </div>

          
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6" style={{ backgroundColor: '#e3dfd6' }}>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Información de Perfil</h3>
              <button
                onClick={() => navigate("/editarperfil")}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
              >
                Editar Perfil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
