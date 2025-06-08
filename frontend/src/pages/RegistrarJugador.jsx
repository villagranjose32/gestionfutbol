import React, { useState } from "react";
import Layout from "../components/Layout";

const RegistrarJugador = () => {
  const [jugador, setJugador] = useState({
    dni: "",
    nombre: "",
    apellido: "",
    direccion: "",
    posicion: "",
    fecha_nacimiento: "",
    grupo_sanguineo: "",
    nro_afiliado: "",
    obra_social: "",
    pierna_habil: "",
    categoria: "",
    contacto: "",
    tutor_uno: "",
    tel_tutor_uno: "",
    tutor_dos: "",
    tel_tutor_dos: "",
    fecha_alta: "",
    fecha_baja: "",
    motivo_baja: "",
  });

  const [datosFisicos, setDatosFisicos] = useState({
    fecha_registro: "",
    altura: "",
    peso: "",
    velocidad: "",
    observaciones: "",
  });

  const [mensaje, setMensaje] = useState("");

  const handleJugadorChange = (e) => {
    setJugador({ ...jugador, [e.target.name]: e.target.value });
  };

  const handleDatosFisicosChange = (e) => {
    setDatosFisicos({ ...datosFisicos, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      // 1. Registrar jugador
      const resJugador = await fetch("http://localhost:3000/api/jugadores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jugador),
      });

      if (!resJugador.ok) throw new Error("Error al registrar jugador");

      const jugadorCreado = await resJugador.json();
      
      // Asegurarse de que el jugadorCreado tenga la estructura esperada
      console.log({
        ...datosFisicos,
        id_jugador: jugadorCreado.jugador.id_jugador,
      });

      // 2. Registrar datos físicos con el id_jugador devuelto
      const resDatosFisicos = await fetch("http://localhost:3000/api/datos_fisicos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...datosFisicos,
          id_jugador: jugadorCreado.jugador.id_jugador,
        }),
      });

      if (!resDatosFisicos.ok) throw new Error("Error al registrar datos físicos");

      setMensaje("¡Jugador y datos físicos registrados correctamente!");
      setJugador({
        dni: "",
        nombre: "",
        apellido: "",
        direccion: "",
        posicion: "",
        fecha_nacimiento: "",
        grupo_sanguineo: "",
        nro_afiliado: "",
        obra_social: "",
        pierna_habil: "",
        categoria: "",
        contacto: "",
        tutor_uno: "",
        tel_tutor_uno: "",
        tutor_dos: "",
        tel_tutor_dos: "",
        fecha_alta: "",
        fecha_baja: "",
        motivo_baja: "",
      });
      setDatosFisicos({
        fecha_registro: "",
        altura: "",
        peso: "",
        velocidad: "",
        observaciones: "",
      });
    } catch (error) {
      setMensaje(error.message);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Registrar Jugador</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campos de jugador */}
        <div className="grid grid-cols-2 gap-4">
          <input name="dni" value={jugador.dni} onChange={handleJugadorChange} placeholder="DNI" required />
          <input name="nombre" value={jugador.nombre} onChange={handleJugadorChange} placeholder="Nombre" required />
          <input name="apellido" value={jugador.apellido} onChange={handleJugadorChange} placeholder="Apellido" required />
          <input name="direccion" value={jugador.direccion} onChange={handleJugadorChange} placeholder="Dirección" />
          <input name="posicion" value={jugador.posicion} onChange={handleJugadorChange} placeholder="Posición" />
          <input name="fecha_nacimiento" type="date" value={jugador.fecha_nacimiento} onChange={handleJugadorChange} placeholder="Fecha de nacimiento" />
          <input name="grupo_sanguineo" value={jugador.grupo_sanguineo} onChange={handleJugadorChange} placeholder="Grupo sanguíneo" />
          <input name="nro_afiliado" value={jugador.nro_afiliado} onChange={handleJugadorChange} placeholder="Nro. afiliado" />
          <input name="obra_social" value={jugador.obra_social} onChange={handleJugadorChange} placeholder="Obra social" />
          <input name="pierna_habil" value={jugador.pierna_habil} onChange={handleJugadorChange} placeholder="Pierna hábil" />
          <input name="categoria" value={jugador.categoria} onChange={handleJugadorChange} placeholder="Categoría" />
          <input name="contacto" value={jugador.contacto} onChange={handleJugadorChange} placeholder="Contacto" />
          <input name="tutor_uno" value={jugador.tutor_uno} onChange={handleJugadorChange} placeholder="Tutor uno" />
          <input name="tel_tutor_uno" value={jugador.tel_tutor_uno} onChange={handleJugadorChange} placeholder="Tel. tutor uno" />
          <input name="tutor_dos" value={jugador.tutor_dos} onChange={handleJugadorChange} placeholder="Tutor dos" />
          <input name="tel_tutor_dos" value={jugador.tel_tutor_dos} onChange={handleJugadorChange} placeholder="Tel. tutor dos" />
          <input name="fecha_alta" type="date" value={jugador.fecha_alta} onChange={handleJugadorChange} placeholder="Fecha alta" />
          <input name="fecha_baja" type="date" value={jugador.fecha_baja} onChange={handleJugadorChange} placeholder="Fecha baja" />
          <input name="motivo_baja" value={jugador.motivo_baja} onChange={handleJugadorChange} placeholder="Motivo baja" />
        </div>
        <hr />
        {/* Campos de datos físicos */}
        <h2 className="text-lg font-semibold">Datos Físicos</h2>
        <div className="grid grid-cols-2 gap-4">
          <input name="fecha_registro" type="date" value={datosFisicos.fecha_registro} onChange={handleDatosFisicosChange} placeholder="Fecha registro" />
          <input name="altura" value={datosFisicos.altura} onChange={handleDatosFisicosChange} placeholder="Altura" />
          <input name="peso" value={datosFisicos.peso} onChange={handleDatosFisicosChange} placeholder="Peso" />
          <input name="velocidad" value={datosFisicos.velocidad} onChange={handleDatosFisicosChange} placeholder="Velocidad" />
          <input name="observaciones" value={datosFisicos.observaciones} onChange={handleDatosFisicosChange} placeholder="Observaciones" />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Registrar
        </button>
        {mensaje && <div className="mt-4">{mensaje}</div>}
      </form>
    </Layout>
  );
};

export default RegistrarJugador;