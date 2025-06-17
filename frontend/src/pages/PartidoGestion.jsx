import React, { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout"; // Asume que este componente existe

const GestionPartidos = () => {
  // Estado para los filtros de búsqueda de Partidos
  const [filtrosBusqueda, setFiltrosBusqueda] = useState({
    fecha: "",
    equipoLocal: "", // Ahora es string
    equipoRival: "", // Nuevo nombre para "visitante"
    ubicacion: "", // Cambiado de 'torneo'
    estadoPartido: "", // "Pendiente", "Jugado", "Cancelado", "" (todos)
  });
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [cargandoBusqueda, setCargandoBusqueda] = useState(false);
  const [mensajeBusqueda, setMensajeBusqueda] = useState("");

  // Estado para el formulario de agregar nuevo partido
  const [mostrarFormularioAgregarPartido, setMostrarFormularioAgregarPartido] = useState(false);
  const [nuevoPartido, setNuevoPartido] = useState({
    fecha: "",
    hora: "",
    equipo_local: "", // Cambiado de _id a string
    equipo_rival: "", // Cambiado de _id a string
    ubicacion: "", // Cambiado de 'torneo'
    // estado_partido: "Pendiente", // Eliminado del formulario de agregar
    observaciones: "",
  });
  const [mensajeAgregarPartido, setMensajeAgregarPartido] = useState("");
  const [estaAgregandoPartido, setEstaAgregandoPartido] = useState(false);

  // Estado para el partido seleccionado para gestionar sus detalles (editar)
  const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);
  const [mostrarFormularioPartido, setMostrarFormularioPartido] = useState(false); // Formulario para editar detalles del partido
  const [mensajeActualizacionPartido, setMensajeActualizacionPartido] = useState("");
  const [estaActualizandoPartido, setEstaActualizandoPartido] = useState(false);

  // Estado del formulario para la actualización de detalles del partido
  const [formularioPartido, setFormularioPartido] = useState({
    fecha: "",
    hora: "",
    equipo_local: "", // Cambiado de _id a string
    equipo_rival: "", // Cambiado de _id a string
    // resultado_local: "", // Eliminado
    // resultado_visitante: "", // Eliminado
    // estado_partido: "", // Eliminado
    ubicacion: "", // Cambiado de 'torneo'
    observaciones: "",
  });

  // Estado para la gestión de participantes del partido
  const [mostrarParticipantes, setMostrarParticipantes] = useState(false);
  const [participacionesPartido, setParticipacionesPartido] = useState([]); // Listado de jugadores en el partido
  const [cargandoParticipantes, setCargandoParticipantes] = useState(false);
  const [mensajeParticipantes, setMensajeParticipantes] = useState("");
  // const [jugadorParaAgregar, setJugadorParaAgregar] = useState(""); // Ya no se usa directamente
  const [cargandoAgregarParticipante, setCargandoAgregarParticipante] = useState(false);
  const [mensajeAgregarParticipante, setMensajeAgregarParticipante] = useState("");
  const [busquedaJugadorAdd, setBusquedaJugadorAdd] = useState(""); // Búsqueda para el campo de agregar jugador
  const [resultadosBusquedaJugador, setResultadosBusquedaJugador] = useState([]);
  const [cargandoBusquedaJugador, setCargandoBusquedaJugador] = useState(false);
  const [mensajeBusquedaJugador, setMensajeBusquedaJugador] = useState("");

  // Ref para el debounce en la búsqueda de partidos
  const tiempoEsperaPartidosRef = useRef(null);
  const tiempoEsperaJugadoresRef = useRef(null); // Ref para debounce en búsqueda de jugadores

  // --- Manejadores de cambios en filtros de búsqueda de Partidos ---
  const handleChangeFiltroBusqueda = (e) => {
    setFiltrosBusqueda({ ...filtrosBusqueda, [e.target.name]: e.target.value });
  };

  // --- Lógica de búsqueda de partidos ---
  const realizarBusqueda = async () => {
    setMensajeBusqueda("");
    setResultadosBusqueda([]);
    setCargandoBusqueda(true);

    const params = new URLSearchParams();
    Object.entries(filtrosBusqueda).forEach(([key, value]) => {
      // Ajuste para el estado del partido
      if (key === "estadoPartido" && value) {
        params.append("estado_partido", value);
      } else if (key === "equipoLocal" && value) {
        params.append("equipo_local", value);
      } else if (key === "equipoRival" && value) {
        params.append("equipo_rival", value);
      } else if (key === "ubicacion" && value) { // Ahora el filtro es por ubicación
        params.append("ubicacion", value);
      }
      else if (value) {
        params.append(key, value);
      }
    });

    if (Object.values(filtrosBusqueda).every((value) => value === "")) {
      setCargandoBusqueda(false);
      // Opcional: Si no hay filtros, podrías cargar todos los partidos por defecto aquí.
      // fetch(`http://localhost:3000/api/partidos`).then(...)
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/partidos?${params.toString()}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al buscar partidos.");
      }
      const data = await res.json();
      if (data.length === 0) {
        setMensajeBusqueda("No se encontraron partidos que coincidan con los filtros.");
      }
      setResultadosBusqueda(data);
    } catch (error) {
      setMensajeBusqueda(`Error: ${error.message}`);
    } finally {
      setCargandoBusqueda(false);
    }
  };

  // Efecto para debounce en la búsqueda de partidos
  useEffect(() => {
    if (tiempoEsperaPartidosRef.current) {
      clearTimeout(tiempoEsperaPartidosRef.current);
    }
    tiempoEsperaPartidosRef.current = setTimeout(() => {
      realizarBusqueda();
    }, 500);

    return () => {
      if (tiempoEsperaPartidosRef.current) {
        clearTimeout(tiempoEsperaPartidosRef.current);
      }
    };
  }, [filtrosBusqueda]);

  // --- Manejadores y lógica para agregar un nuevo partido ---
  const handleChangeNuevoPartido = (e) => {
    setNuevoPartido({ ...nuevoPartido, [e.target.name]: e.target.value });
  };

  const handleAgregarNuevoPartido = async (e) => {
    e.preventDefault();
    setEstaAgregandoPartido(true);
    setMensajeAgregarPartido("");

    try {
      const res = await fetch("http://localhost:3000/api/partidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...nuevoPartido,
          // resultado_local: null, // Eliminado
          // resultado_visitante: null, // Eliminado
          // estado_partido: "Pendiente", // Asumido o manejado por backend si es necesario
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Error al agregar partido: ${errorData.message || res.statusText}`);
      }

      setMensajeAgregarPartido("Partido agregado correctamente.");
      setNuevoPartido({
        fecha: "", hora: "", equipo_local: "", equipo_rival: "",
        ubicacion: "", observaciones: ""
      }); // Limpiar formulario
      realizarBusqueda(); // Refrescar lista de partidos
      setMostrarFormularioAgregarPartido(false); // Opcional: cerrar el formulario después de agregar
    } catch (error) {
      console.error("Error al agregar partido:", error);
      setMensajeAgregarPartido(`Error: ${error.message}`);
    } finally {
      setEstaAgregandoPartido(false);
    }
  };

  // --- Manejador para seleccionar un partido de los resultados de búsqueda para editar ---
  const handleSeleccionarPartidoParaEditar = (partido) => {
    setPartidoSeleccionado(partido);
    setFormularioPartido({
      fecha: partido.fecha ? partido.fecha.split('T')[0] : "",
      hora: partido.hora || "",
      equipo_local: partido.equipo_local || "", // Cambiado de _id
      equipo_rival: partido.equipo_rival || "", // Cambiado de _id
      // resultado_local: partido.resultado_local === null ? "" : partido.resultado_local, // Eliminado
      // resultado_visitante: partido.resultado_visitante === null ? "" : partido.resultado_visitante, // Eliminado
      // estado_partido: partido.estado_partido || "", // Eliminado
      ubicacion: partido.ubicacion || "", // Cambiado de 'torneo'
      observaciones: partido.observaciones || "",
    });
    setMostrarFormularioPartido(true);
    setMensajeActualizacionPartido("");
    // Ocultar otros formularios/modals si estaban abiertos
    setMostrarParticipantes(false);
    setMostrarFormularioAgregarPartido(false);
  };

  // --- Manejadores de cambios y lógica para actualizar un partido ---
  const handleChangeFormularioPartido = (e) => {
    setFormularioPartido({ ...formularioPartido, [e.target.name]: e.target.value });
  };

  const handleActualizarPartido = async (e) => {
    e.preventDefault();
    if (!partidoSeleccionado) return;

    setEstaActualizandoPartido(true);
    setMensajeActualizacionPartido("");

    try {
      const res = await fetch(`http://localhost:3000/api/partidos/${partidoSeleccionado.id_partido}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha: formularioPartido.fecha,
          hora: formularioPartido.hora,
          equipo_local: formularioPartido.equipo_local, // Cambiado de _id
          equipo_rival: formularioPartido.equipo_rival, // Cambiado de _id
          // resultado_local: formularioPartido.resultado_local === "" ? null : parseInt(formularioPartido.resultado_local), // Eliminado
          // resultado_visitante: formularioPartido.resultado_visitante === "" ? null : parseInt(formularioPartido.resultado_visitante), // Eliminado
          // estado_partido: formularioPartido.estado_partido, // Eliminado
          ubicacion: formularioPartido.ubicacion, // Cambiado de 'torneo'
          observaciones: formularioPartido.observaciones,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Error al actualizar el partido: ${errorData.message || res.statusText}`);
      }

      setMensajeActualizacionPartido("Partido actualizado correctamente.");
      realizarBusqueda(); // Refrescar los resultados de la búsqueda
      setMostrarFormularioPartido(false);
      setPartidoSeleccionado(null);
    } catch (error) {
      console.error("Error al actualizar partido:", error);
      setMensajeActualizacionPartido(`Error: ${error.message}`);
    } finally {
      setEstaActualizandoPartido(false);
    }
  };

  // --- Lógica para eliminar un partido ---
  const handleEliminarPartido = async (id_partido) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este partido? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/partidos/${id_partido}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Error al eliminar partido: ${errorData.message || res.statusText}`);
      }

      alert("Partido eliminado correctamente.");
      realizarBusqueda(); // Refrescar la lista
      // Si el partido eliminado era el seleccionado, limpiar estados
      if (partidoSeleccionado && partidoSeleccionado.id_partido === id_partido) {
        setPartidoSeleccionado(null);
        setMostrarFormularioPartido(false);
        setMostrarParticipantes(false);
      }
    } catch (error) {
      console.error("Error al eliminar partido:", error);
      alert(`Error al eliminar partido: ${error.message}`);
    }
  };

  // --- Lógica y manejadores para la gestión de participantes ---
  const handleGestionarParticipantes = async (partido) => {
    setPartidoSeleccionado(partido);
    setMostrarParticipantes(true);
    // Ocultar otros formularios/modals si estaban abiertos
    setMostrarFormularioPartido(false);
    setMostrarFormularioAgregarPartido(false);
    await cargarParticipantes(partido.id_partido);
    setMensajeAgregarParticipante(""); // Limpiar mensaje al abrir
    setBusquedaJugadorAdd(""); // Limpiar búsqueda de jugador para agregar
    setResultadosBusquedaJugador([]); // Limpiar resultados
  };

  const cargarParticipantes = async (idPartido) => {
    setCargandoParticipantes(true);
    setMensajeParticipantes("");
    try {
      const res = await fetch(`http://localhost:3000/api/partidos/${idPartido}/participantes`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al cargar participantes.");
      }
      const data = await res.json();
      setParticipacionesPartido(data);
      if (data.length === 0) {
        setMensajeParticipantes("No hay participantes registrados para este partido.");
      }
    } catch (error) {
      setMensajeParticipantes(`Error al cargar participantes: ${error.message}`);
    } finally {
      setCargandoParticipantes(false);
    }
  };

  // Lógica de búsqueda de jugadores para añadir a un partido
  const realizarBusquedaJugador = async (termino) => {
    setMensajeBusquedaJugador("");
    setResultadosBusquedaJugador([]);
    setCargandoBusquedaJugador(true);

    if (!termino.trim()) {
      setCargandoBusquedaJugador(false);
      return;
    }

    try {
      // Ajusta la URL de tu API para buscar jugadores por DNI, nombre o apellido
      const res = await fetch(`http://localhost:3000/api/jugadores/buscar?query=${encodeURIComponent(termino)}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al buscar jugadores.");
      }
      const data = await res.json();
      if (data.length === 0) {
        setMensajeBusquedaJugador("No se encontraron jugadores con ese criterio.");
      }
      setResultadosBusquedaJugador(data);
    } catch (error) {
      setMensajeBusquedaJugador(`Error al buscar jugadores: ${error.message}`);
    } finally {
      setCargandoBusquedaJugador(false);
    }
  };

  // Efecto para debounce en la búsqueda de jugadores para agregar
  useEffect(() => {
    if (tiempoEsperaJugadoresRef.current) {
      clearTimeout(tiempoEsperaJugadoresRef.current);
    }
    tiempoEsperaJugadoresRef.current = setTimeout(() => {
      realizarBusquedaJugador(busquedaJugadorAdd);
    }, 500);

    return () => {
      if (tiempoEsperaJugadoresRef.current) {
        clearTimeout(tiempoEsperaJugadoresRef.current);
      }
    };
  }, [busquedaJugadorAdd]);


  const handleAgregarParticipante = async (jugadorId) => {
    if (!partidoSeleccionado || !jugadorId) return;

    setCargandoAgregarParticipante(true);
    setMensajeAgregarParticipante("");

    // Verificar si el jugador ya está en la lista de participantes
    const jugadorYaAgregado = participacionesPartido.some(
      (p) => p.id_jugador === jugadorId
    );
    if (jugadorYaAgregado) {
      setMensajeAgregarParticipante("Este jugador ya ha sido agregado a este partido.");
      setCargandoAgregarParticipante(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/partidos/${partidoSeleccionado.id_partido}/participantes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_jugador: jugadorId }), // Aquí es donde puedes agregar un `rol` si tu backend lo acepta
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Error al agregar participante: ${errorData.message || res.statusText}`);
      }

      setMensajeAgregarParticipante("Participante agregado exitosamente.");
      setBusquedaJugadorAdd(""); // Limpiar búsqueda
      setResultadosBusquedaJugador([]); // Limpiar resultados de búsqueda de jugador
      await cargarParticipantes(partidoSeleccionado.id_partido); // Recargar la lista de participantes
    } catch (error) {
      console.error("Error al agregar participante:", error);
      setMensajeAgregarParticipante(`Error: ${error.message}`);
    } finally {
      setCargandoAgregarParticipante(false);
    }
  };

  const handleEliminarParticipante = async (idParticipacion) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar a este participante del partido?")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/participaciones/${idParticipacion}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Error al eliminar participante: ${errorData.message || res.statusText}`);
      }

      setMensajeParticipantes("Participante eliminado exitosamente.");
      await cargarParticipantes(partidoSeleccionado.id_partido); // Recargar la lista
    } catch (error) {
      console.error("Error al eliminar participante:", error);
      setMensajeParticipantes(`Error al eliminar participante: ${error.message}`);
    }
  };

  // Función de ayuda para renderizar la etiqueta y el color del estado del partido (Mantenido para filtros)
  const renderizarEstadoPartido = (estado) => {
    let textoEstado = estado;
    let claseEstado = "text-gray-700 font-semibold";

    switch (estado) {
      case "Jugado":
        claseEstado = "text-green-700 font-semibold";
        break;
      case "Pendiente":
        claseEstado = "text-orange-700 font-semibold";
        break;
      case "Cancelado":
        claseEstado = "text-red-700 font-semibold";
        break;
      default:
        break;
    }
    return <span className={claseEstado}>{textoEstado}</span>;
  };

  const clasesInput = "mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm";
  const clasesLabel = "block text-sm font-medium text-gray-700";

  // Determinar el color de fondo para el select de estado de partido (Mantenido para filtros)
  const claseFondoSelectEstado = filtrosBusqueda.estadoPartido === "Jugado"
    ? "bg-green-100 border-green-300 focus:ring-green-500 focus:border-green-500"
    : filtrosBusqueda.estadoPartido === "Pendiente"
      ? "bg-orange-100 border-orange-300 focus:ring-orange-500 focus:border-orange-500"
      : filtrosBusqueda.estadoPartido === "Cancelado"
        ? "bg-red-100 border-red-300 focus:ring-red-500 focus:border-red-500"
        : "bg-gray-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500";


  return (
    <Layout>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center drop-shadow-md">Gestión de Partidos</h1>

      {/* Contenedor principal de la gestión de partidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Columna Izquierda - Agregar Partido / Gestión de Participantes */}
        <div className="space-y-8">
          {/* Sección AGREGAR PARTIDO */}
          <div className="p-6 bg-white shadow-xl rounded-lg border-t-4 border-blue-500">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-between">
              <span>Agregar Partido</span>
              <button
                onClick={() => {
                  setMostrarFormularioAgregarPartido(!mostrarFormularioAgregarPartido);
                  setMensajeAgregarPartido("");
                  setNuevoPartido({
                    fecha: "", hora: "", equipo_local: "", equipo_rival: "",
                    ubicacion: "", observaciones: ""
                  });
                  // Asegurar que otros formularios estén cerrados
                  setMostrarFormularioPartido(false);
                  setMostrarParticipantes(false);
                }}
                className="p-1 rounded-full text-gray-400 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-expanded={mostrarFormularioAgregarPartido}
                aria-controls="form-agregar-partido"
              >
                <svg className={`h-6 w-6 transform transition-transform ${mostrarFormularioAgregarPartido ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
            </h2>

            {mostrarFormularioAgregarPartido && (
              <form id="form-agregar-partido" onSubmit={handleAgregarNuevoPartido} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="fecha_nuevo" className={clasesLabel}>Fecha</label>
                    <input
                      type="date"
                      name="fecha"
                      id="fecha_nuevo"
                      value={nuevoPartido.fecha}
                      onChange={handleChangeNuevoPartido}
                      className={clasesInput}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="hora_nuevo" className={clasesLabel}>Hora</label>
                    <input
                      type="time"
                      name="hora"
                      id="hora_nuevo"
                      value={nuevoPartido.hora}
                      onChange={handleChangeNuevoPartido}
                      className={clasesInput}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="equipo_local_nuevo" className={clasesLabel}>Nombre del Equipo Local</label>
                    <input
                      type="text" // Cambiado a text
                      name="equipo_local" // Cambiado de _id
                      id="equipo_local_nuevo"
                      value={nuevoPartido.equipo_local}
                      onChange={handleChangeNuevoPartido}
                      className={clasesInput}
                      placeholder="Ej: River Plate"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="equipo_rival_nuevo" className={clasesLabel}>Nombre del Equipo Rival</label>
                    <input
                      type="text" // Cambiado a text
                      name="equipo_rival" // Cambiado de _id
                      id="equipo_rival_nuevo"
                      value={nuevoPartido.equipo_rival}
                      onChange={handleChangeNuevoPartido}
                      className={clasesInput}
                      placeholder="Ej: Boca Juniors"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="ubicacion_nuevo" className={clasesLabel}>Ubicación</label>
                    <input
                      type="text"
                      name="ubicacion" // Cambiado de 'torneo' a 'ubicacion'
                      id="ubicacion_nuevo"
                      value={nuevoPartido.ubicacion}
                      onChange={handleChangeNuevoPartido}
                      className={clasesInput}
                      placeholder="Ej: Estadio Monumental"
                      maxLength="100"
                      required // Una ubicación es esencial
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="observaciones_nuevo" className={clasesLabel}>Observaciones</label>
                  <textarea
                    name="observaciones"
                    id="observaciones_nuevo"
                    value={nuevoPartido.observaciones}
                    onChange={handleChangeNuevoPartido}
                    rows="2"
                    className={`${clasesInput} resize-y`}
                    maxLength="500"
                  ></textarea>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    disabled={estaAgregandoPartido}
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {estaAgregandoPartido ? "Agregando..." : "Agregar Partido"}
                  </button>
                </div>
                {mensajeAgregarPartido && (
                  <div className={`mt-4 p-3 rounded-md text-center ${mensajeAgregarPartido.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                    {mensajeAgregarPartido}
                  </div>
                )}
              </form>
            )}
          </div>

          {/* Sección GESTIÓN DE PARTICIPANTES DEL PARTIDO */}
          {partidoSeleccionado && mostrarParticipantes && (
            <div className="p-6 bg-white shadow-xl rounded-lg border-t-4 border-green-500">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Participantes del Partido: <span className="text-blue-700">{partidoSeleccionado.equipo_local} vs {partidoSeleccionado.equipo_rival}</span>
                <p className="text-sm font-normal text-gray-500">Fecha: {new Date(partidoSeleccionado.fecha).toLocaleDateString()} - Hora: {partidoSeleccionado.hora}</p>
              </h2>

              <div className="mb-4">
                <label htmlFor="busqueda_jugador_add" className={clasesLabel}>Buscar y Agregar Jugador</label>
                <input
                  type="text"
                  id="busqueda_jugador_add"
                  value={busquedaJugadorAdd}
                  onChange={(e) => setBusquedaJugadorAdd(e.target.value)}
                  className={clasesInput}
                  placeholder="Buscar jugador por DNI, nombre o apellido..."
                />
                {cargandoBusquedaJugador && <p className="text-gray-600 mt-2">Buscando jugadores...</p>}
                {mensajeBusquedaJugador && <p className="text-red-700 mt-2">{mensajeBusquedaJugador}</p>}

                {resultadosBusquedaJugador.length > 0 && (
                  <ul className="mt-2 border border-gray-300 rounded-md max-h-48 overflow-y-auto bg-white shadow-sm">
                    {resultadosBusquedaJugador.map((jugador) => (
                      <li key={jugador.id_jugador} className="flex justify-between items-center p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                        <span>{jugador.nombre} {jugador.apellido} (DNI: {jugador.dni})</span>
                        <button
                          onClick={() => handleAgregarParticipante(jugador.id_jugador)}
                          disabled={cargandoAgregarParticipante || participacionesPartido.some(p => p.id_jugador === jugador.id_jugador)}
                          className="px-4 py-1 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
                        >
                          {cargandoAgregarParticipante ? "Agregando..." : "Agregar"}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {mensajeAgregarParticipante && (
                <div className={`mt-4 p-3 rounded-md text-center ${mensajeAgregarParticipante.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                  {mensajeAgregarParticipante}
                </div>
              )}

              <h3 className="text-xl font-bold text-gray-700 mt-6 mb-3">Listado Actual de Participantes:</h3>
              {cargandoParticipantes ? (
                <p className="text-gray-600">Cargando participantes...</p>
              ) : mensajeParticipantes && participacionesPartido.length === 0 ? (
                <p className="text-gray-600">{mensajeParticipantes}</p>
              ) : (
                <ul className="space-y-2 max-h-96 overflow-y-auto">
                  {participacionesPartido.map((participacion) => (
                    <li key={participacion.id_participacion} className="flex justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded-md shadow-sm">
                      <span className="font-medium text-gray-800">{participacion.jugador_nombre} {participacion.jugador_apellido} (DNI: {participacion.jugador_dni})</span>
                      <button
                        onClick={() => handleEliminarParticipante(participacion.id_participacion)}
                        className="px-3 py-1 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
                      >
                        Eliminar
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Columna Derecha - Búsqueda de Partidos y Detalles/Edición de Partido */}
        <div className="space-y-8">
          {/* Sección BUSCADOR DE PARTIDOS */}
          <div className="p-6 bg-white shadow-xl rounded-lg border-t-4 border-indigo-500">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Buscar Partidos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fecha_filtro" className={clasesLabel}>Fecha</label>
                <input
                  type="date"
                  name="fecha"
                  id="fecha_filtro"
                  value={filtrosBusqueda.fecha}
                  onChange={handleChangeFiltroBusqueda}
                  className={clasesInput}
                />
              </div>
              <div>
                <label htmlFor="equipoLocal_filtro" className={clasesLabel}>Equipo Local</label>
                <input
                  type="text"
                  name="equipoLocal"
                  id="equipoLocal_filtro"
                  value={filtrosBusqueda.equipoLocal}
                  onChange={handleChangeFiltroBusqueda}
                  className={clasesInput}
                  placeholder="Ej: River Plate"
                />
              </div>
              <div>
                <label htmlFor="equipoRival_filtro" className={clasesLabel}>Equipo Rival</label>
                <input
                  type="text"
                  name="equipoRival"
                  id="equipoRival_filtro"
                  value={filtrosBusqueda.equipoRival}
                  onChange={handleChangeFiltroBusqueda}
                  className={clasesInput}
                  placeholder="Ej: Boca Juniors"
                />
              </div>
              <div>
                <label htmlFor="ubicacion_filtro" className={clasesLabel}>Ubicación</label>
                <input
                  type="text"
                  name="ubicacion"
                  id="ubicacion_filtro"
                  value={filtrosBusqueda.ubicacion}
                  onChange={handleChangeFiltroBusqueda}
                  className={clasesInput}
                  placeholder="Ej: Estadio Monumental"
                />
              </div>
              <div>
                <label htmlFor="estadoPartido_filtro" className={clasesLabel}>Estado del Partido</label>
                <select
                  name="estadoPartido"
                  id="estadoPartido_filtro"
                  value={filtrosBusqueda.estadoPartido}
                  onChange={handleChangeFiltroBusqueda}
                  className={`${clasesInput} ${claseFondoSelectEstado}`}
                >
                  <option value="">Todos</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Jugado">Jugado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
            </div>

            {/* <div className="flex justify-end mt-6">
              <button
                onClick={realizarBusqueda}
                disabled={cargandoBusqueda}
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cargandoBusqueda ? "Buscando..." : "Buscar Partidos"}
              </button>
            </div> */}

            {cargandoBusqueda && <p className="text-center text-indigo-600 mt-4">Cargando resultados...</p>}
            {mensajeBusqueda && <p className="text-center text-red-700 mt-4">{mensajeBusqueda}</p>}

            {resultadosBusqueda.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Resultados de la Búsqueda:</h3>
                <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {resultadosBusqueda.map((partido) => (
                    <li key={partido.id_partido} className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <div className="flex-grow mb-2 sm:mb-0">
                        <p className="text-lg font-semibold text-gray-900">{partido.equipo_local} vs {partido.equipo_rival}</p>
                        <p className="text-sm text-gray-600">Fecha: {new Date(partido.fecha).toLocaleDateString()} - Hora: {partido.hora}</p>
                        <p className="text-sm text-gray-600">Ubicación: {partido.ubicacion}</p>
                        <p className="text-sm text-gray-600">Estado: {renderizarEstadoPartido(partido.estado_partido || "Pendiente")}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <button
                          onClick={() => handleSeleccionarPartidoParaEditar(partido)}
                          className="px-4 py-2 bg-yellow-500 text-white text-sm font-semibold rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition duration-150 ease-in-out"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleGestionarParticipantes(partido)}
                          className="px-4 py-2 bg-teal-500 text-white text-sm font-semibold rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out"
                        >
                          Participantes
                        </button>
                        <button
                          onClick={() => handleEliminarPartido(partido.id_partido)}
                          className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
                        >
                          Eliminar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sección EDITAR DETALLES DEL PARTIDO */}
          {partidoSeleccionado && mostrarFormularioPartido && (
            <div className="p-6 bg-white shadow-xl rounded-lg border-t-4 border-yellow-500">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Editar Partido: <span className="text-blue-700">{partidoSeleccionado.equipo_local} vs {partidoSeleccionado.equipo_rival}</span></h2>
              <form onSubmit={handleActualizarPartido} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fecha_edit" className={clasesLabel}>Fecha</label>
                    <input
                      type="date"
                      name="fecha"
                      id="fecha_edit"
                      value={formularioPartido.fecha}
                      onChange={handleChangeFormularioPartido}
                      className={clasesInput}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="hora_edit" className={clasesLabel}>Hora</label>
                    <input
                      type="time"
                      name="hora"
                      id="hora_edit"
                      value={formularioPartido.hora}
                      onChange={handleChangeFormularioPartido}
                      className={clasesInput}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="equipo_local_edit" className={clasesLabel}>Nombre del Equipo Local</label>
                    <input
                      type="text"
                      name="equipo_local"
                      id="equipo_local_edit"
                      value={formularioPartido.equipo_local}
                      onChange={handleChangeFormularioPartido}
                      className={clasesInput}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="equipo_rival_edit" className={clasesLabel}>Nombre del Equipo Rival</label>
                    <input
                      type="text"
                      name="equipo_rival"
                      id="equipo_rival_edit"
                      value={formularioPartido.equipo_rival}
                      onChange={handleChangeFormularioPartido}
                      className={clasesInput}
                      required
                    />
                  </div>
                  {/* Nuevos campos para resultados y estado */}
                  <div>
                    <label htmlFor="ubicacion_edit" className={clasesLabel}>Ubicación</label>
                    <input
                      type="text"
                      name="ubicacion"
                      id="ubicacion_edit"
                      value={formularioPartido.ubicacion}
                      onChange={handleChangeFormularioPartido}
                      className={clasesInput}
                      required
                    />
                  </div>
                  {/* ELIMINADO: Campos de resultados y estado */}
                  {/* <div>
                    <label htmlFor="resultado_local_edit" className={clasesLabel}>Resultado Local</label>
                    <input
                      type="number"
                      name="resultado_local"
                      id="resultado_local_edit"
                      value={formularioPartido.resultado_local}
                      onChange={handleChangeFormularioPartido}
                      className={clasesInput}
                      min="0"
                    />
                  </div>
                  <div>
                    <label htmlFor="resultado_visitante_edit" className={clasesLabel}>Resultado Visitante</label>
                    <input
                      type="number"
                      name="resultado_visitante"
                      id="resultado_visitante_edit"
                      value={formularioPartido.resultado_visitante}
                      onChange={handleChangeFormularioPartido}
                      className={clasesInput}
                      min="0"
                    />
                  </div>
                  <div>
                    <label htmlFor="estado_partido_edit" className={clasesLabel}>Estado del Partido</label>
                    <select
                      name="estado_partido"
                      id="estado_partido_edit"
                      value={formularioPartido.estado_partido}
                      onChange={handleChangeFormularioPartido}
                      className={clasesInput}
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Jugado">Jugado</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </div> */}
                </div>
                <div>
                  <label htmlFor="observaciones_edit" className={clasesLabel}>Observaciones</label>
                  <textarea
                    name="observaciones"
                    id="observaciones_edit"
                    value={formularioPartido.observaciones}
                    onChange={handleChangeFormularioPartido}
                    rows="3"
                    className={`${clasesInput} resize-y`}
                    maxLength="500"
                  ></textarea>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    disabled={estaActualizandoPartido}
                    className="px-6 py-2 bg-yellow-600 text-white font-semibold rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {estaActualizandoPartido ? "Actualizando..." : "Actualizar Partido"}
                  </button>
                </div>
                {mensajeActualizacionPartido && (
                  <div className={`mt-4 p-3 rounded-md text-center ${mensajeActualizacionPartido.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                    {mensajeActualizacionPartido}
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default GestionPartidos;