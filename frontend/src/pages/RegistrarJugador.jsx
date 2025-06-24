import React, { useState } from "react";
import Layout from "../components/Layout";

// Reusable CollapsibleSection Component
const CollapsibleSection = ({ title, children, isOpen, toggle, titleClasses = "" }) => {
  return (
    <div className="border border-gray-200 rounded-md shadow-sm">
      <button
        type="button"
        // CAMBIO AQUÍ: Fondo gris, texto oscuro y anillo de enfoque gris/azul
        className={`flex justify-between items-center w-full p-4 text-lg font-semibold text-gray-800 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-t-md transition duration-300 ease-in-out ${titleClasses}`}
        onClick={toggle}
      >
        {title}
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>
      {isOpen && <div className="p-4 border-t border-gray-200">{children}</div>}
    </div>
  );
};

const RegistrarJugador = () => {
  const [jugador, setJugador] = useState({
    dni: "",
    nombre: "",
    apellido: "",
    direccion: "",
    posicion: "",
    fecha_nacimiento: "",
    nro_afiliado: "",
    obra_social: "",
    pierna_habil: "",
    categoria: "",
    contacto: "",
    tutor_uno: "",
    tel_tutor_uno: "",
    tutor_dos: "",
    tel_tutor_dos: "",
    // Eliminamos fecha_alta y fecha_baja de aquí para que no estén en el formulario
    //motivo_baja: "", // Se mantiene solo para el caso de dar de baja
    estado: "Alta", // Nuevo estado para controlar si el jugador se registra como 'Alta' o 'Baja'
  });

  // Changed datosFisicos to an array to store multiple entries
  const [datosFisicosList, setDatosFisicosList] = useState([]);
  const [currentDatosFisicos, setCurrentDatosFisicos] = useState({
    altura: "",
    peso: "",
    observaciones: "",
  });

  const [fichaSocial, setFichaSocial] = useState({
    fecha_ficha: "",
    situacion_social: "",
    gestionado_por: "",
    archivo: "",
  });

  const [fichaMedica, setFichaMedica] = useState({
    diagnostico: "",
    fecha_inicio: "",
    fecha_fin: "",
    observaciones_medicas: "",
    archivo_medico: "",
  });

  const [openSections, setOpenSections] = useState({
    personalData: true,
    medicalInfo: false,
    emergencyContacts: false,
    playerStatus: false, // Mantener para la sección de estado
    physicalData: false,
    socialFile: false,
  });

  const [mensaje, setMensaje] = useState("");

  const handleJugadorChange = (e) => {
    setJugador({ ...jugador, [e.target.name]: e.target.value });
  };

  // Nuevo manejador para el estado (radio buttons)
  const handleEstadoChange = (e) => {
    setJugador((prevJugador) => ({
      ...prevJugador,
      estado: e.target.value,
      // Si se da de alta, limpiar el motivo de baja
      motivo_baja: e.target.value === "Alta" ? "" : prevJugador.motivo_baja,
    }));
  };

  const handleCurrentDatosFisicosChange = (e) => {
    setCurrentDatosFisicos({ ...currentDatosFisicos, [e.target.name]: e.target.value });
  };

  const handleAddDatosFisicos = () => {
    if (currentDatosFisicos.altura && currentDatosFisicos.peso) {
      setDatosFisicosList((prevList) => [
        ...prevList,
        { ...currentDatosFisicos, fecha_registro: new Date().toISOString().split('T')[0] }, // Auto-set date
      ]);
      setCurrentDatosFisicos({
        altura: "",
        peso: "",
        velocidad: "",
        observaciones: "",
      });
    } else {
      setMensaje("Por favor, ingresa Altura y Peso antes de agregar.");
    }
  };

  const handleFichaSocialChange = (e) => {
    setFichaSocial({ ...fichaSocial, [e.target.name]: e.target.value });
  };

  const handleFichaMedicaChange = (e) => {
    setFichaMedica({ ...fichaMedica, [e.target.name]: e.target.value });
  };

  const toggleSection = (sectionName) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      // Prepara los datos del jugador para el envío
      const jugadorParaEnvio = { ...jugador };
      // Asigna fecha_alta automáticamente al registrar
      jugadorParaEnvio.fecha_alta = new Date().toISOString().split('T')[0]; // Fecha actual
      // Si el estado es "Baja", asigna fecha_baja; de lo contrario, null
      jugadorParaEnvio.fecha_baja = jugador.estado === "Baja" ? new Date().toISOString().split('T')[0] : null;

      // Eliminar el campo 'estado' del objeto que se enviará a la API del jugador
      // Ya que 'estado' es un control de UI y no un campo de base de datos directo
      delete jugadorParaEnvio.estado;


      // 1. Registrar jugador
      const resJugador = await fetch("http://localhost:3000/api/jugadores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jugadorParaEnvio), // Usar el objeto preparado
      });

      if (!resJugador.ok) {
        const errorData = await resJugador.json();
        throw new Error(`Error al registrar jugador: ${errorData.message || resJugador.statusText}`);
      }

      const jugadorCreado = await resJugador.json();
      console.log("Jugador creado:", jugadorCreado);

      if (!jugadorCreado.jugador || !jugadorCreado.jugador.id_jugador) {
        throw new Error("No se pudo obtener el ID del jugador creado.");
      }
      const idJugador = jugadorCreado.jugador.id_jugador;

      // 2. Registrar datos físicos con el id_jugador devuelto (iterate through datosFisicosList)
      for (const datosFisicos of datosFisicosList) {
        const resDatosFisicos = await fetch("http://localhost:3000/api/datos_fisicos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...datosFisicos,
            id_jugador: idJugador,
          }),
        });

        if (!resDatosFisicos.ok) {
          const errorData = await resDatosFisicos.json();
          throw new Error(`Error al registrar datos físicos: ${errorData.message || resDatosFisicos.statusText}`);
        }
        console.log("Datos físicos registrados.");
      }


      // 3. Registrar Ficha Social con el id_jugador devuelto
      const resFichaSocial = await fetch("http://localhost:3000/api/fichas_sociales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fichaSocial,
          id_jugador: idJugador,
        }),
      });

      if (!resFichaSocial.ok) {
        const errorData = await resFichaSocial.json();
        throw new Error(`Error al registrar ficha social: ${errorData.message || resFichaSocial.statusText}`);
      }
      console.log("Ficha social registrada.");

      // 4. Registrar Ficha Médica con el id_jugador devuelto
      const resFichaMedica = await fetch("http://localhost:3000/api/fichas_medicas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fichaMedica,
          id_jugador: idJugador,
        }),
      });

      if (!resFichaMedica.ok) {
        const errorData = await resFichaMedica.json();
        throw new Error(`Error al registrar ficha médica: ${errorData.message || resFichaMedica.statusText}`);
      }
      console.log("Ficha médica registrada.");

      setMensaje("¡Jugador, datos físicos, ficha social y ficha médica registrados correctamente!");
      // Reset form fields
      setJugador({
        dni: "",
        nombre: "",
        apellido: "",
        direccion: "",
        posicion: "",
        fecha_nacimiento: "",
        nro_afiliado: "",
        obra_social: "",
        pierna_habil: "",
        categoria: "",
        contacto: "",
        tutor_uno: "",
        tel_tutor_uno: "",
        tutor_dos: "",
        tel_tutor_dos: "",
        motivo_baja: "",
        estado: "Alta", // Restablecer a Alta por defecto
      });
      setDatosFisicosList([]); // Clear the list of physical data
      setCurrentDatosFisicos({ // Clear current physical data input
        altura: "",
        peso: "",
        velocidad: "",
        observaciones: "",
      });
      setFichaSocial({
        fecha_ficha: "",
        situacion_social: "",
        gestionado_por: "",
        archivo: "",
      });
      setFichaMedica({
        grupo_sanguineo: "",
        diagnostico: "",
        fecha_inicio: "",
        fecha_fin: "",
        observaciones_medicas: "",
        archivo_medico: "",
      });
      setOpenSections({
        personalData: true,
        medicalInfo: false,
        emergencyContacts: false,
        playerStatus: false,
        physicalData: false,
        socialFile: false,
      });
    } catch (error) {
      console.error("Error en el envío del formulario:", error);
      setMensaje(`Error: ${error.message || "Ocurrió un error inesperado."}`);
    }
  };

  const inputClasses = "mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm";
  const labelClasses = "block text-sm font-medium text-gray-700";

  // Determinar las clases de color para el título de la sección de estado
  const playerStatusTitleClasses = jugador.estado === "Alta"
    ? "bg-green-100 text-green-800"
    : jugador.estado === "Baja"
    ? "bg-red-100 text-red-800"
    : ""; // Por defecto si no hay selección (aunque siempre habrá una con radio buttons)


  return (
    <Layout>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Registrar Nuevo Jugador</h1>
      <form onSubmit={handleSubmit} className="space-y-8 p-6 bg-white shadow-lg rounded-lg">
        {/* Sección: Datos Personales (always open) */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Datos Personales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label htmlFor="dni" className={labelClasses}>DNI</label>
              <input type="text" name="dni" id="dni" value={jugador.dni} onChange={handleJugadorChange} className={inputClasses} maxLength="10" required />
            </div>
            <div>
              <label htmlFor="nombre" className={labelClasses}>Nombre</label>
              <input type="text" name="nombre" id="nombre" value={jugador.nombre} onChange={handleJugadorChange} className={inputClasses} maxLength="50" required />
            </div>
            <div>
              <label htmlFor="apellido" className={labelClasses}>Apellido</label>
              <input type="text" name="apellido" id="apellido" value={jugador.apellido} onChange={handleJugadorChange} className={inputClasses} maxLength="50" required />
            </div>
            <div>
              <label htmlFor="direccion" className={labelClasses}>Dirección</label>
              <input type="text" name="direccion" id="direccion" value={jugador.direccion} onChange={handleJugadorChange} className={inputClasses} maxLength="100" />
            </div>
            <div>
              <label htmlFor="posicion" className={labelClasses}>Posición</label>
              <input type="text" name="posicion" id="posicion" value={jugador.posicion} onChange={handleJugadorChange} className={inputClasses} maxLength="30" />
            </div>
            <div>
              <label htmlFor="fecha_nacimiento" className={labelClasses}>Fecha de Nacimiento</label>
              <input type="date" name="fecha_nacimiento" id="fecha_nacimiento" value={jugador.fecha_nacimiento} onChange={handleJugadorChange} className={inputClasses} />
            </div>
            <div>
              <label htmlFor="contacto" className={labelClasses}>Contacto (Teléfono/Email)</label>
              <input type="text" name="contacto" id="contacto" value={jugador.contacto} onChange={handleJugadorChange} className={inputClasses} maxLength="100" />
            </div>
            <div>
              <label htmlFor="categoria" className={labelClasses}>Categoría</label>
              <input type="text" name="categoria" id="categoria" value={jugador.categoria} onChange={handleJugadorChange} className={inputClasses} maxLength="30" />
            </div>
          </div>
        </div>

        {/* Sección: Ficha Médica (Collapsible) - Usando el nuevo estado fichaMedica */}
        <CollapsibleSection
          title="Ficha Médica"
          isOpen={openSections.medicalInfo}
          toggle={() => toggleSection("medicalInfo")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="grupo_sanguineo" className={labelClasses}>Grupo Sanguíneo</label>
              <input type="text" name="grupo_sanguineo" id="grupo_sanguineo" value={fichaMedica.grupo_sanguineo} onChange={handleFichaMedicaChange} className={inputClasses} maxLength="5" />
            </div>
            <div>
              <label htmlFor="diagnostico" className={labelClasses}>Diagnóstico</label>
              <input type="text" name="diagnostico" id="diagnostico" value={fichaMedica.diagnostico} onChange={handleFichaMedicaChange} className={inputClasses} maxLength="100" />
            </div>
            <div>
              <label htmlFor="fecha_inicio" className={labelClasses}>Fecha Inicio</label>
              <input type="date" name="fecha_inicio" id="fecha_inicio" value={fichaMedica.fecha_inicio} onChange={handleFichaMedicaChange} className={inputClasses} />
            </div>
            <div>
              <label htmlFor="fecha_fin" className={labelClasses}>Fecha Fin</label>
              <input type="date" name="fecha_fin" id="fecha_fin" value={fichaMedica.fecha_fin} onChange={handleFichaMedicaChange} className={inputClasses} />
            </div>
            <div className="md:col-span-2"> {/* Observaciones médicas puede ocupar dos columnas */}
              <label htmlFor="observaciones_medicas" className={labelClasses}>Observaciones Médicas</label>
              <textarea name="observaciones_medicas" id="observaciones_medicas" value={fichaMedica.observaciones_medicas} onChange={handleFichaMedicaChange} rows="3" className={`${inputClasses} resize-y`} maxLength="500"></textarea>
            </div>
            <div>
              <label htmlFor="archivo_medico" className={labelClasses}>Archivo Médico (URL o Nombre)</label>
              <input type="text" name="archivo_medico" id="archivo_medico" value={fichaMedica.archivo_medico} onChange={handleFichaMedicaChange} className={inputClasses} placeholder="Ej: informe_medico.pdf" maxLength="255" />
            </div>
          </div>
        </CollapsibleSection>

        {/* Sección: Contactos de Emergencia (Collapsible) */}
        <CollapsibleSection
          title="Contactos de Emergencia"
          isOpen={openSections.emergencyContacts}
          toggle={() => toggleSection("emergencyContacts")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="tutor_uno" className={labelClasses}>Nombre</label>
              <input type="text" name="tutor_uno" id="tutor_uno" value={jugador.tutor_uno} onChange={handleJugadorChange} className={inputClasses} maxLength="50" />
            </div>
            <div>
              <label htmlFor="tel_tutor_uno" className={labelClasses}>Telefono</label>
              <input type="text" name="tel_tutor_uno" id="tel_tutor_uno" value={jugador.tel_tutor_uno} onChange={handleJugadorChange} className={inputClasses} maxLength="20" />
            </div>
            <div>
              <label htmlFor="tutor_dos" className={labelClasses}>Nombre (Opcional)</label>
              <input type="text" name="tutor_dos" id="tutor_dos" value={jugador.tutor_dos} onChange={handleJugadorChange} className={inputClasses} maxLength="50" />
            </div>
            <div>
              <label htmlFor="tel_tutor_dos" className={labelClasses}>Telefono (Opcional)</label>
              <input type="text" name="tel_tutor_dos" id="tel_tutor_dos" value={jugador.tel_tutor_dos} onChange={handleJugadorChange} className={inputClasses} maxLength="20" />
            </div>
          </div>
        </CollapsibleSection>

        {/* Sección: Estado del Jugador (Collapsible) - MODIFICADA */}
        <CollapsibleSection
          title="Estado del Jugador"
          isOpen={openSections.playerStatus}
          toggle={() => toggleSection("playerStatus")}
          titleClasses={playerStatusTitleClasses} // Aplicar las clases de color aquí
        >
          <div className="flex items-center space-x-6">
            {/* Radio button para Dar de Alta */}
            <div className="flex items-center">
              <input
                type="radio"
                id="estado_alta"
                name="estado_jugador"
                value="Alta"
                checked={jugador.estado === "Alta"}
                onChange={handleEstadoChange}
                className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
              />
              <label htmlFor="estado_alta" className="ml-2 block text-sm font-medium text-gray-900">
                Dar de Alta
              </label>
            </div>

            {/* Radio button para Dar de Baja */}
            <div className="flex items-center">
              <input
                type="radio"
                id="estado_baja"
                name="estado_jugador"
                value="Baja"
                checked={jugador.estado === "Baja"}
                onChange={handleEstadoChange}
                className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
              />
              <label htmlFor="estado_baja" className="ml-2 block text-sm font-medium text-gray-900">
                Dar de Baja
              </label>
            </div>
          </div>

          {/* Campo para Motivo de Baja, solo visible si el estado es 'Baja' */}
          {jugador.estado === "Baja" && (
            <div className="mt-4">
              <label htmlFor="motivo_baja" className={labelClasses}>Motivo de Baja</label>
              <textarea
                name="motivo_baja"
                id="motivo_baja"
                value={jugador.motivo_baja}
                onChange={handleJugadorChange}
                rows="3"
                className={`${inputClasses} resize-y`}
                placeholder="Indique el motivo de la baja del jugador..."
                maxLength="500"
                required // Hacerlo requerido si se selecciona "Baja"
              ></textarea>
            </div>
          )}
        </CollapsibleSection>

        {/* Sección: Datos Físicos (Collapsible) - MODIFICADA */}
        <CollapsibleSection
          title="Datos Físicos"
          isOpen={openSections.physicalData}
          toggle={() => toggleSection("physicalData")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
            {/* REMOVED "Fecha de Registro" input */}
            <div>
              <label htmlFor="altura" className={labelClasses}>Altura (cm)</label>
              <input type="number" name="altura" id="altura" value={currentDatosFisicos.altura} onChange={handleCurrentDatosFisicosChange} className={inputClasses} placeholder="Ej: 175" maxLength="5" />
            </div>
            <div>
              <label htmlFor="peso" className={labelClasses}>Peso (kg)</label>
              <input type="number" name="peso" id="peso" value={currentDatosFisicos.peso} onChange={handleCurrentDatosFisicosChange} className={inputClasses} placeholder="Ej: 70" maxLength="5" />
            </div>
            <div>
              <label htmlFor="velocidad" className={labelClasses}>Velocidad (Ej: 100m en segundos)</label>
              <input type="text" name="velocidad" id="velocidad" value={currentDatosFisicos.velocidad} onChange={handleCurrentDatosFisicosChange} className={inputClasses} placeholder="Ej: 12.5" maxLength="10" />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <label htmlFor="observaciones" className={labelClasses}>Observaciones</label>
              <textarea name="observaciones" id="observaciones" value={currentDatosFisicos.observaciones} onChange={handleCurrentDatosFisicosChange} rows="3" className={`${inputClasses} resize-y`} maxLength="500"></textarea>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddDatosFisicos}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out"
          >
            Agregar Medida de Altura y Peso
          </button>

          {/* Display previously added physical data */}
          {datosFisicosList.length > 0 && (
            <div className="mt-6 border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Medidas Registradas:</h3>
              <ul className="list-disc list-inside space-y-2">
                {datosFisicosList.map((data, index) => (
                  <li key={index} className="text-gray-600">
                    Fecha: {data.fecha_registro} | Altura: {data.altura} cm | Peso: {data.peso} kg {data.velocidad && `| Velocidad: ${data.velocidad}`} {data.observaciones && `| Observaciones: ${data.observaciones}`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CollapsibleSection>

        {/* SECCIÓN: Ficha Social (Collapsible) */}
        <CollapsibleSection
          title="Ficha Social"
          isOpen={openSections.socialFile}
          toggle={() => toggleSection("socialFile")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fecha_ficha" className={labelClasses}>Fecha de Ficha Social</label>
              <input type="date" name="fecha_ficha" id="fecha_ficha" value={fichaSocial.fecha_ficha} onChange={handleFichaSocialChange} className={inputClasses} />
            </div>
            <div>
              <label htmlFor="gestionado_por" className={labelClasses}>Gestionado Por</label>
              <input type="text" name="gestionado_por" id="gestionado_por" value={fichaSocial.gestionado_por} onChange={handleFichaSocialChange} className={inputClasses} maxLength="100" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="situacion_social" className={labelClasses}>Situación Social</label>
              <textarea name="situacion_social" id="situacion_social" value={fichaSocial.situacion_social} onChange={handleFichaSocialChange} rows="3" className={`${inputClasses} resize-y`} maxLength="500"></textarea>
            </div>
            <div>
              <label htmlFor="archivo" className={labelClasses}>Archivo</label>
              <input type="text" name="archivo" id="archivo" value={fichaSocial.archivo} onChange={handleFichaSocialChange} className={inputClasses} placeholder="Ej: documento_juan_perez.pdf" maxLength="255" />
            </div>
          </div>
        </CollapsibleSection>

        <button
          type="submit"
          // Mantenido en rojo
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-300 ease-in-out"
        >
          Registrar Jugador
        </button>

        {mensaje && (
          <div className={`mt-4 p-3 rounded-md text-center ${mensaje.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {mensaje}
          </div>
        )}
      </form>
    </Layout>
  );
};

export default RegistrarJugador;