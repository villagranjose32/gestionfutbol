import React from "react";
import userIcon from "../assets/icons/user-solid-white.svg";
import menuIcon from "../assets/icons/bars-solid.svg"; // <--- ¡Importante! Asegúrate de que este archivo exista

// Recibe la función 'toggleSidebar' como prop desde Layout.jsx
const NavBar = ({ toggleSidebar }) => (
  // Agregamos md:ml-64 para que la Navbar también se desplace en pantallas de escritorio
  // cuando el Sidebar está visible y es estático (para que no se superponga con el sidebar).
  <nav className="w-full flex items-center justify-between bg-gray-900 px-6 py-3 text-white md:ml-64">
    {/* Botón de hamburguesa: visible solo en móviles (md:hidden) */}
    <button
      onClick={toggleSidebar} // Al hacer clic, llama a la función para abrir/cerrar el Sidebar
      className="md:hidden text-white focus:outline-none mr-4" // Clases de Tailwind para estilo y margen
    >
      <img src={menuIcon} alt="Menu" className="w-6 h-6" />
    </button>

    <div className="flex items-center gap-3">
      <img src="/logo-club.png" alt="Escudo del Club" className="w-12 h-12" />
      <span className="text-lg text-white font-semibold">Gestión Juveniles</span>
    </div>
    <img src={userIcon} alt="Usuario" className="w-5 h-5" />
  </nav>
);

export default NavBar;