import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout'; // Asegúrate de que la ruta sea correcta
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Estadisticas = () => {
  // --- Funciones de Utilidad para generar datos de ejemplo ---
  const generateRandomDNI = () => {
    const min = 35234332;
    const max = 45443122;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const generateRandomDate = (startYear, endYear) => {
    const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const createPlayer = (id, nombre, apellido, posicion, pieHabil, stats = {}, personal = {}) => {
    const defaultStats = {
      goles: Math.floor(Math.random() * 20),
      asistencias: Math.floor(Math.random() * 15),
      partidosJugados: Math.floor(Math.random() * (40 - 10 + 1)) + 10,
      minutosJugados: Math.floor(Math.random() * (3500 - 800 + 1)) + 800,
      tarjetasAmarillas: Math.floor(Math.random() * 8),
      tarjetasRojas: Math.floor(Math.random() * 2),
    };

    if (posicion === 'Portero') {
      defaultStats.goles = 0;
      defaultStats.asistencias = Math.floor(Math.random() * 3);
      defaultStats.penalesAtajados = Math.floor(Math.random() * 10);
    }

    const defaultPersonal = {
      dni: generateRandomDNI().toString(),
      fechaNacimiento: generateRandomDate(1990, 2005),
      altura: Math.floor(Math.random() * (195 - 160 + 1)) + 160,
      peso: Math.floor(Math.random() * (90 - 60 + 1)) + 60,
    };

    return {
      id_jugador: `uuid-${id}`,
      ...defaultPersonal,
      ...personal,
      nombre,
      apellido,
      posicion,
      pieHabil,
      estadisticas: {
        ...defaultStats,
        ...stats,
      },
    };
  };

  // --- DATOS DE EJEMPLO ACTUALIZADOS ---
  const initialJugadoresData = [
    createPlayer(1, 'Jose', 'Villagran', 'Delantero', 'Derecho', { goles: 12, asistencias: 5, partidosJugados: 25 }, { altura: 175, peso: 70 }),
    createPlayer(2, 'Juan', 'Cuevas', 'Centrocampista', 'Izquierdo', { goles: 3, asistencias: 10, partidosJugados: 30 }, { altura: 170, peso: 68 }),
    createPlayer(3, 'Virginia', 'Salvatierra', 'Defensor', 'Derecho', { goles: 1, asistencias: 2, partidosJugados: 32, tarjetasAmarillas: 7, tarjetasRojas: 1 }, { altura: 168, peso: 62 }),
    createPlayer(4, 'Silvio', 'Noguera', 'Portero', 'Derecho', { penalesAtajados: 5, partidosJugados: 28 }, { altura: 188, peso: 82 }),
    createPlayer(5, 'Juan', 'Cruz', 'Delantero', 'Izquierdo', { goles: 18, asistencias: 8, partidosJugados: 22 }, { altura: 172, peso: 71 }),
    createPlayer(6, 'Maria', 'Gomez', 'Centrocampista', 'Derecho', { goles: 5, asistencias: 9, partidosJugados: 35 }, { altura: 165, peso: 60 }),
    createPlayer(7, 'Carlos', 'Perez', 'Defensor', 'Izquierdo', { goles: 0, asistencias: 3, partidosJugados: 29 }, { altura: 180, peso: 78 }),
    createPlayer(8, 'Laura', 'Diaz', 'Delantero', 'Derecho', { goles: 20, asistencias: 11, partidosJugados: 27 }, { altura: 169, peso: 65 }),
    createPlayer(9, 'Pedro', 'Ruiz', 'Portero', 'Izquierdo', { penalesAtajados: 3, partidosJugados: 20 }, { altura: 190, peso: 85 }),
    createPlayer(10, 'Ana', 'Lopez', 'Centrocampista', 'Derecho', { goles: 7, asistencias: 15, partidosJugados: 38 }, { altura: 163, peso: 58 }),
  ];

  const [jugadores, setJugadores] = useState(initialJugadoresData);
  const [cargandoJugadores, setCargandoJugadores] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [vistaActual, setVistaActual] = useState('tabla'); // 'tabla' o 'graficos'
  const [metricaTorta, setMetricaTorta] = useState('posiciones'); // Nuevo estado para la métrica del gráfico de torta

  // Nuevo estado para el jugador seleccionado en el gráfico de barras
  const [jugadorSeleccionadoBarChart, setJugadorSeleccionadoBarChart] = useState('');

  const [estadisticasEdicion, setEstadisticasEdicion] = useState({
    goles: '',
    asistencias: '',
    partidosJugados: '',
    minutosJugados: '',
    tarjetasAmarillas: '',
    tarjetasRojas: '',
    peso: '',
    altura: '',
    penalesAtajados: '',
  });

  const debounceTimeoutRef = useRef(null);

  // --- Funciones que simulan la API con datos locales ---

  const fetchJugadores = async (query = '') => {
    setCargandoJugadores(true);
    setMensajeError('');
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      let dataFiltrada = initialJugadoresData;
      if (query) {
        const busqueda = query.toLowerCase();
        dataFiltrada = initialJugadoresData.filter(jugador => {
          return (
            jugador.dni.includes(busqueda) ||
            jugador.nombre.toLowerCase().includes(busqueda) ||
            jugador.apellido.toLowerCase().includes(busqueda)
          );
        });
      }

      setJugadores(dataFiltrada);
      if (dataFiltrada.length === 0 && query) {
        setMensajeError('No se encontraron jugadores con ese criterio de búsqueda.');
      } else if (dataFiltrada.length === 0) {
        setMensajeError('No hay jugadores registrados en el sistema.');
      }

      // Establecer el primer jugador como seleccionado por defecto si no hay ninguno
      if (dataFiltrada.length > 0 && !jugadorSeleccionadoBarChart) {
        setJugadorSeleccionadoBarChart(dataFiltrada[0].id_jugador);
      } else if (dataFiltrada.length === 0) {
        setJugadorSeleccionadoBarChart('');
      }
    } catch (error) {
      setMensajeError(`Error simulado: ${error.message}`);
      setJugadores([]);
    } finally {
      setCargandoJugadores(false);
    }
  };

  const actualizarEstadisticas = async (idJugador, playerUpdates, statsUpdates) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      setJugadores(prevJugadores =>
        prevJugadores.map(jugador =>
          jugador.id_jugador === idJugador
            ? {
                ...jugador,
                ...playerUpdates,
                estadisticas: { ...jugador.estadisticas, ...statsUpdates }
              }
            : jugador
        )
      );
      setMensajeError('Estadísticas y datos personales actualizados correctamente (cambios locales).');
    } catch (error) {
      setMensajeError(`Error simulado al actualizar: ${error.message}`);
    }
  };

  // --- Efectos y Manejadores ---

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      fetchJugadores(filtroBusqueda);
    }, 500);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [filtroBusqueda]);

  const handleFiltroBusquedaChange = (e) => {
    setFiltroBusqueda(e.target.value);
  };

  const handleEditarEstadisticas = (jugador) => {
    setJugadorSeleccionado(jugador);
    const currentStats = jugador.estadisticas || {};

    setEstadisticasEdicion({
      goles: (currentStats.goles || 0).toString(),
      asistencias: (currentStats.asistencias || 0).toString(),
      partidosJugados: (currentStats.partidosJugados || 0).toString(),
      minutosJugados: (currentStats.minutosJugados || 0).toString(),
      tarjetasAmarillas: (currentStats.tarjetasAmarillas || 0).toString(),
      tarjetasRojas: (currentStats.tarjetasRojas || 0).toString(),
      peso: (jugador.peso || 0).toString(),
      altura: (jugador.altura || 0).toString(),
      penalesAtajados: jugador.posicion === 'Portero' ? (currentStats.penalesAtajados || 0).toString() : '',
    });
    setMostrarModalEdicion(true);
    setMensajeError('');
  };

  const handleChangeEdicion = (e) => {
    const { name, value } = e.target;
    const parsedValue = value === '' ? '' : Math.max(0, parseInt(value) || 0);
    setEstadisticasEdicion(prev => ({ ...prev, [name]: parsedValue.toString() }));
  };

  const handleGuardarEstadisticas = async () => {
    if (!jugadorSeleccionado) return;

    const playerUpdates = {
      peso: Math.max(0, parseInt(estadisticasEdicion.peso) || 0),
      altura: Math.max(0, parseInt(estadisticasEdicion.altura) || 0),
    };

    const statsUpdates = {
      goles: Math.max(0, parseInt(estadisticasEdicion.goles) || 0),
      asistencias: Math.max(0, parseInt(estadisticasEdicion.asistencias) || 0),
      partidosJugados: Math.max(0, parseInt(estadisticasEdicion.partidosJugados) || 0),
      minutosJugados: Math.max(0, parseInt(estadisticasEdicion.minutosJugados) || 0),
      tarjetasAmarillas: Math.max(0, parseInt(estadisticasEdicion.tarjetasAmarillas) || 0),
      tarjetasRojas: Math.max(0, parseInt(estadisticasEdicion.tarjetasRojas) || 0),
    };

    if (jugadorSeleccionado.posicion === 'Portero') {
      statsUpdates.penalesAtajados = Math.max(0, parseInt(estadisticasEdicion.penalesAtajados) || 0);
    }

    await actualizarEstadisticas(jugadorSeleccionado.id_jugador, playerUpdates, statsUpdates);
    setMostrarModalEdicion(false);
  };

  // --- Datos y Lógica para Gráficos ---
  // Se expanden los colores para más opciones en el gráfico de torta
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF194F', '#83A6ED', '#8DD1E1', '#82CA9D', '#A4DE6C', '#FFC0CB', '#90EE90'];

  // Función para obtener datos de la torta según la métrica seleccionada
  const getPieChartData = () => {
    if (metricaTorta === 'posiciones') {
      const data = {};
      jugadores.forEach(jugador => {
        data[jugador.posicion] = (data[jugador.posicion] || 0) + 1;
      });
      return Object.keys(data).map(posicion => ({
        name: posicion,
        value: data[posicion],
      }));
    }

    // Para las demás métricas, agrupamos y mostramos un "Top N" y "Otros"
    const allValues = jugadores.map(j => ({
      name: `${j.nombre} ${j.apellido}`,
      value: metricaTorta === 'totalTarjetas'
        ? (j.estadisticas?.tarjetasAmarillas || 0) + (j.estadisticas?.tarjetasRojas || 0)
        : (j.estadisticas?.[metricaTorta] || 0)
    }));

    // Eliminar valores donde no haya datos (ej. un portero sin goles si se selecciona goles)
    const filteredValues = allValues.filter(item => item.value > 0);

    // Ordenar de mayor a menor
    filteredValues.sort((a, b) => b.value - a.value);

    const topN = 8; // Muestra los 8 jugadores con el valor más alto
    const dataForPie = filteredValues.slice(0, topN);
    const otherValue = filteredValues.slice(topN).reduce((sum, item) => sum + item.value, 0);

    if (otherValue > 0) {
      dataForPie.push({ name: 'Otros Jugadores', value: otherValue });
    }

    // Si no hay datos relevantes después de filtrar y agrupar, retorna un array vacío
    if (dataForPie.length === 0 || dataForPie.every(item => item.value === 0)) {
        return [];
    }

    return dataForPie;
  };

  // Función para obtener el título dinámico del gráfico de torta
  const getPieChartTitle = () => {
    switch (metricaTorta) {
      case 'posiciones':
        return 'Distribución de Jugadores por Posición';
      case 'goles':
        return 'Goles por Jugador (Top)';
      case 'asistencias':
        return 'Asistencias por Jugador (Top)';
      case 'partidosJugados':
        return 'Partidos Jugados por Jugador (Top)';
      case 'tarjetasAmarillas':
        return 'Tarjetas Amarillas por Jugador (Top)';
      case 'tarjetasRojas':
        return 'Tarjetas Rojas por Jugador (Top)';
      case 'totalTarjetas':
        return 'Total de Tarjetas (Amarillas + Rojas) por Jugador (Top)';
      default:
        return 'Estadísticas por Jugador';
    }
  };

  // NUEVA FUNCIÓN para obtener goles por partido de un jugador específico
  const getGolesPorPartidoJugadorSeleccionado = () => {
    const jugador = jugadores.find(j => j.id_jugador === jugadorSeleccionadoBarChart);
    if (!jugador || !jugador.estadisticas) {
      return [];
    }

    const goles = jugador.estadisticas.goles || 0;
    const partidosJugados = jugador.estadisticas.partidosJugados || 0;
    const asistencias = jugador.estadisticas.asistencias || 0;
    const tarjetasAmarillas = jugador.estadisticas.tarjetasAmarillas || 0;
    const tarjetasRojas = jugador.estadisticas.tarjetasRojas || 0;

    const data = [
      { name: 'Goles', value: goles },
      { name: 'Asistencias', value: asistencias },
      { name: 'Partidos Jugados', value: partidosJugados },
      { name: 'Tarjetas Amarillas', value: tarjetasAmarillas },
      { name: 'Tarjetas Rojas', value: tarjetasRojas },
    ];

    // Si es portero, añadir penales atajados
    if (jugador.posicion === 'Portero') {
      data.push({ name: 'Penales Atajados', value: jugador.estadisticas.penalesAtajados || 0 });
    }

    return data.filter(item => item.value > 0); // Solo mostrar estadísticas con valor > 0
  };

  const clasesInput = "mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm";
  const clasesLabel = "block text-sm font-medium text-gray-700";

  return (
    <Layout>
      <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center drop-shadow-md">Estadísticas de Jugadores</h1>

        {/* --- Sección de Búsqueda y Botones de Vista --- */}
        <div className="bg-white p-6 rounded-lg shadow-xl mb-8 border-t-4 border-blue-600">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Opciones de Vista</h2>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <input
              type="text"
              placeholder="Buscar por DNI, nombre o apellido..."
              value={filtroBusqueda}
              onChange={handleFiltroBusquedaChange}
              className={`${clasesInput} sm:w-2/3`}
            />
            <div className="flex gap-2 sm:w-1/3 justify-end">
              <button
                onClick={() => setVistaActual('tabla')}
                className={`px-5 py-2 rounded-md font-semibold transition duration-150 ease-in-out ${
                  vistaActual === 'tabla' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Ver Tabla
              </button>
              <button
                onClick={() => setVistaActual('graficos')}
                className={`px-5 py-2 rounded-md font-semibold transition duration-150 ease-in-out ${
                  vistaActual === 'graficos' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Ver Gráficos
              </button>
            </div>
          </div>
        </div>

        {/* --- Sección de Contenido Principal (Tabla o Gráficos) --- */}
        <div className="bg-white p-6 rounded-lg shadow-xl border-t-4 border-green-600">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {vistaActual === 'tabla' ? 'Listado de Estadísticas' : 'Análisis Gráfico de Estadísticas'}
          </h2>
          {mensajeError && (
            <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-md text-center">
              {mensajeError}
            </div>
          )}
          {cargandoJugadores ? (
            <p className="text-gray-600 text-center">Cargando estadísticas de jugadores...</p>
          ) : (
            <>
              {vistaActual === 'tabla' ? (
                // --- VISTA DE TABLA ---
                <div className="overflow-x-auto">
                  {jugadores.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nombre Completo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            DNI
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Posición
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Altura (cm)
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Peso (kg)
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Goles
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Asist.
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            PJ
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Min. Jug.
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            TA
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            TR
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Goles/PJ
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Asist./PJ
                          </th>
                          {jugadores.some(j => j.posicion === 'Portero') && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Penales Atajados
                            </th>
                          )}
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {jugadores.map((jugador) => (
                          <tr key={jugador.id_jugador}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {jugador.nombre} {jugador.apellido}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {jugador.dni}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {jugador.posicion}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {jugador.altura}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {jugador.peso}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {jugador.estadisticas?.goles || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {jugador.estadisticas?.asistencias || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {jugador.estadisticas?.partidosJugados || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {jugador.estadisticas?.minutosJugados || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {jugador.estadisticas?.tarjetasAmarillas || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {jugador.estadisticas?.tarjetasRojas || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {(jugador.estadisticas?.goles / (jugador.estadisticas?.partidosJugados || 1)).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {(jugador.estadisticas?.asistencias / (jugador.estadisticas?.partidosJugados || 1)).toFixed(2)}
                            </td>
                            {jugadores.some(j => j.posicion === 'Portero') && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {jugador.posicion === 'Portero' ? (jugador.estadisticas?.penalesAtajados || 0) : '-'}
                              </td>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleEditarEstadisticas(jugador)}
                                className="text-indigo-600 hover:text-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                              >
                                Editar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-gray-600 text-center">No hay jugadores para mostrar estadísticas. Intenta ajustar tu búsqueda.</p>
                  )}
                </div>
              ) : (
                // --- VISTA DE GRÁFICOS ---
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Selector de métrica para el Gráfico de Torta */}
                  <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg shadow-inner flex flex-col items-center">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Seleccionar Métrica para Gráfico de Torta</h3>
                    <div className="relative inline-block w-full sm:w-1/2">
                      <select
                        value={metricaTorta}
                        onChange={(e) => setMetricaTorta(e.target.value)}
                        className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                      >
                        <option value="posiciones">Distribución por Posiciones</option>
                        <option value="goles">Goles</option>
                        <option value="asistencias">Asistencias</option>
                        <option value="partidosJugados">Partidos Jugados</option>
                        <option value="tarjetasAmarillas">Tarjetas Amarillas</option>
                        <option value="tarjetasRojas">Tarjetas Rojas</option>
                        <option value="totalTarjetas">Total Tarjetas (Amarillas + Rojas)</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>

                  {/* Gráfico de Torta Dinámico */}
                  <div className="bg-gray-50 p-4 rounded-lg shadow-inner flex flex-col items-center">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">{getPieChartTitle()}</h3>
                    {getPieChartData().length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={getPieChartData()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          >
                            {getPieChartData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-gray-600">No hay datos para mostrar el gráfico de {getPieChartTitle().toLowerCase()}.</p>
                    )}
                  </div>

                  {/* Gráfico de Barras: Estadísticas por Jugador (con selector) */}
                  <div className="bg-gray-50 p-4 rounded-lg shadow-inner flex flex-col items-center">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Estadísticas Detalladas por Jugador</h3>
                    <div className="relative inline-block w-full sm:w-1/2 mb-4">
                      <select
                        value={jugadorSeleccionadoBarChart}
                        onChange={(e) => setJugadorSeleccionadoBarChart(e.target.value)}
                        className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                      >
                        <option value="">Selecciona un jugador</option>
                        {jugadores.map(jugador => (
                          <option key={jugador.id_jugador} value={jugador.id_jugador}>
                            {jugador.nombre} {jugador.apellido} ({jugador.posicion})
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                    {jugadorSeleccionadoBarChart && getGolesPorPartidoJugadorSeleccionado().length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={getGolesPorPartidoJugadorSeleccionado()}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value" fill="#82ca9d" name="Cantidad" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-gray-600">
                        {jugadorSeleccionadoBarChart ? "El jugador seleccionado no tiene estadísticas registradas." : "Selecciona un jugador para ver sus estadísticas detalladas."}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* --- Modal de Edición de Estadísticas --- */}
        {mostrarModalEdicion && jugadorSeleccionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  Editar Estadísticas de {jugadorSeleccionado.nombre} {jugadorSeleccionado.apellido}
                </h3>
                <button
                  onClick={() => setMostrarModalEdicion(false)}
                  className="text-gray-500 hover:text-gray-700 text-lg"
                >
                  ❌
                </button>
              </div>

              <form className="space-y-4">
                {/* Nuevos campos: Peso y Altura */}
                <div>
                  <label htmlFor="altura" className={clasesLabel}>Altura (cm)</label>
                  <input
                    type="number"
                    name="altura"
                    id="altura"
                    value={estadisticasEdicion.altura}
                    onChange={handleChangeEdicion}
                    className={clasesInput}
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="peso" className={clasesLabel}>Peso (kg)</label>
                  <input
                    type="number"
                    name="peso"
                    id="peso"
                    value={estadisticasEdicion.peso}
                    onChange={handleChangeEdicion}
                    className={clasesInput}
                    min="0"
                  />
                </div>

                {/* Campos de estadísticas existentes */}
                <div>
                  <label htmlFor="goles" className={clasesLabel}>Goles</label>
                  <input
                    type="number"
                    name="goles"
                    id="goles"
                    value={estadisticasEdicion.goles}
                    onChange={handleChangeEdicion}
                    className={clasesInput}
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="asistencias" className={clasesLabel}>Asistencias</label>
                  <input
                    type="number"
                    name="asistencias"
                    id="asistencias"
                    value={estadisticasEdicion.asistencias}
                    onChange={handleChangeEdicion}
                    className={clasesInput}
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="partidosJugados" className={clasesLabel}>Partidos Jugados</label>
                  <input
                    type="number"
                    name="partidosJugados"
                    id="partidosJugados"
                    value={estadisticasEdicion.partidosJugados}
                    onChange={handleChangeEdicion}
                    className={clasesInput}
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="minutosJugados" className={clasesLabel}>Minutos Jugados</label>
                  <input
                    type="number"
                    name="minutosJugados"
                    id="minutosJugados"
                    value={estadisticasEdicion.minutosJugados}
                    onChange={handleChangeEdicion}
                    className={clasesInput}
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="tarjetasAmarillas" className={clasesLabel}>Tarjetas Amarillas</label>
                  <input
                    type="number"
                    name="tarjetasAmarillas"
                    id="tarjetasAmarillas"
                    value={estadisticasEdicion.tarjetasAmarillas}
                    onChange={handleChangeEdicion}
                    className={clasesInput}
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="tarjetasRojas" className={clasesLabel}>Tarjetas Rojas</label>
                  <input
                    type="number"
                    name="tarjetasRojas"
                    id="tarjetasRojas"
                    value={estadisticasEdicion.tarjetasRojas}
                    onChange={handleChangeEdicion}
                    className={clasesInput}
                    min="0"
                  />
                </div>

                {/* Campo condicional para porteros: Penales Atajados */}
                {jugadorSeleccionado.posicion === 'Portero' && (
                  <div>
                    <label htmlFor="penalesAtajados" className={clasesLabel}>Penales Atajados</label>
                    <input
                      type="number"
                      name="penalesAtajados"
                      id="penalesAtajados"
                      value={estadisticasEdicion.penalesAtajados}
                      onChange={handleChangeEdicion}
                      className={clasesInput}
                      min="0"
                    />
                  </div>
                )}
                
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setMostrarModalEdicion(false)}
                    className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleGuardarEstadisticas}
                    className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                  >
                    Guardar Cambios
                  </button>
                </div>
                {mensajeError && mostrarModalEdicion && (
                  <div className="mt-4 p-3 rounded-md text-center bg-red-100 text-red-700">
                    {mensajeError}
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Estadisticas;