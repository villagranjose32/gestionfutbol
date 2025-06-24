import React, { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";

const BuscarJugador = () => {
  // State for search filters
  const [searchFilters, setSearchFilters] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    direccion: "",
    categoria: "",
    posicion: "",
    estado: "", // "Alta", "Baja", "" (todos)
  });
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");

  // Eliminamos el estado y las funciones relacionadas con "Gestionar Estado"
  // ya que la opción será eliminada.
  // const [selectedPlayer, setSelectedPlayer] = useState(null);
  // const [showStatusForm, setShowStatusForm] = useState(false);
  // const [statusUpdateMessage, setStatusUpdateMessage] = useState("");
  // const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  // const [statusForm, setStatusForm] = useState({
  //   fecha_alta: "",
  //   fecha_baja: "",
  //   motivo_baja: "",
  // });

  const debounceTimeoutRef = useRef(null);

  const handleSearchFilterChange = (e) => {
    setSearchFilters({ ...searchFilters, [e.target.name]: e.target.value });
  };

  const performSearch = async () => {
    setSearchMessage("");
    setSearchResults([]);
    setSearchLoading(true);

    const params = new URLSearchParams();
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    // Solo realiza la búsqueda si hay al menos un criterio no vacío
    const hasSearchCriteria = Object.values(searchFilters).some((value) => value !== "");

    if (!hasSearchCriteria) {
      setSearchMessage("Ingrese al menos un criterio de búsqueda para ver resultados.");
      setSearchLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/jugadores?${params.toString()}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al buscar jugadores.");
      }
      const data = await res.json();
      if (data.length === 0) {
        setSearchMessage("No se encontraron jugadores que coincidan con los filtros.");
      }
      setSearchResults(data);
    } catch (error) {
      setSearchMessage(`Error: ${error.message}`);
    } finally {
      setSearchLoading(false);
    }
  };

  // Debounce effect for search filters
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      performSearch();
    }, 500);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchFilters]); // Dependencia: re-ejecutar cuando los filtros cambien

  // Handler for "Ver perfil" button
  const handleViewProfile = (player) => {
    // Aquí puedes redirigir a una página de perfil o abrir un modal con la información detallada.
    // Por ahora, solo mostraremos una alerta simple.
    alert(`Ver perfil de: ${player.nombre} ${player.apellido}\nDNI: ${player.dni}\nCategoría: ${player.categoria}`);
    // Ejemplo de redirección (si tuvieras una ruta /perfil/[id] en Next.js, por ejemplo):
    // import { useRouter } from 'next/router';
    // const router = useRouter();
    // router.push(`/perfil/${player.id_jugador}`);
  };

  // Helper function to render status label and color in table
  const renderStatus = (player) => {
    // Determine status based on fecha_baja being present and not null/empty
    const isBaja = player.fecha_baja && player.fecha_baja !== null && player.fecha_baja !== '';
    const statusText = isBaja ? 'Baja' : 'Alta';
    const statusClass = isBaja ? 'text-red-700 font-semibold' : 'text-green-700 font-semibold';
    return <span className={statusClass}>{statusText}</span>;
  };

  const inputClasses = "mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm";
  const labelClasses = "block text-sm font-medium text-gray-700";

  // Determine the background color for the select based on the selected value
  const estadoSelectBgClass = searchFilters.estado === "Alta"
    ? "bg-green-100 border-green-300 focus:ring-green-500 focus:border-green-500"
    : searchFilters.estado === "Baja"
    ? "bg-red-100 border-red-300 focus:ring-red-500 focus:border-red-500"
    : "bg-gray-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500";


  return (
    <Layout>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Buscador de Jugadores</h1>

      <div className="p-6 bg-white shadow-lg rounded-lg mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Criterios de Búsqueda</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
          {/* Search Fields */}
          <div>
            <label htmlFor="nombre" className={labelClasses}>Nombre</label>
            <input
              type="text"
              name="nombre"
              id="nombre"
              value={searchFilters.nombre}
              onChange={handleSearchFilterChange}
              className={inputClasses}
              placeholder="Nombre del jugador"
              maxLength="50"
            />
          </div>
          <div>
            <label htmlFor="apellido" className={labelClasses}>Apellido</label>
            <input
              type="text"
              name="apellido"
              id="apellido"
              value={searchFilters.apellido}
              onChange={handleSearchFilterChange}
              className={inputClasses}
              placeholder="Apellido del jugador"
              maxLength="50"
            />
          </div>
          <div>
            <label htmlFor="dni" className={labelClasses}>DNI</label>
            <input
              type="text"
              name="dni"
              id="dni"
              value={searchFilters.dni}
              onChange={handleSearchFilterChange}
              className={inputClasses}
              placeholder="DNI del jugador"
              maxLength="10"
            />
          </div>
          <div>
            <label htmlFor="direccion" className={labelClasses}>Ubicación (Dirección)</label>
            <input
              type="text"
              name="direccion"
              id="direccion"
              value={searchFilters.direccion}
              onChange={handleSearchFilterChange}
              className={inputClasses}
              placeholder="Dirección del jugador"
              maxLength="100"
            />
          </div>
          <div>
            <label htmlFor="categoria" className={labelClasses}>Categoría</label>
            <input
              type="text"
              name="categoria"
              id="categoria"
              value={searchFilters.categoria}
              onChange={handleSearchFilterChange}
              className={inputClasses}
              placeholder="Categoría (Ej: Sub-18)"
              maxLength="30"
            />
          </div>
          <div>
            <label htmlFor="posicion" className={labelClasses}>Puesto (Posición)</label>
            <input
              type="text"
              name="posicion"
              id="posicion"
              value={searchFilters.posicion}
              onChange={handleSearchFilterChange}
              className={inputClasses}
              placeholder="Puesto (Ej: Delantero)"
              maxLength="30"
            />
          </div>
          {/* Campo de Estado (lista desplegable) */}
          <div>
            <label htmlFor="estado" className={labelClasses}>Estado</label>
            <select
              name="estado"
              id="estado"
              value={searchFilters.estado}
              onChange={handleSearchFilterChange}
              className={`${inputClasses} ${estadoSelectBgClass}`}
            >
              <option value="">Todos</option>
              <option value="Alta">Alta</option>
              <option value="Baja">Baja</option>
            </select>
          </div>
        </div>

        {/* Search Status Messages */}
        {searchLoading && (
          <div className="mt-4 p-3 rounded-md text-center bg-blue-100 text-blue-700 flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Buscando jugadores...
          </div>
        )}
        {searchMessage && !searchLoading && (
          <div className={`mt-4 p-3 rounded-md text-center ${searchMessage.includes("Error") ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
            {searchMessage}
          </div>
        )}
      </div>

      {/* El formulario de "Gestionar Estado" se ha eliminado */}
      {/* {showStatusForm && selectedPlayer && ( ... )} */}

      {/* Search Results Table */}
      {searchResults.length > 0 && (
        <div className="mt-6 overflow-x-auto shadow-lg rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Resultados Encontrados:</h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-600">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider rounded-tl-lg">DNI</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Nombre</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Apellido</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Dirección</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Posición</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Categoría</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Estado</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider rounded-tr-lg">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {searchResults.map((jugador) => (
                <tr key={jugador.id_jugador} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{jugador.dni}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{jugador.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{jugador.apellido}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{jugador.direccion || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{jugador.posicion || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{jugador.categoria || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {renderStatus(jugador)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewProfile(jugador)}
                      className="bg-blue-800 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                    >
                      Ver perfil
                    </button>
                    {/* El botón "Gestionar Estado" se ha eliminado */}
                    {/* <button
                      onClick={() => handleSelectPlayerForStatus(jugador)}
                      className="text-blue-600 hover:text-blue-900 font-semibold"
                    >
                      Gestionar Estado
                    </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default BuscarJugador;