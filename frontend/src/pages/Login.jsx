import React from "react";
import cancha from "../assets/img/cancha-cacc.jpg";
import LoginForm from "../components/LoginForm";

const Login = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar el login
  };

  return (
    <div className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden">
      {/* Fondo borroso */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-md"
        style={{ backgroundImage: `url(${cancha})` }}
        aria-hidden="true"
      ></div>
      {/* Panel de login */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
        <img src="/logo-club.png" alt="Escudo del Club" className="w-44 mb-5" />
        <h1 className="mb-2 text-xl font-bold">
          Gestión Juveniles C.A.C.C.
        </h1>
        <h2 className="mb-5 text-2xl font-semibold text-red-900">
          Iniciar Sesión
        </h2>
        <LoginForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default Login;