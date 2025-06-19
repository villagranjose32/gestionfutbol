import React from "react";
import { NavLink } from "react-router-dom";
import masIcon from "../assets/icons/plus-solid.svg";
import houseIcon from "../assets/icons/house-solid.svg";
import peopleIcon from "../assets/icons/people-solid.svg";
import planeIcon from "../assets/icons/plane-departure-solid.svg";
import calendarIcon from "../assets/icons/calendar-days-solid.svg";
import dumbbellIcon from "../assets/icons/dumbbell-solid.svg";
import logOutIcon from "../assets/icons/log-out-solid.svg";
import closeIcon from "../assets/icons/xmark-solid.svg"; // <-- ¡Asegúrate de que esta ruta sea correcta para tu icono de cerrar!

// Asegúrate de pasar `isOpen` y `toggle` como props
const SideBar = ({ isOpen, toggle }) => {
  return (
    <aside
      className={`
        fixed inset-y-0 left-0 // Fija la posición en la pantalla
        w-64 h-screen // Ancho fijo y altura completa
        bg-white shadow-lg py-8 // Estilos de fondo y sombra
        z-40 // Asegura que esté por encima de otros elementos

        // Transiciones para la animación de deslizamiento
        transform transition-transform duration-300 ease-in-out 
        
        // Comportamiento responsivo:
        // En móvil (pantallas menores a md):
        ${isOpen ? "translate-x-0" : "-translate-x-full"} // Se desliza si está abierto, se oculta si no
        
        // En escritorio (md y superior):
        md:static // Vuelve a la posición estática en el flujo del documento
        md:translate-x-0 // Asegura que siempre esté visible en desktop
        md:flex md:flex-col // Para que el contenido interno se organice en columna en desktop
      `}
    >
      <nav className="w-full px-4 h-[100%] relative">
        {/* Botón de cerrar para el menú en móviles (oculto en desktop) */}
        <button
          onClick={toggle}
          className="absolute top-4 right-4 md:hidden text-gray-800 focus:outline-none"
        >
          <img src={closeIcon} alt="Cerrar" className="w-6 h-6" />
        </button>

        {/* Tus NavLinks (el contenido del menú) */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex px-4 py-2 rounded font-medium transition-colors ${isActive
              ? "bg-red-800 text-white"
              : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <img src={houseIcon} alt="House" className="mr-3 w-5 h-5" />
          Panel Principal
        </NavLink>

        <NavLink
          to="/registrar-jugador"
          className={({ isActive }) =>
            `flex px-4 py-2 rounded font-medium transition-colors ${isActive
              ? "bg-red-800 text-white"
              : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <img src={masIcon} alt="Usuario" className="mr-3 w-5 h-5" />
          Registrar Jugador
        </NavLink>

        <NavLink
          to="/buscar-jugador"
          className={({ isActive }) =>
            `flex px-4 py-2 rounded font-medium transition-colors ${isActive
              ? "bg-red-800 text-white"
              : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <img src={peopleIcon} alt="Buscar" className="mr-3 w-5 h-5" />
          Buscar Jugador
        </NavLink>

        {/* ENLACE PARA GESTIÓN DE PARTIDO */}
        <NavLink
          to="/partido-gestion"
          className={({ isActive }) =>
            `flex px-4 py-2 rounded font-medium transition-colors ${isActive
              ? "bg-red-800 text-white"
              : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <img src={calendarIcon} alt="Gestión Partido" className="mr-3 w-5 h-5" />
          Gestión de Partido
        </NavLink>
        {/* FIN ENLACE GESTIÓN DE PARTIDO */}

        <NavLink
          to="/viajes"
          className={({ isActive }) =>
            `flex px-4 py-2 rounded font-medium transition-colors ${isActive
              ? "bg-red-800 text-white"
              : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <img src={planeIcon} alt="Avión" className="mr-3 w-5 h-5" />
          Viajes
        </NavLink>

        <NavLink
          to="/citas-medicas"
          className={({ isActive }) =>
            `flex px-4 py-2 rounded font-medium transition-colors ${isActive
              ? "bg-red-800 text-white"
              : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <img src={calendarIcon} alt="Calendario" className="mr-3 w-5 h-5" />
          Citas Médicas
        </NavLink>

        <NavLink
          to="/estadisticas"
          className={({ isActive }) =>
            `flex px-4 py-2 rounded font-medium transition-colors ${isActive
              ? "bg-red-800 text-white"
              : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <img src={dumbbellIcon} alt="Dumbbell" className="mr-3 w-5 h-5" />
          Estadísticas
        </NavLink>

        <NavLink to="/login" className="flex px-4 py-2 center items-center">
          <img src={logOutIcon} alt="Log-out" className="mr-3 w-5 h-5" />
          Cerrar Sesión
        </NavLink>
      </nav>
    </aside>
  );
};

export default SideBar;