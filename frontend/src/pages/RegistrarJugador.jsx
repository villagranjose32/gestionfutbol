import React, { useState } from 'react';
import Layout from '../components/Layout';

// ... (funciones calcularEdad y getCategoria)

const RegistrarJugador = () => {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    fechaNac: "",
    pie: "",
    posicion: "",
    clubOrigen: "",
    fechaIngreso: "",
  });
  const [jugadores, setJugadores] = useState([]);
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [errorRegistro, setErrorRegistro] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorRegistro(''); // Limpiar cualquier error previo

    try {
      const response = await fetch('http://localhost:3000/api/jugadores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const nuevoJugador = await response.json();
        setJugadores([...jugadores, nuevoJugador]); // Opcional: actualizar la lista local
        setRegistroExitoso(true);
        setForm({ // Limpiar el formulario después del éxito
          nombre: "",
          apellido: "",
          dni: "",
          fechaNac: "",
          pie: "",
          posicion: "",
          clubOrigen: "",
          fechaIngreso: "",
        });
        // Opcional: podrías resetear el estado de éxito después de un tiempo
        setTimeout(() => setRegistroExitoso(false), 3000);
      } else {
        const errorData = await response.json();
        setErrorRegistro(`Error al registrar el jugador: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error de red al registrar el jugador:', error);
      setErrorRegistro('Error de red al intentar registrar el jugador.');
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Registrar Jugador</h1>
      {registroExitoso && (
        <div className="bg-green-200 border border-green-500 text-green-700 px-4 py-3 rounded mb-4">
          Jugador registrado exitosamente!
        </div>
      )}
      {errorRegistro && (
        <div className="bg-red-200 border border-red-500 text-red-700 px-4 py-3 rounded mb-4">
          {errorRegistro}
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded shadow mb-8">
        {/* ... (los campos del formulario como antes) */}
        <div>
          <label htmlFor="nombre" className="block mb-1 text-gray-700 font-medium">Nombre</label>
          <input type="text" id="nombre" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required className="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label htmlFor="apellido" className="block mb-1 text-gray-700 font-medium">Apellido</label>
          <input type="text" id="apellido" name="apellido" value={form.apellido} onChange={handleChange} placeholder="Apellido" required className="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label htmlFor="dni" className="block mb-1 text-gray-700 font-medium">DNI</label>
          <input type="text" id="dni" name="dni" value={form.dni} onChange={handleChange} placeholder="DNI" required className="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label htmlFor="fechaNac" className="block mb-1 text-gray-700 font-medium">Fecha de Nacimiento</label>
          <input type="date" id="fechaNac" name="fechaNac" value={form.fechaNac} onChange={handleChange} required className="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label htmlFor="pie" className="block mb-1 text-gray-700 font-medium">Pie hábil</label>
          <select id="pie" name="pie" value={form.pie} onChange={handleChange} required className="border rounded px-3 py-2 w-full">
            <option value="">Seleccionar pie hábil</option>
            <option value="Derecho">Derecho</option>
            <option value="Izquierdo">Izquierdo</option>
            <option value="Ambidiestro">Ambidiestro</option>
          </select>
        </div>
        <div>
          <label htmlFor="posicion" className="block mb-1 text-gray-700 font-medium">Posición</label>
          <select id="posicion" name="posicion" value={form.posicion} onChange={handleChange} required className="border rounded px-3 py-2 w-full">
            <option value="">Seleccionar posición</option>
            <option value="Arquero">Arquero</option>
            <option value="Defensor">Defensor</option>
            <option value="Lateral">Lateral</option>
            <option value="Volante">Volante</option>
            <option value="Delantero">Delantero</option>
            <option value="Extremo">Extremo</option>
            <option value="Enganche">Enganche</option>
          </select>
        </div>
        <div>
          <label htmlFor="clubOrigen" className="block mb-1 text-gray-700 font-medium">Club de Origen</label>
          <input type="text" id="clubOrigen" name="clubOrigen" value={form.clubOrigen} onChange={handleChange} placeholder="Club de Origen" required className="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label htmlFor="fechaIngreso" className="block mb-1 text-gray-700 font-medium">Fecha de Ingreso al Club</label>
          <input type="date" id="fechaIngreso" name="fechaIngreso" value={form.fechaIngreso} onChange={handleChange} required className="border rounded px-3 py-2 w-full" />
        </div>
        <div className="md:col-span-3 flex items-end">
          <button
            type="submit"
            className="w-full bg-[#a40000] hover:bg-[#800000] text-white font-semibold py-2 rounded transition-colors"
          >
            Agregar Jugador
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-3 py-2">Nombre</th>
              <th className="px-3 py-2">Apellido</th>
              <th className="px-3 py-2">DNI</th>
              <th className="px-3 py-2">Categoría</th>
              <th className="px-3 py-2">Edad</th>
              <th className="px-3 py-2">Puesto</th>
              <th className="px-3 py-2">Pie</th>
              <th className="px-3 py-2">Club de Origen</th>
              <th className="px-3 py-2">Fecha de Ingreso</th>
            </tr>
          </thead>
          <tbody>
            {jugadores.map((j, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-3 py-2">{j.nombre}</td>
                <td className="px-3 py-2">{j.apellido}</td>
                <td className="px-3 py-2">{j.dni}</td>
                <td className="px-3 py-2">{getCategoria(j.fechaNac)}</td>
                <td className="px-3 py-2">{calcularEdad(j.fechaNac)}</td>
                <td className="px-3 py-2">{j.posicion}</td>
                <td className="px-3 py-2">{j.pie}</td>
                <td className="px-3 py-2">{j.clubOrigen}</td>
                <td className="px-3 py-2">{j.fechaIngreso}</td>
              </tr>
            ))}
            {jugadores.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-4 text-gray-500">
                  No hay jugadores registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default RegistrarJugador;