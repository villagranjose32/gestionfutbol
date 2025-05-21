import React from "react";
import { useNavigate } from "react-router-dom";
import clave from "../assets/icons/key-solid.svg";
import userIcon from "../assets/icons/user-solid.svg";

const LoginForm = ({ onSubmit }) => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-4">
        <label
          htmlFor="username"
          className="flex gap-2  text-base mb-1 text-gray-700 text-left"
        ><img className="w-3" src={userIcon} alt="Usuario" />
          Usuario:
        </label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Ingresa tu usuario"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#a40000] text-base"
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="password"
          className="flex gap-2 text-base mb-1 text-gray-700 text-left"
        ><img className="w-3" src={clave} alt="Contraseña" />
          Contraseña:
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Ingresa tu contraseña"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#a40000] text-base"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-red-900 hover:bg-red-800 text-white py-2 rounded text-base font-medium transition-colors"
      >
        Ingresar
      </button>
    </form>
  );
};

export default LoginForm;