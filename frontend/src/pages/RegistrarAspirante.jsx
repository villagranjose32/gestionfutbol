import React, { useState } from "react";
import Layout from "../components/Layout";

const RegistrarAspirante = () => {
    const [aspirante, setAspirante] = useState({
        nombre: "",
        apellido: "",
        provincia: "",
        localidad: "",
        dni: "",
        fecha_nacimiento: "",
        contacto: "",
        estado: "",
    });
    const [mensaje, setMensaje] = useState("");

    const handleChange = (e) => {
        setAspirante({ ...aspirante, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje("");
        try {
            const res = await fetch("http://localhost:3000/api/aspirantes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(aspirante),
            });
            if (!res.ok) throw new Error("Error al registrar aspirante");
            setMensaje("¡Aspirante registrado correctamente!");
            setAspirante({
                nombre: "",
                apellido: "",
                provincia: "",
                localidad: "",
                dni: "",
                fecha_nacimiento: "",
                contacto: "",
                estado: "",
            });
        } catch (error) {
            setMensaje(error.message);
        }
    };

    return (
        <Layout>
            <h1 className="text-2xl font-bold mb-4">Registrar Aspirante</h1>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                <input name="nombre" value={aspirante.nombre} onChange={handleChange} placeholder="Nombre" required className="w-full p-2 border rounded" />
                <input name="apellido" value={aspirante.apellido} onChange={handleChange} placeholder="Apellido" required className="w-full p-2 border rounded" />
                <input name="provincia" value={aspirante.provincia} onChange={handleChange} placeholder="Provincia" className="w-full p-2 border rounded" />
                <input name="localidad" value={aspirante.localidad} onChange={handleChange} placeholder="Localidad" className="w-full p-2 border rounded" />
                <input name="dni" value={aspirante.dni} onChange={handleChange} placeholder="DNI" required className="w-full p-2 border rounded" />
                <input name="fecha_nacimiento" type="date" value={aspirante.fecha_nacimiento} onChange={handleChange} placeholder="Fecha de nacimiento" className="w-full p-2 border rounded" />
                <input name="contacto" value={aspirante.contacto} onChange={handleChange} placeholder="Contacto" className="w-full p-2 border rounded" />
                <input name="estado" value={aspirante.estado} onChange={handleChange} placeholder="Estado" className="w-full p-2 border rounded" />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Registrar</button>
                {mensaje && <div className="mt-4">{mensaje}</div>}
            </form>
        </Layout>
    );
};

export default RegistrarAspirante;