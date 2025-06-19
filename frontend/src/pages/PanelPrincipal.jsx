import React, { useState, useEffect } from 'react';
import Layout from './../components/Layout'; // Make sure this path is correct based on your project structure

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const EVENT_TYPES = [
  { id: 'entrenamiento', label: 'Entrenamiento', color: 'bg-blue-500', icon: '🏃' },
  { id: 'partido', label: 'Partido', color: 'bg-green-500', icon: '⚽' },
  { id: 'medico', label: 'Médico', color: 'bg-red-500', icon: '🏥' },
  { id: 'reunion', label: 'Reunión', color: 'bg-purple-500', icon: '👥' }
];

const PanelPrincipal = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Entrenamiento Matutino',
      date: new Date(2025, 5, 20), // June 20, 2025
      type: 'entrenamiento',
      time: '08:00',
      location: 'Campo Principal',
      participants: 22
    },
    {
      id: 2,
      title: 'Partido vs. Real Madrid',
      date: new Date(2025, 5, 22), // June 22, 2025
      type: 'partido',
      time: '19:00',
      location: 'Estadio Santiago Bernabéu',
      participants: 30
    },
    {
      id: 3,
      title: 'Evaluación Médica',
      date: new Date(2025, 5, 18), // June 18, 2025
      type: 'medico',
      time: '10:00',
      location: 'Centro Médico',
      participants: 5
    }
  ]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    type: 'entrenamiento',
    time: '',
    location: '',
    participants: ''
  });

  // Get days in current month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Days from previous month
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Days from current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true });
    }
    
    // Days from next month to fill grid
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({ date: new Date(year, month + 1, day), isCurrentMonth: false });
    }
    
    return days;
  };

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesType = selectedEventType === 'todos' || event.type === selectedEventType;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            event.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Get events for a specific date
  const getEventsForDate = (date) => {
    return filteredEvents.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  // Navigate months
  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  // Add new event
  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date) {
      const event = {
        id: Date.now(),
        ...newEvent,
        date: new Date(newEvent.date),
        participants: parseInt(newEvent.participants) || 0
      };
      setEvents(prev => [...prev, event]);
      setNewEvent({
        title: '',
        date: '',
        type: 'entrenamiento',
        time: '',
        location: '',
        participants: ''
      });
      setShowEventModal(false);
    }
  };

  // Delete event
  const handleDeleteEvent = (eventId) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();

  return (
    // <Layout> will provide the NavBar and SideBar
    // The previous div with "bg-gray-50 p-4 max-w-7xl mx-auto" is now inside Layout's main content area
    <Layout>
      <div className="bg-gray-50 p-4"> {/* Removed max-w-7xl mx-auto to allow Layout's padding to manage width */}
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📅</span>
              <h1 className="text-2xl font-bold text-gray-800">Calendario Deportivo</h1>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              {/* Search */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              
              {/* Type filter */}
              <select
                value={selectedEventType}
                onChange={(e) => setSelectedEventType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="todos">Todos</option>
                {EVENT_TYPES.map(type => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>
              
              {/* Add event button */}
              <button
                onClick={() => setShowEventModal(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <span>➕</span>
                Agregar
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Calendar */}
          <div className="xl:col-span-3 bg-white rounded-lg shadow-sm p-6">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ←
              </button>
              <h2 className="text-2xl font-semibold text-gray-800">
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                →
              </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map(day => (
                <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const dayEvents = getEventsForDate(day.date);
                const isToday = day.date.toDateString() === today.toDateString();
                const isSelected = selectedDate && day.date.toDateString() === selectedDate.toDateString();

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedDate(day.date)}
                    className={`
                      min-h-[120px] p-2 border border-gray-200 cursor-pointer transition-colors
                      ${!day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white hover:bg-blue-50'}
                      ${isToday ? 'ring-2 ring-blue-500' : ''}
                      ${isSelected ? 'bg-blue-100' : ''}
                    `}
                  >
                    <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : ''}`}>
                      {day.date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map(event => {
                        const eventType = EVENT_TYPES.find(t => t.id === event.type);
                        return (
                          <div
                            key={event.id}
                            className={`text-xs p-1 rounded text-white ${eventType.color} truncate`}
                            title={event.title}
                          >
                            {event.title}
                          </div>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{dayEvents.length - 3} más
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Side panel */}
          <div className="space-y-6">
            {/* Events for selected day */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">
                {selectedDate ? `Eventos - ${selectedDate.toLocaleDateString('es-AR')}` : 'Selecciona una fecha'}
              </h3>
              
              {selectedDate ? (
                <div className="space-y-3">
                  {getEventsForDate(selectedDate).length === 0 ? (
                    <p className="text-gray-500 text-sm">No hay eventos para este día</p>
                  ) : (
                    getEventsForDate(selectedDate).map(event => {
                      const eventType = EVENT_TYPES.find(t => t.id === event.type);
                      return (
                        <div key={event.id} className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-800">{event.title}</h4>
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              ❌
                            </button>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{eventType.icon}</span>
                              <span>{eventType.label}</span>
                            </div>
                            {event.time && (
                              <div className="flex items-center gap-2">
                                <span>🕐</span>
                                <span>{event.time}</span>
                              </div>
                            )}
                            {event.location && (
                              <div className="flex items-center gap-2">
                                <span>📍</span>
                                <span>{event.location}</span>
                              </div>
                            )}
                            {event.participants > 0 && (
                              <div className="flex items-center gap-2">
                                <span>👥</span>
                                <span>{event.participants} participantes</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Haz clic en una fecha para ver los eventos</p>
              )}
            </div>

            {/* Quick stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Estadísticas del Mes</h3>
              <div className="space-y-3">
                {EVENT_TYPES.map(type => {
                  const count = filteredEvents.filter(e => 
                    e.type === type.id && 
                    e.date.getMonth() === currentDate.getMonth() &&
                    e.date.getFullYear() === currentDate.getFullYear()
                  ).length;
                  return (
                    <div key={type.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{type.icon}</span>
                        <span className="text-sm">{type.label}</span>
                      </div>
                      <span className="font-medium">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Modal for adding event */}
        {showEventModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Agregar Nuevo Evento</h3>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ❌
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título del Evento
                  </label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Entrenamiento matutino"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Evento
                  </label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {EVENT_TYPES.map(type => (
                      <option key={type.id} value={type.id}>{type.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora
                  </label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Campo Principal"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Participantes
                  </label>
                  <input
                    type="number"
                    value={newEvent.participants}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, participants: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEventModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddEvent}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Agregar Evento
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PanelPrincipal;