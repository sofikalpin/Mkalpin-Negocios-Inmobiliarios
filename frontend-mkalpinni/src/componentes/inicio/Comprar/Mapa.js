import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Mapa = ({ propiedades }) => {
  return (
    <MapContainer center={[-34.603, -58.381]} zoom={12} className="h-96 w-full rounded-lg">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {propiedades.map((prop) => (
        <Marker key={prop.id} position={[prop.coordenadas.lat, prop.coordenadas.lng]}>
          <Popup>{prop.titulo} - ${prop.precio}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Mapa;
