import React, { useState } from "react";
import Layout from "../components/Layout";

const BuscarAspirante = () => {
    const [filtros, setFiltros] = useState({
        nombre: "",
        apellido: "",
        provincia: "",
        localidad: "",
        dni: "",
        estado: "",
        fecha_nacimiento: "",
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
        const params = new URLSearchParams();
        Object.entries(filtros).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        try {
            const res = await fetch(`http://localhost:3000/api/aspirantes?${params.toString()}`);
            if (!res.ok) throw new Error("Error al buscar aspirantes");
            const data = await res.json();
            if (data.length === 0) setMensaje("No se encontraron aspirantes.");
            setResultados(data);
        } catch (error) {
            setMensaje(error.message);
        }
    };

    return (
        <Layout>
            <h1 className="text-2xl font-bold mb-4">Buscar Aspirante</h1>
            <form onSubmit={handleBuscar} className="grid grid-cols-2 gap-4 mb-6">
                <input name="nombre" value={filtros.nombre} onChange={handleChange} placeholder="Nombre" />
                <input name="apellido" value={filtros.apellido} onChange={handleChange} placeholder="Apellido" />
                <input name="provincia" value={filtros.provincia} onChange={handleChange} placeholder="Provincia" />
                <input name="localidad" value={filtros.localidad} onChange={handleChange} placeholder="Localidad" />
                <input name="dni" value={filtros.dni} onChange={handleChange} placeholder="DNI" />
                <input name="estado" value={filtros.estado} onChange={handleChange} placeholder="Estado" />
                <input name="fecha_nacimiento" type="date" value={filtros.fecha_nacimiento} onChange={handleChange} placeholder="Fecha nacimiento" />
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
                                <th className="px-2 py-1">Provincia</th>
                                <th className="px-2 py-1">Estado</th>
                                <th className="px-2 py-1">Fecha Nacimiento</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultados.map((asp) => (
                                <tr key={asp.id_aspirante}>
                                    <td className="px-2 py-1">{asp.dni}</td>
                                    <td className="px-2 py-1">{asp.nombre}</td>
                                    <td className="px-2 py-1">{asp.apellido}</td>
                                    <td className="px-2 py-1">{asp.provincia}</td>
                                    <td className="px-2 py-1">{asp.estado}</td>
                                    <td className="px-2 py-1">{asp.fecha_nacimiento?.slice(0, 10)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Layout>
    );
};

export default BuscarAspirante;