import React, { useEffect, useState } from "react";

const API = "http://localhost:3000/api";

const initialPartido = {
    fecha: "",
    rival: "",
    categoria: "",
    ubicacion: "",
    resultado: "",
};

const PartidoGestion = () => {
    const [partido, setPartido] = useState(initialPartido);
    const [jugadores, setJugadores] = useState([]);
    const [jugadoresSeleccionados, setJugadoresSeleccionados] = useState([]);
    const [partidoCreado, setPartidoCreado] = useState(null);
    const [jugadorPartidoDatos, setJugadorPartidoDatos] = useState({});
    const [mensaje, setMensaje] = useState("");

    // Estados para búsqueda
    const [busqueda, setBusqueda] = useState({ fecha: "", rival: "", ubicacion: "" });
    const [resultados, setResultados] = useState([]);
    const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);
    const [jugadoresPartido, setJugadoresPartido] = useState([]);

    // 1. Cargar jugadores registrados
    useEffect(() => {
        fetch(`${API}/jugadores`)
            .then((res) => res.json())
            .then(setJugadores);
    }, []);

    // Buscar partidos por filtros
    const handleBusquedaChange = (e) => {
        setBusqueda({ ...busqueda, [e.target.name]: e.target.value });
    };

    const handleBuscarPartidos = async (e) => {
        e.preventDefault();
        let query = [];
        if (busqueda.fecha) query.push(`fecha=${busqueda.fecha}`);
        if (busqueda.rival) query.push(`rival=${busqueda.rival}`);
        if (busqueda.ubicacion) query.push(`ubicacion=${busqueda.ubicacion}`);
        const res = await fetch(`${API}/partidos/buscar?${query.join("&")}`);
        if (res.ok) {
            const data = await res.json();
            setResultados(data);
        } else {
            setResultados([]);
        }
        setPartidoSeleccionado(null);
        setJugadoresPartido([]);
    };

    // Al seleccionar un partido, cargar datos de jugadores
    const handleSeleccionarPartido = async (partido) => {
        setPartidoSeleccionado(partido);
        const res = await fetch(`${API}/partidos/${partido.id_partido}/jugadores`);
        if (res.ok) {
            const data = await res.json();
            setJugadoresPartido(data);
        } else {
            setJugadoresPartido([]);
        }
    };

    // 2. Registrar partido
    const handlePartidoChange = (e) => {
        setPartido({ ...partido, [e.target.name]: e.target.value });
    };

    const handleRegistrarPartido = async (e) => {
        e.preventDefault();
        setMensaje("");
        const res = await fetch(`${API}/partidos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(partido),
        });
        if (res.ok) {
            const data = await res.json();
            setPartidoCreado(data);
            setMensaje("Partido registrado. Ahora selecciona los jugadores.");
        } else {
            setMensaje("Error al registrar partido");
        }
    };

    // 3. Seleccionar jugadores
    const handleSeleccionarJugador = (id_jugador) => {
        setJugadoresSeleccionados((prev) =>
            prev.includes(id_jugador)
                ? prev.filter((id) => id !== id_jugador)
                : [...prev, id_jugador]
        );
    };

    // 4. Asignar jugadores al partido y preparar datos de edición
    const handleAsignarJugadores = async () => {
        setMensaje("");
        const res = await fetch(`${API}/partidos/${partidoCreado.id_partido}/jugadores`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_partido: partidoCreado.id_partido, jugadores: jugadoresSeleccionados }),
        });
        if (res.ok) {
            setMensaje("Jugadores asignados. Ahora puedes cargar datos individuales.");
            // Cargar datos de jugador_partido para edición
            fetch(`${API}/partidos/${partidoCreado.id_partido}/jugadores`)
                .then((r) => r.json())
                .then((data) => {
                    // Inicializa los datos editables
                    const datos = {};
                    data.forEach((jp) => {
                        datos[jp.id_jugador_partido] = {
                            amarilla: jp.amarilla || 0,
                            roja: jp.roja || 0,
                            asistencia: jp.asistencia || 0,
                            goles: jp.goles || 0,
                            observacion: jp.observacion || "",
                            nombre: jp.jugador?.nombre,
                            apellido: jp.jugador?.apellido,
                            id_jugador: jp.id_jugador,
                        };
                    });
                    setJugadorPartidoDatos(datos);
                });
        } else {
            setMensaje("Error al asignar jugadores");
        }
    };

    // 5. Editar datos de jugador_partido
    const handleJugadorPartidoChange = (id_jugador_partido, campo, valor) => {
        setJugadorPartidoDatos((prev) => ({
            ...prev,
            [id_jugador_partido]: { ...prev[id_jugador_partido], [campo]: valor },
        }));
    };

    const handleGuardarDatosJugador = async (id_jugador_partido) => {
        const datos = jugadorPartidoDatos[id_jugador_partido];
        const res = await fetch(`${API}/jugador-partido/${id_jugador_partido}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        });
        if (res.ok) setMensaje("Datos guardados");
        else setMensaje("Error al guardar datos");
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Gestión de Partidos y Jugadores</h1>
            {mensaje && <div className="mb-4 text-blue-700">{mensaje}</div>}

            {/* Búsqueda de partidos */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2">Buscar Partido</h2>
                <form onSubmit={handleBuscarPartidos} className="grid grid-cols-4 gap-4 mb-4">
                    <input
                        type="date"
                        name="fecha"
                        value={busqueda.fecha}
                        onChange={handleBusquedaChange}
                        className="border rounded px-2 py-1"
                        placeholder="Fecha"
                    />
                    <input
                        type="text"
                        name="rival"
                        value={busqueda.rival}
                        onChange={handleBusquedaChange}
                        className="border rounded px-2 py-1"
                        placeholder="Rival"
                    />
                    <input
                        type="text"
                        name="ubicacion"
                        value={busqueda.ubicacion}
                        onChange={handleBusquedaChange}
                        className="border rounded px-2 py-1"
                        placeholder="Ubicación"
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">Buscar</button>
                </form>
                {resultados.length > 0 && (
                    <div className="mb-4">
                        <h3 className="font-semibold mb-1">Resultados:</h3>
                        <ul>
                            {resultados.map((p) => (
                                <li key={p.id_partido} className="mb-1">
                                    <button
                                        className="underline text-blue-700"
                                        onClick={() => handleSeleccionarPartido(p)}
                                    >
                                        {p.fecha} - {p.rival} ({p.ubicacion})
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {/* Mostrar datos del partido y jugadores */}
                {partidoSeleccionado && (
                    <div className="bg-gray-100 p-4 rounded mb-4">
                        <h4 className="font-bold mb-2">Datos del Partido</h4>
                        <p><b>Fecha:</b> {partidoSeleccionado.fecha}</p>
                        <p><b>Rival:</b> {partidoSeleccionado.rival}</p>
                        <p><b>Ubicación:</b> {partidoSeleccionado.ubicacion}</p>
                        <p><b>Categoría:</b> {partidoSeleccionado.categoria}</p>
                        <p><b>Resultado:</b> {partidoSeleccionado.resultado}</p>
                        <h4 className="font-bold mt-4 mb-2">Datos de Jugadores</h4>
                        <table className="min-w-full bg-white rounded shadow">
                            <thead>
                                <tr>
                                    <th className="px-2 py-1">Nombre</th>
                                    <th className="px-2 py-1">Apellido</th>
                                    <th className="px-2 py-1">Amarilla</th>
                                    <th className="px-2 py-1">Roja</th>
                                    <th className="px-2 py-1">Asistencia</th>
                                    <th className="px-2 py-1">Goles</th>
                                    <th className="px-2 py-1">Observación</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jugadoresPartido.map((jp) => (
                                    <tr key={jp.id_jugador_partido}>
                                        <td className="px-2 py-1">{jp.jugador?.nombre}</td>
                                        <td className="px-2 py-1">{jp.jugador?.apellido}</td>
                                        <td className="px-2 py-1">{jp.amarilla}</td>
                                        <td className="px-2 py-1">{jp.roja}</td>
                                        <td className="px-2 py-1">{jp.asistencia}</td>
                                        <td className="px-2 py-1">{jp.goles}</td>
                                        <td className="px-2 py-1">{jp.observacion}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* 1. Registro de partido */}
            {!partidoCreado && (
                <form onSubmit={handleRegistrarPartido} className="grid grid-cols-2 gap-4 mb-8">
                    <input name="fecha" type="date" value={partido.fecha} onChange={handlePartidoChange} placeholder="Fecha" required />
                    <input name="rival" value={partido.rival} onChange={handlePartidoChange} placeholder="Rival" required />
                    <input name="categoria" value={partido.categoria} onChange={handlePartidoChange} placeholder="Categoría" />
                    <input name="ubicacion" value={partido.ubicacion} onChange={handlePartidoChange} placeholder="Ubicación" />
                    <input name="resultado" value={partido.resultado} onChange={handlePartidoChange} placeholder="Resultado" />
                    <button type="submit" className="col-span-2 bg-blue-600 text-white px-4 py-2 rounded">Registrar Partido</button>
                </form>
            )}

            {/* 2. Selección de jugadores */}
            {partidoCreado && Object.keys(jugadorPartidoDatos).length === 0 && (
                <div>
                    <h2 className="font-semibold mb-2">Selecciona jugadores que participaron:</h2>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        {jugadores.map((j) => (
                            <label key={j.id_jugador} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={jugadoresSeleccionados.includes(j.id_jugador)}
                                    onChange={() => handleSeleccionarJugador(j.id_jugador)}
                                />
                                <span>{j.nombre} {j.apellido}</span>
                            </label>
                        ))}
                    </div>
                    <button
                        className="bg-green-600 text-white px-4 py-2 rounded"
                        onClick={handleAsignarJugadores}
                        disabled={jugadoresSeleccionados.length === 0}
                    >
                        Asignar jugadores al partido
                    </button>
                </div>
            )}

            {/* 3. Edición de datos de jugador_partido */}
            {partidoCreado && Object.keys(jugadorPartidoDatos).length > 0 && (
                <div className="mt-8">
                    <h2 className="font-semibold mb-2">Datos de cada jugador en el partido</h2>
                    <table className="min-w-full bg-white rounded shadow">
                        <thead>
                            <tr>
                                <th className="px-2 py-1">Nombre</th>
                                <th className="px-2 py-1">Apellido</th>
                                <th className="px-2 py-1">Amarilla</th>
                                <th className="px-2 py-1">Roja</th>
                                <th className="px-2 py-1">Asistencia</th>
                                <th className="px-2 py-1">Goles</th>
                                <th className="px-2 py-1">Observación</th>
                                <th className="px-2 py-1">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(jugadorPartidoDatos).map(([id, datos]) => (
                                <tr key={id}>
                                    <td className="px-2 py-1">{datos.nombre}</td>
                                    <td className="px-2 py-1">{datos.apellido}</td>
                                    <td className="px-2 py-1">
                                        <input
                                            type="number"
                                            min={0}
                                            value={datos.amarilla}
                                            onChange={e => handleJugadorPartidoChange(id, "amarilla", e.target.value)}
                                            className="w-16"
                                        />
                                    </td>
                                    <td className="px-2 py-1">
                                        <input
                                            type="number"
                                            min={0}
                                            value={datos.roja}
                                            onChange={e => handleJugadorPartidoChange(id, "roja", e.target.value)}
                                            className="w-16"
                                        />
                                    </td>
                                    <td className="px-2 py-1">
                                        <input
                                            type="number"
                                            min={0}
                                            value={datos.asistencia}
                                            onChange={e => handleJugadorPartidoChange(id, "asistencia", e.target.value)}
                                            className="w-16"
                                        />
                                    </td>
                                    <td className="px-2 py-1">
                                        <input
                                            type="number"
                                            min={0}
                                            value={datos.goles}
                                            onChange={e => handleJugadorPartidoChange(id, "goles", e.target.value)}
                                            className="w-16"
                                        />
                                    </td>
                                    <td className="px-2 py-1">
                                        <input
                                            type="text"
                                            value={datos.observacion}
                                            onChange={e => handleJugadorPartidoChange(id, "observacion", e.target.value)}
                                            className="w-32"
                                        />
                                    </td>
                                    <td className="px-2 py-1">
                                        <button
                                            className="bg-blue-500 text-white px-2 py-1 rounded"
                                            onClick={() => handleGuardarDatosJugador(id)}
                                        >
                                            Guardar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PartidoGestion;