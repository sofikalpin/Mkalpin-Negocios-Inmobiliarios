import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {

  const [ user, setUser ] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Estado del usuario actualizado: ", user);
  }, [user]);

  const login = async ({ email, password }) => {
    try {
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("userData");
      setUser(null);

      setIsLoggingIn(true);

      const { data } = await axios.post("http://localhost:5228/API/Usuario/IniciarSesion", {
        correo: email,
        contrasenaHash: password,
      });

      if (!data.status) {
        throw new Error("Inicio de sesión fallido");
      }

      const userData = data.value;
      sessionStorage.setItem("authToken", data.token);
      sessionStorage.setItem("userData", JSON.stringify(userData));
      setUser(userData);
      
      console.log("Usuario después de login: ", userData);

    } catch (error) {
      console.error("Error en login", error.response ? error.response.data : error);
      navigate("/iniciarsesion");
    }
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem("userData");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); 
    }
      setLoading(false);
  }, []);

  useEffect(() => {
    if (isLoggingIn && user?.idrol) {
      console.log("Redirigiendo según el rol:", user.idrol);
      switch (user.idrol) {
        case 1:
          if (user.autProf == true) {
            navigate("/profesor");
          }else{
            navigate("/profesor-noAutorizado");
          }
          break;
        case 2:
          navigate("/alumno");
          break;
        case 3:
          navigate("/administrador");
          break;
        default:
          navigate("/iniciarsesion");
      }
      setIsLoggingIn(false);
    }
  }, [user, isLoggingIn ,navigate]);
  
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userData");
    setTimeout(() => {
      navigate("/iniciarsesion"); 
  }, 500);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};
