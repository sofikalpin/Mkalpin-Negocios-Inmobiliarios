import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FaHome, FaBuilding, FaUsers, FaCalendarAlt, FaChartBar, FaCog, FaSignOutAlt, FaPlus, FaSearch, FaTh, FaList, FaFilter, FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaTag, FaEdit, FaTrash, FaEye, FaCheck, FaMoneyBillWave, FaTimes, FaDownload, FaSave, FaUser, FaRuler, FaSun, FaCalendarAlt as FaCalendar } from "react-icons/fa";
import { MapPin, Search, ChevronDown } from 'lucide-react';
import { API_BASE_URL } from '../../../config/apiConfig';

const HomeSearch = ({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  guestsInfo,
  setGuestsInfo,
  checkInDate,
  setCheckInDate,
  checkOutDate,
  setCheckOutDate,
  handleSearch,
  propertyType,
  setPropertyType,
}) => {
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
  const [localAvailablePropertyTypes, setLocalAvailablePropertyTypes] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [availableLocations, setAvailableLocations] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/Propiedad/Obtener`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (data.status && Array.isArray(data.value)) {
          const uniqueTypes = [...new Set(data.value.map(prop => prop.tipoPropiedad))];
          setLocalAvailablePropertyTypes(uniqueTypes);

          const uniqueLocations = [...new Set(
            data.value
              .flatMap(prop => [prop.barrio])
              .filter(loc => loc && loc.trim() !== '')
          )];
          setAvailableLocations(uniqueLocations);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearchTermChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      const filtered = availableLocations.filter(location =>
        location.toLowerCase().includes(value.toLowerCase())
      );
      setLocationSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };
  
  const handleSearchWithValidation = () => {
    if (!searchTerm.trim()) {
      alert('Por favor ingresa una ubicación para buscar');
      return;
    }

    if (activeTab === 'venta') {
      navigate(`/venta`, {
        state: {
          tipoPropiedad: propertyType,
          barrio: searchTerm,
        }
      });
    } else if (activeTab === 'alquiler') {
      navigate(`/alquiler`, {
        state: {
          tipoPropiedad: propertyType,
          barrio: searchTerm,
        }
      });
    } else if (activeTab === 'alquilerTemp') {
      navigate(`/alquilerTemporario`, {
      state: {
      tipoPropiedad: propertyType,
      barrio: searchTerm,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      adultos: guestsInfo.adults,
      ninos: guestsInfo.children,
      habitaciones: guestsInfo.rooms,
      }
    });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchWithValidation();
    }
  };

  const handleGuestChange = (type, value) => {
    setGuestsInfo((prev) => ({
      ...prev,
      [type]: Math.max(0, value),
    }));
  };

  const TabButtons = () => (
    <div className="flex flex-wrap gap-3 mb-8">
      {['venta', 'alquiler', 'alquilerTemp'].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-6 py-3 rounded-lg text-lg font-medium transition-all duration-300 ${
            activeTab === tab
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {tab === 'venta' ? 'Venta' : tab === 'alquiler' ? 'Alquiler' : 'Alquiler Temporario'}
        </button>
      ))}
    </div>
  );

  const LocationInput = ({ id, label, required = false }) => (
    <div className="relative">
      <label htmlFor={id} className="block text-lg font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type="text"
          id={id}
          className="pl-10 pr-3 py-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          placeholder={id.includes('temp') ? "Ingresa un destino" : "Ingresa una ubicación o barrio"}
          value={searchTerm}
          onChange={handleSearchTermChange}
          onKeyPress={handleKeyPress}
          onFocus={() => {
            if (searchTerm.length > 0 && locationSuggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          required={required}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      {showSuggestions && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {locationSuggestions.length > 0 ? (
            locationSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                {suggestion}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">
              No se encontraron coincidencias
            </div>
          )}
        </div>
      )}
    </div>
  );

  const PropertyTypeSelector = ({ id }) => (
    <div>
      <label htmlFor={id} className="block text-lg font-medium text-gray-700 mb-2">
        Tipo de Propiedad
      </label>
      <select
        id={id}
        className="pl-3 pr-3 py-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        value={propertyType}
        onChange={(e) => setPropertyType(e.target.value)}
      >
        <option value="">Cualquiera</option>
        {localAvailablePropertyTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  );

  const DateInput = ({ id, label, value, onChange, minDate, required = false }) => (
    <div>
      <label htmlFor={id} className="block text-lg font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="date"
        id={id}
        className="pl-3 pr-3 py-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={minDate}
        required={required}
      />
    </div>
  );

  const GuestsSelector = () => (
    <div className="relative">
      <label htmlFor="guests-rooms-select" className="block text-lg font-medium text-gray-700 mb-2">
        Huéspedes
      </label>
      <button
        type="button"
        id="guests-rooms-select"
        className="flex justify-between items-center pl-3 pr-3 py-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        onClick={() => setShowGuestsDropdown(!showGuestsDropdown)}
        aria-expanded={showGuestsDropdown}
        aria-haspopup="true"
      >
        <span>
          {guestsInfo.adults + guestsInfo.children} huéspedes, {guestsInfo.rooms} habitaciones
        </span>
        <ChevronDown className="h-5 w-5 text-gray-400" />
      </button>

      {showGuestsDropdown && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <div className="space-y-4">
            <GuestCounter 
              label="Adultos"
              description="Desde 13 años"
              value={guestsInfo.adults}
              onDecrease={() => handleGuestChange('adults', guestsInfo.adults - 1)}
              onIncrease={() => handleGuestChange('adults', guestsInfo.adults + 1)}
              minValue={1}
            />
            
            <GuestCounter 
              label="Niños"
              description="De 0 a 12 años"
              value={guestsInfo.children}
              onDecrease={() => handleGuestChange('children', guestsInfo.children - 1)}
              onIncrease={() => handleGuestChange('children', guestsInfo.children + 1)}
              minValue={0}
            />
            
            <GuestCounter 
              label="Habitaciones"
              value={guestsInfo.rooms}
              onDecrease={() => handleGuestChange('rooms', guestsInfo.rooms - 1)}
              onIncrease={() => handleGuestChange('rooms', guestsInfo.rooms + 1)}
              minValue={1}
            />

            <button
              type="button"
              className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              onClick={() => setShowGuestsDropdown(false)}
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const GuestCounter = ({ label, description, value, onDecrease, onIncrease, minValue = 0 }) => (
    <div className="flex justify-between items-center">
      <div>
        <p className="font-medium">{label}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <div className="flex items-center">
        <button
          type="button"
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
          onClick={onDecrease}
          disabled={value <= minValue}
          aria-label={`Decrease ${label.toLowerCase()}`}
        >
          -
        </button>
        <span className="mx-3">{value}</span>
        <button
          type="button"
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
          onClick={onIncrease}
          aria-label={`Increase ${label.toLowerCase()}`}
        >
          +
        </button>
      </div>
    </div>
  );

  const SearchButton = () => (
    <div className="flex items-end">
      <button
        type="button"
        className="w-full px-6 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center text-xl"
        onClick={handleSearchWithValidation}
      >
        <Search className="h-5 w-5 mr-2" />
        Buscar
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
      <div className="bg-white rounded-xl shadow-2xl p-8">
        <TabButtons />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {activeTab === 'alquilerTemp' ? (
            <>
              <LocationInput id="destination-temp" label="¿Adónde vas?" required />
              <PropertyTypeSelector id="propertyTypeTemp" />
              <DateInput
                id="checkin"
                label="Check-in"
                value={checkInDate}
                onChange={setCheckInDate}
                minDate={new Date().toISOString().split('T')[0]}
                required
              />
              <DateInput
                id="checkout"
                label="Check-out"
                value={checkOutDate}
                onChange={setCheckOutDate}
                minDate={checkInDate || new Date().toISOString().split('T')[0]}
                required
              />
              <GuestsSelector />
              <SearchButton />
            </>
          ) : (
            <>
              <div className="md:col-span-2">
                <LocationInput id="main-destination" label="¿Qué zona te encuentras interesado?" required />
              </div>
              <PropertyTypeSelector id="propertyType" />
              <SearchButton />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeSearch;