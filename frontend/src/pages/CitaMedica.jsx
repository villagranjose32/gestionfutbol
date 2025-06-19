import React from 'react';
import Layout from '../components/Layout';

const CitaMedica = () => {
  // Dummy data for demonstration purposes
  const jugadoresConProblemas = [
    { id: 1, nombre: "Juan Pérez", problema: "Esguince de tobillo", estado: "En recuperación", fechaDeteccion: "2025-06-10" },
    { id: 2, nombre: "María Gómez", problema: "Gripe", estado: "Reposo", fechaDeteccion: "2025-06-15" },
    { id: 3, nombre: "Carlos Ruiz", problema: "Contractura muscular", estado: "Tratamiento fisioterapia", fechaDeteccion: "2025-06-12" },
  ];

  // Dummy data for medical appointments
  const citasMedicas = [
    { id: 1, jugador: "Juan Pérez", tipoCita: "Revisión tobillo", fecha: "2025-06-20", hora: "10:00 AM", estado: "Pendiente" },
    { id: 2, jugador: "María Gómez", tipoCita: "Control de gripe", fecha: "2025-06-22", hora: "09:30 AM", estado: "Pendiente" },
    { id: 3, jugador: "Pedro Lopez", tipoCita: "Examen físico", fecha: "2025-06-25", hora: "02:00 PM", estado: "Pendiente" },
    { id: 4, jugador: "Laura Fernandez", tipoCita: "Rehabilitación", fecha: "2025-06-20", hora: "11:00 AM", estado: "Pendiente" },
  ];

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Panel de Enfermería y Diagnóstico</h1>

      {/* Sección de Diagnóstico */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Realizar Diagnóstico</h2>
        <p className="text-gray-600 mb-4">Seleccione un jugador y registre un nuevo diagnóstico o seguimiento.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="jugadorSelect" className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Jugador:</label>
            <select
              id="jugadorSelect"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#a40000] focus:border-[#a40000] sm:text-sm rounded-md"
            >
              <option value="">-- Seleccione un jugador --</option>
              <option value="jugador1">Lionel Messi</option>
              <option value="jugador2">Cristiano Ronaldo</option>
              <option value="jugador3">Kylian Mbappé</option>
              {/* Add more players dynamically in a real app */}
            </select>
          </div>
          <div>
            <label htmlFor="tipoProblema" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Problema:</label>
            <select
              id="tipoProblema"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#a40000] focus:border-[#a40000] sm:text-sm rounded-md"
            >
              <option value="">-- Seleccione tipo --</option>
              <option value="lesion">Lesión</option>
              <option value="enfermedad">Enfermedad</option>
              <option value="seguimiento">Seguimiento</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">Descripción / Observaciones:</label>
            <textarea
              id="descripcion"
              rows="3"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#a40000] focus:border-[#a40000] sm:text-sm"
              placeholder="Detalle del diagnóstico o seguimiento..."
            ></textarea>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            className="px-6 py-2 bg-[#a40000] hover:bg-[#800000] text-white font-semibold rounded-md shadow-md transition-colors"
          >
            Registrar Diagnóstico
          </button>
        </div>
      </div>

      {/* Sección de Jugadores con Problemas Médicos Actuales */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Jugadores con Problemas Médicos Actuales</h2>
        <p className="text-gray-600 mb-4">Listado de jugadores que requieren atención médica o seguimiento.</p>

        {jugadoresConProblemas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jugador
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Problema
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado Actual
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Detección
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jugadoresConProblemas.map((jugador) => (
                  <tr key={jugador.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {jugador.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {jugador.problema}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {jugador.estado}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {jugador.fechaDeteccion}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-[#a40000] hover:text-[#800000] mr-4">Ver Detalle</button>
                      <button className="text-blue-600 hover:text-blue-900">Marcar Recuperado</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No hay jugadores con problemas médicos actuales.</p>
        )}
      </div>

      {/* Sección de Notificaciones de Citas Médicas */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Próximas Citas Médicas</h2>
        <p className="text-gray-600 mb-4">Recordatorios de citas médicas programadas para los jugadores.</p>

        {citasMedicas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jugador
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo de Cita
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hora
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {citasMedicas.map((cita) => (
                  <tr key={cita.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {cita.jugador}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {cita.tipoCita}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {cita.fecha}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {cita.hora}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {cita.estado}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-[#a40000] hover:text-[#800000] mr-4">Ver Detalles</button>
                      <button className="text-blue-600 hover:text-blue-900">Reprogramar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No hay citas médicas programadas.</p>
        )}
      </div>

      {/* Botones adicionales */}
      <div className="mt-8 flex justify-center space-x-4">
        <button
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-md shadow-md transition-colors"
        >
          Ver Historial Médico Completo
        </button>
        <button
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-md shadow-md transition-colors"
        >
          Administrar Tipos de Lesiones/Enfermedades
        </button>
      </div>
    </Layout>
  );
};

export default CitaMedica;