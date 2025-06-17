import React, { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";

const BuscarAspirante = () => {
  const [filtros, setFiltros] = useState({
    nombre: "",
    apellido: "",
    provincia: "",
    localidad: "",
    dni: "",
    estado: "", // Ahora usaremos un <select> para esto
    fecha_nacimiento: "",
  });
  const [resultados, setResultados] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false); // Nuevo estado para el indicador de carga
  const [errorDni, setErrorDni] = useState(""); // Nuevo estado para errores específicos del DNI

  // Ref para el debounce (para la búsqueda en tiempo real)
  const debounceTimeoutRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
    setMensaje(""); // Limpiar mensaje al cambiar cualquier filtro
    if (name === "dni") {
      setErrorDni(""); // Limpiar error de DNI al cambiarlo
    }
  };

  // Función para realizar la búsqueda
  const performSearch = async () => {
    setMensaje("");
    setResultados([]);
    setLoading(true);

    const params = new URLSearchParams();
    let atLeastOneFilter = false;
    Object.entries(filtros).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
        atLeastOneFilter = true;
      }
    });

    if (!atLeastOneFilter) {
      setMensaje("Ingrese al menos un criterio de búsqueda.");
      setLoading(false);
      return;
    }

    // Validación básica del DNI antes de la llamada a la API
    if (filtros.dni && !/^\d{7,10}$/.test(filtros.dni)) {
      setErrorDni("El DNI debe contener entre 7 y 10 dígitos numéricos.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/aspirantes?${params.toString()}`);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al buscar aspirantes.");
      }

      const data = await res.json();
      if (data.length === 0) {
        setMensaje("No se encontraron aspirantes que coincidan.");
      }
      setResultados(data);
    } catch (error) {
      setMensaje(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para la búsqueda con debounce
  // Se ejecutará cada vez que los 'filtros' cambien
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    // Establecer un nuevo temporizador para llamar a performSearch después de 500ms
    debounceTimeoutRef.current = setTimeout(() => {
      performSearch();
    }, 500);

    // Función de limpieza: limpiar el temporizador si el componente se desmonta
    // o si las dependencias cambian antes de que el temporizador finalice
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [filtros]); // Dependencia: el efecto se dispara cuando 'filtros' cambia

  // Clases comunes de Tailwind CSS para consistencia visual
  const inputClasses = "mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm";
  const labelClasses = "block text-sm font-medium text-gray-700";
  const buttonClasses = "w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out";
  const tableHeaderClasses = "px-4 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider";
  const tableCellClasses = "px-4 py-3 whitespace-nowrap text-sm text-gray-900";

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg my-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Buscador de Aspirantes</h1>

        {/* Formulario de Filtros */}
        <div className="mb-8 p-4 border border-gray-200 rounded-md bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Criterios de Búsqueda</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className={labelClasses}>Nombre</label>
              <input
                type="text"
                name="nombre"
                id="nombre"
                value={filtros.nombre}
                onChange={handleChange}
                placeholder="Ej: Juan"
                maxLength="50"
                className={inputClasses}
              />
            </div>
            {/* Apellido */}
            <div>
              <label htmlFor="apellido" className={labelClasses}>Apellido</label>
              <input
                type="text"
                name="apellido"
                id="apellido"
                value={filtros.apellido}
                onChange={handleChange}
                placeholder="Ej: Pérez"
                maxLength="50"
                className={inputClasses}
              />
            </div>
            {/* DNI */}
            <div>
              <label htmlFor="dni" className={labelClasses}>DNI</label>
              <input
                type="text"
                name="dni"
                id="dni"
                value={filtros.dni}
                onChange={handleChange}
                placeholder="Ej: 30123456"
                maxLength="10"
                className={`${inputClasses} ${errorDni ? 'border-red-500' : ''}`}
              />
              {errorDni && <p className="mt-1 text-sm text-red-600">{errorDni}</p>}
            </div>
            {/* Provincia */}
            <div>
              <label htmlFor="provincia" className={labelClasses}>Provincia</label>
              <input
                type="text"
                name="provincia"
                id="provincia"
                value={filtros.provincia}
                onChange={handleChange}
                placeholder="Ej: Santiago del Estero"
                maxLength="50"
                className={inputClasses}
              />
            </div>
            {/* Localidad */}
            <div>
              <label htmlFor="localidad" className={labelClasses}>Localidad</label>
              <input
                type="text"
                name="localidad"
                id="localidad"
                value={filtros.localidad}
                onChange={handleChange}
                placeholder="Ej: La Banda"
                maxLength="50"
                className={inputClasses}
              />
            </div>
            {/* Estado (Select) */}
            <div>
              <label htmlFor="estado" className={labelClasses}>Estado</label>
              <select
                name="estado"
                id="estado"
                value={filtros.estado}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="">Todos</option> {/* Opción para buscar por todos los estados */}
                <option value="Pendiente">Pendiente</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
            {/* Fecha de Nacimiento */}
            <div>
              <label htmlFor="fecha_nacimiento" className={labelClasses}>Fecha de Nacimiento</label>
              <input
                type="date"
                name="fecha_nacimiento"
                id="fecha_nacimiento"
                value={filtros.fecha_nacimiento}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
          </div>
        </div>

        {/* Mensajes de Estado (Cargando, Error, No Resultados) */}
        {loading && (
          <div className="mt-4 p-3 rounded-md text-center bg-blue-100 text-blue-700 flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Buscando aspirantes...
          </div>
        )}
        {mensaje && !loading && (
          <div className={`mt-4 p-3 rounded-md text-center ${mensaje.includes("Error") ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
            {mensaje}
          </div>
        )}

        {/* Tabla de Resultados */}
        {resultados.length > 0 && (
          <div className="mt-8 overflow-x-auto shadow-md rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Resultados Encontrados</h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600">
                <tr>
                  <th scope="col" className={`${tableHeaderClasses} rounded-tl-lg`}>DNI</th>
                  <th scope="col" className={tableHeaderClasses}>Nombre</th>
                  <th scope="col" className={tableHeaderClasses}>Apellido</th>
                  <th scope="col" className={tableHeaderClasses}>Provincia</th>
                  <th scope="col" className={tableHeaderClasses}>Localidad</th>
                  <th scope="col" className={tableHeaderClasses}>Estado</th>
                  <th scope="col" className={`${tableHeaderClasses} rounded-tr-lg`}>Fecha Nacimiento</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {resultados.map((asp) => (
                  <tr key={asp.id_aspirante} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                    <td className={tableCellClasses}>{asp.dni}</td>
                    <td className={tableCellClasses}>{asp.nombre}</td>
                    <td className={tableCellClasses}>{asp.apellido}</td>
                    <td className={tableCellClasses}>{asp.provincia || "N/A"}</td>
                    <td className={tableCellClasses}>{asp.localidad || "N/A"}</td>
                    <td className={tableCellClasses}>{asp.estado || "N/A"}</td>
                    <td className={tableCellClasses}>{asp.fecha_nacimiento ? asp.fecha_nacimiento.slice(0, 10) : "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BuscarAspirante;