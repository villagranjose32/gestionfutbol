import React from "react";
import userIcon from "../assets/icons/user-solid-white.svg";

const NavBar = () => (
  <nav className="w-full flex items-center justify-between bg-gray-900 px-6 py-3 text-white">
    <div className="flex items-center gap-3">
      <img src="/logo-club.png" alt="Escudo del Club" className="w-12 h-12" />
      <span className="text-lg text-white font-semibold">Gestión Juveniles</span>
    </div>
    <img src={userIcon} alt="Usuario" className="w-5 h-5" />
  </nav>
);

export default NavBar;