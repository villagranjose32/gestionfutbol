import React from "react";
import { NavLink } from "react-router-dom";
import masIcon from "../assets/icons/plus-solid.svg";
import houseIcon from "../assets/icons/house-solid.svg";
import peopleIcon from "../assets/icons/people-solid.svg";
import planeIcon from "../assets/icons/plane-departure-solid.svg";
import calendarIcon from "../assets/icons/calendar-days-solid.svg";
import dumbbellIcon from "../assets/icons/dumbbell-solid.svg";
import logOutIcon from "../assets/icons/log-out-solid.svg";

const SideBar = () => {
  return (
    <aside className="h-screen w-64 bg-white shadow-lg flex py-8">
      <nav className="w-full px-4 h-[100%]">
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

        {/* Enlace agregado */}
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

        <NavLink
          to="/jugadores"
          className={({ isActive }) =>
            `flex px-4 py-2 rounded font-medium transition-colors ${isActive
              ? "bg-red-800 text-white"
              : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <img src={peopleIcon} alt="Futbol" className="mr-3 w-5 h-5" />
          Jugadores
        </NavLink>

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
          to="/entrenamientos"
          className={({ isActive }) =>
            `flex px-4 py-2 rounded font-medium transition-colors ${isActive
              ? "bg-red-800 text-white"
              : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <img src={dumbbellIcon} alt="Dumbbell" className="mr-3 w-5 h-5" />
          Entrenamientos
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