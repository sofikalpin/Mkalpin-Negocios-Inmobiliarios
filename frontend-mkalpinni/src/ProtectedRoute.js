import { Navigate } from "react-router-dom";
import { useUser } from "./Context/UserContext";

const ProtegerRuta = ({ children }) => {
    //Ayuda para evitar que usuarios no autenticados accedan a paginas
    const { user, loading } = useUser();

    if (loading) {
        return <p>Cargando...</p>;
    }

    // Si no hay usuario, redirigimos al login
    if (!user) {
        return <Navigate to="/iniciarsesion" />;
    }

    return children;
};

export default ProtegerRuta;