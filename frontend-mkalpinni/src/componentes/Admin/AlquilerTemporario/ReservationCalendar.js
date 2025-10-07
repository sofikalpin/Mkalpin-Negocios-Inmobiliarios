import { useNavigate, useLocation, Link } from "react-router-dom";
import { FaHome, FaBuilding, FaUsers, FaCalendarAlt, FaChartBar, FaCog, FaSignOutAlt, FaPlus, FaSearch, FaTh, FaList, FaFilter, FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaTag, FaEdit, FaTrash, FaEye, FaCheck, FaMoneyBillWave, FaTimes, FaDownload, FaSave, FaUser, FaRuler, FaSun, FaCalendarAlt as FaCalendar } from "react-icons/fa";
import React, { useState } from 'react';
import { format, isWithinInterval, addDays, isSameDay, addMonths, subMonths } from 'date-fns';

const ReservationCalendar = ({ property, onReserve, onCancelReservation, users, onAddUser }) => {
  const [currentDate, setCurrentDate] = useState(new Date()); // Fecha actual para navegar entre meses
  const [selectedDates, setSelectedDates] = useState({ start: null, end: null });
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [error, setError] = useState('');
  const [showAddGuestForm, setShowAddGuestForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda para huéspedes
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false); // Estado para mostrar confirmación de cancelación

  // Navegar al mes anterior
  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  // Navegar al mes siguiente
  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // Verificar si una fecha está reservada
  const isDateReserved = (date) => {
    return property.availability.some((reserva) => {
      const reservaStart = new Date(reserva.startDate);
      const reservaEnd = new Date(reserva.endDate);
      return isWithinInterval(date, { start: reservaStart, end: reservaEnd });
    });
  };

  // Verificar si un rango de fechas está disponible
  const isRangeAvailable = (start, end) => {
    for (let date = start; date <= end; date = addDays(date, 1)) {
      if (isDateReserved(date)) {
        return false;
      }
    }
    return true;
  };

  // Obtener la reserva que cubre una fecha específica
  const getReservationForDate = (date) => {
    return property.availability.find((reserva) => {
      const reservaStart = new Date(reserva.startDate);
      const reservaEnd = new Date(reserva.endDate);
      return isWithinInterval(date, { start: reservaStart, end: reservaEnd });
    });
  };

  // Manejar la selección de fechas
  const handleDateClick = (date) => {
    const reservation = getReservationForDate(date);

    if (reservation) {
      // Si la fecha está reservada, seleccionar el rango completo de la reserva
      setSelectedDates({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate),
      });
    } else {
      // Si la fecha no está reservada, permitir seleccionar un nuevo rango
      if (!selectedDates.start || (selectedDates.start && selectedDates.end)) {
        setSelectedDates({ start: date, end: null });
      } else if (date > selectedDates.start) {
        setSelectedDates({ ...selectedDates, end: date });
      } else {
        setSelectedDates({ start: date, end: null });
      }
    }
  };

  // Confirmar la reserva
  const handleConfirmReservation = () => {
    if (!selectedDates.start || !selectedDates.end) {
      setError('Selecciona un rango de fechas válido.');
      return;
    }
    if (!guestName) {
      setError('Ingresa el nombre del huésped.');
      return;
    }
    if (!isRangeAvailable(selectedDates.start, selectedDates.end)) {
      setError('El rango seleccionado no está disponible.');
      return;
    }

    // Verificar si el huésped ya está registrado
    const existingGuest = users.find((user) => user.email === guestEmail);

    if (!existingGuest) {
      // Si el huésped no está registrado, mostrar el formulario para agregarlo
      setShowAddGuestForm(true);
      return;
    }

    const reservation = {
      startDate: format(selectedDates.start, 'yyyy-MM-dd'),
      endDate: format(selectedDates.end, 'yyyy-MM-dd'),
      guest: { name: guestName, email: guestEmail },
    };

    onReserve(reservation);
    setSelectedDates({ start: null, end: null });
    setGuestName('');
    setGuestEmail('');
    setError('');
  };

  // Cancelar una reserva existente
  const handleCancelReservation = () => {
    const reservation = getReservationForDate(selectedDates.start);

    if (reservation) {
      setShowCancelConfirmation(true);
    } else {
      setError('No se encontró la reserva para cancelar.');
    }
  };

  // Confirmar la cancelación de la reserva
  const confirmCancelReservation = () => {
    const reservation = getReservationForDate(selectedDates.start);

    if (reservation) {
      onCancelReservation(reservation);
      setSelectedDates({ start: null, end: null });
      setShowCancelConfirmation(false);
    } else {
      setError('No se encontró la reserva para cancelar.');
    }
  };

  // Agregar un nuevo huésped
  const handleAddGuest = () => {
    if (!guestName || !guestEmail) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    const newUser = {
      id: users.length + 1,
      name: guestName,
      email: guestEmail,
      role: 'guest',
    };

    onAddUser(newUser);
    setShowAddGuestForm(false);
    handleConfirmReservation();
  };

  // Filtrar huéspedes registrados según el término de búsqueda
  const filteredGuests = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Obtener los días del mes actual
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 max-w-md mx-auto">
      {/* Navegación del calendario */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="bg-gray-100 p-1 rounded-full hover:bg-gray-200 transition-all text-sm"
        >
          ◀️
        </button>
        <h3 className="text-lg font-bold text-gray-800">
          {format(currentDate, 'MMMM yyyy')}
        </h3>
        <button
          onClick={handleNextMonth}
          className="bg-gray-100 p-1 rounded-full hover:bg-gray-200 transition-all text-sm"
        >
          ▶️
        </button>
      </div>

      {/* Calendario */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {/* Encabezados de los días de la semana */}
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
          <div key={day} className="text-center font-semibold text-gray-600 text-xs py-1">
            {day}
          </div>
        ))}
        {/* Días del mes */}
        {daysArray.map((day) => {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
          const isReserved = isDateReserved(date);
          const isStart = selectedDates.start && isSameDay(date, selectedDates.start);
          const isEnd = selectedDates.end && isSameDay(date, selectedDates.end);
          const isInRange =
            selectedDates.start &&
            selectedDates.end &&
            isWithinInterval(date, { start: selectedDates.start, end: selectedDates.end });
          const reservation = isReserved ? getReservationForDate(date) : null;

          return (
            <div
              key={day}
              className={`p-1 text-center rounded-md cursor-pointer transition-all text-sm ${
                isReserved
                  ? 'bg-red-100 text-red-700' // Fechas ocupadas en rojo
                  : isStart || isEnd
                  ? 'bg-blue-600 text-white' // Fechas de inicio/fin en azul
                  : isInRange
                  ? 'bg-blue-100 text-blue-800' // Rango seleccionado en azul claro
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100' // Fechas disponibles en gris
              }`}
              onClick={() => handleDateClick(date)}
              title={reservation ? `Reservado por: ${reservation.guest.name}` : null} // Tooltip con el nombre del huésped
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Formulario de reserva o cancelación */}
      {selectedDates.start && selectedDates.end && (
        <div className="bg-gray-50 p-3 rounded-md mb-4 border border-gray-200">
          <h4 className="text-md font-semibold text-gray-800 mb-2">
            {isDateReserved(selectedDates.start) ? 'Cancelar Reserva' : 'Reservar'}
          </h4>
          <div className="space-y-2">
            {/* Mostrar detalles de la reserva existente */}
            {isDateReserved(selectedDates.start) && (
              <div className="text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Reservado por:</span>{' '}
                  {getReservationForDate(selectedDates.start).guest.name}
                </p>
                <p>
                  <span className="font-semibold">Correo:</span>{' '}
                  {getReservationForDate(selectedDates.start).guest.email}
                </p>
              </div>
            )}
            {/* Botón de cancelación o confirmación de reserva */}
            {isDateReserved(selectedDates.start) ? (
              <button
                onClick={handleCancelReservation}
                className="w-full bg-red-600 text-white py-1 rounded-md hover:bg-red-700 transition-all text-sm"
              >
                Cancelar Reserva
              </button>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Nombre del huésped"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
                <input
                  type="email"
                  placeholder="Correo electrónico del huésped"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
                <button
                  onClick={handleConfirmReservation}
                  className="w-full bg-blue-600 text-white py-1 rounded-md hover:bg-blue-700 transition-all text-sm"
                >
                  Confirmar Reserva
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Confirmación de cancelación */}
      {showCancelConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm">
            <h4 className="text-lg font-bold text-gray-800 mb-4">¿Cancelar reserva?</h4>
            <p className="text-sm text-gray-600 mb-4">
              Esta acción eliminará la reserva seleccionada. ¿Estás seguro?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCancelConfirmation(false)}
                className="bg-gray-500 text-white py-1 px-4 rounded-md hover:bg-gray-600 transition-all text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={confirmCancelReservation}
                className="bg-red-600 text-white py-1 px-4 rounded-md hover:bg-red-700 transition-all text-sm"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 p-2 rounded-md text-red-600 text-xs mt-3 border border-red-100">
          {error}
        </div>
      )}
    </div>
  );
};

export default ReservationCalendar;