import React, { useState } from "react";
import Layout from "../components/Layout"; // Asegúrate de que la ruta sea correcta para tu Layout

const RegistrarAspirante = () => {
  const [aspirante, setAspirante] = useState({
    nombre: "",
    apellido: "",
    provincia: "",
    localidad: "",
    dni: "",
    fecha_nacimiento: "",
    contacto: "", // Podría ser email o teléfono
    estado: "Pendiente", // Valor inicial para el select
  });
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false); // Para controlar el estado de envío
  const [errorDni, setErrorDni] = useState(""); // Estado para errores específicos del DNI

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAspirante({ ...aspirante, [name]: value });
    setMensaje(""); // Limpiar mensaje al cambiar cualquier campo
    if (name === "dni") {
      setErrorDni(""); // Limpiar error de DNI al cambiarlo
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setLoading(true);
    setErrorDni("");

    // Validación básica de DNI (ejemplo: 7 a 10 dígitos numéricos)
    if (!/^\d{7,10}$/.test(aspirante.dni)) {
      setErrorDni("El DNI debe contener entre 7 y 10 dígitos numéricos.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/aspirantes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aspirante),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al registrar aspirante");
      }

      setMensaje("¡Aspirante registrado correctamente!");
      // Limpiar el formulario después de un registro exitoso
      setAspirante({
        nombre: "",
        apellido: "",
        provincia: "",
        localidad: "",
        dni: "",
        fecha_nacimiento: "",
        contacto: "",
        estado: "Pendiente",
      });
    } catch (error) {
      setMensaje(`Error: ${error.message}`);
    } finally {
      setLoading(false); // Siempre resetear el estado de carga
    }
  };

  // Clases comunes para inputs y labels para un diseño consistente
  const inputClasses = "mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm";
  const labelClasses = "block text-sm font-medium text-gray-700";
  const buttonClasses = "w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out";

  return (
    <Layout>
      <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg my-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Registrar Aspirante</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre y Apellido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="nombre" className={labelClasses}>Nombre <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="nombre"
                id="nombre"
                value={aspirante.nombre}
                onChange={handleChange}
                placeholder="Ej: Juan"
                required
                maxLength="50"
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="apellido" className={labelClasses}>Apellido <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="apellido"
                id="apellido"
                value={aspirante.apellido}
                onChange={handleChange}
                placeholder="Ej: Pérez"
                required
                maxLength="50"
                className={inputClasses}
              />
            </div>
          </div>

          {/* DNI y Fecha de Nacimiento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="dni" className={labelClasses}>DNI <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="dni"
                id="dni"
                value={aspirante.dni}
                onChange={handleChange}
                placeholder="Ej: 30123456"
                required
                maxLength="10" // DNI en Argentina suele ser 7 u 8 dígitos, hasta 10 para extranjeros o formatos específicos
                className={`${inputClasses} ${errorDni ? 'border-red-500' : ''}`}
              />
              {errorDni && <p className="mt-1 text-sm text-red-600">{errorDni}</p>}
            </div>
            <div>
              <label htmlFor="fecha_nacimiento" className={labelClasses}>Fecha de Nacimiento</label>
              <input
                type="date"
                name="fecha_nacimiento"
                id="fecha_nacimiento"
                value={aspirante.fecha_nacimiento}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
          </div>

          {/* Contacto y Estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="contacto" className={labelClasses}>Contacto (Email o Teléfono)</label>
              <input
                type="text" // Podrías usar "email" o "tel" si quieres validación del navegador
                name="contacto"
                id="contacto"
                value={aspirante.contacto}
                onChange={handleChange}
                placeholder="Ej: juan.perez@example.com o 3854123456"
                maxLength="100"
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="estado" className={labelClasses}>Estado</label>
              <select
                name="estado"
                id="estado"
                value={aspirante.estado}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          {/* Provincia y Localidad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="provincia" className={labelClasses}>Provincia</label>
              <input
                type="text"
                name="provincia"
                id="provincia"
                value={aspirante.provincia}
                onChange={handleChange}
                placeholder="Ej: Santiago del Estero"
                maxLength="50"
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="localidad" className={labelClasses}>Localidad</label>
              <input
                type="text"
                name="localidad"
                id="localidad"
                value={aspirante.localidad}
                onChange={handleChange}
                placeholder="Ej: La Banda"
                maxLength="50"
                className={inputClasses}
              />
            </div>
          </div>

          {/* Botón de Envío */}
          <button
            type="submit"
            className={buttonClasses}
            disabled={loading} // Deshabilita el botón mientras se envía
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registrando...
              </>
            ) : (
              "Registrar Aspirante"
            )}
          </button>

          {/* Mensaje de Feedback */}
          {mensaje && (
            <div
              className={`mt-4 p-3 rounded-md text-center ${mensaje.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
              role="alert" // Añadido para accesibilidad
            >
              {mensaje}
            </div>
          )}
        </form>
      </div>
    </Layout>
  );
};

export default RegistrarAspirante;