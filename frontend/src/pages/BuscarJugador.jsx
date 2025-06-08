import React, { useState } from "react";
import Layout from "../components/Layout";

const BuscarJugador = () => {
    const [filtros, setFiltros] = useState({
        apellido: "",
        dni: "",
        posicion: "",
        pierna_habil: "",
        fecha_nacimiento: "",
        categoria: "",
        altura: "",
        peso: "",
    });
    const [resultados, setResultados] = useState([]);
    const [mensaje, setMensaje] = useState("");

    const handleChange = (e) => {
        setFiltros({ ...filtros, [e.target.name]: e.target.value });
    };

    const handleBuscar = async (e) => {
        e.preventDefault();
        setMensaje("");
        setResultados([]);
        // Construir query string
        const params = new URLSearchParams();
        Object.entries(filtros).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        try {
            const res = await fetch(`http://localhost:3000/api/jugadores?${params.toString()}`);
            if (!res.ok) throw new Error("Error al buscar jugadores");
            const data = await res.json();
            if (data.length === 0) setMensaje("No se encontraron jugadores.");
            setResultados(data);
        } catch (error) {
            setMensaje(error.message);
        }
    };

    return (
        <Layout>
            <h1 className="text-2xl font-bold mb-4">Buscar Jugador</h1>
            <form onSubmit={handleBuscar} className="grid grid-cols-2 gap-4 mb-6">
                <input name="apellido" value={filtros.apellido} onChange={handleChange} placeholder="Apellido" />
                <input name="dni" value={filtros.dni} onChange={handleChange} placeholder="DNI" />
                <input name="posicion" value={filtros.posicion} onChange={handleChange} placeholder="Posición" />
                <input name="pierna_habil" value={filtros.pierna_habil} onChange={handleChange} placeholder="Pierna hábil" />
                <input name="fecha_nacimiento" type="date" value={filtros.fecha_nacimiento} onChange={handleChange} placeholder="Fecha nacimiento" />
                <input name="categoria" value={filtros.categoria} onChange={handleChange} placeholder="Categoría" />
                <input name="altura" value={filtros.altura} onChange={handleChange} placeholder="Altura" />
                <input name="peso" value={filtros.peso} onChange={handleChange} placeholder="Peso" />
                <button type="submit" className="col-span-2 bg-blue-600 text-white px-4 py-2 rounded mt-2">
                    Buscar
                </button>
            </form>
            {mensaje && <div className="mb-4 text-red-600">{mensaje}</div>}
            {resultados.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded shadow">
                        <thead>
                            <tr>
                                <th className="px-2 py-1">DNI</th>
                                <th className="px-2 py-1">Nombre</th>
                                <th className="px-2 py-1">Apellido</th>
                                <th className="px-2 py-1">Posición</th>
                                <th className="px-2 py-1">Categoría</th>
                                <th className="px-2 py-1">Datos Físicos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultados.map((jugador) => (
                                <tr key={jugador.id_jugador}>
                                    <td className="px-2 py-1">{jugador.dni}</td>
                                    <td className="px-2 py-1">{jugador.nombre}</td>
                                    <td className="px-2 py-1">{jugador.apellido}</td>
                                    <td className="px-2 py-1">{jugador.posicion}</td>
                                    <td className="px-2 py-1">{jugador.categoria}</td>
                                    <td className="px-2 py-1">
                                        {jugador.datosFisicos && jugador.datosFisicos.length > 0 ? (
                                            <ul>
                                                {jugador.datosFisicos.map((df) => (
                                                    <li key={df.id_datos_fisico}>
                                                        {df.fecha_registro?.slice(0, 10)} | Altura: {df.altura} | Peso: {df.peso} | Velocidad: {df.velocidad}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span>No hay datos físicos</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Layout>
    );
};

export default BuscarJugador;