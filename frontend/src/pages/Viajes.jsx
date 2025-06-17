import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Layout from '../components/Layout'; // Assuming you have a Layout component

const ViajesForm = () => {
  const [viajeDetalle, setViajeDetalle] = useState({
    origen: '',
    destino: '',
    fecha_hora_salida: '',
    fecha_hora_llegada: '',
  });

  const [jugadoresViaje, setJugadoresViaje] = useState([
    { nombre: '', apellido: '', dni: '', sexo: '', edad: '', nacionalidad: '' }
  ]);

  const [mensaje, setMensaje] = useState('');

  const handleViajeDetalleChange = (e) => {
    setViajeDetalle({ ...viajeDetalle, [e.target.name]: e.target.value });
  };

  const handleJugadorChange = (index, e) => {
    const newJugadores = [...jugadoresViaje];
    newJugadores[index][e.target.name] = e.target.value;
    setJugadoresViaje(newJugadores);
  };

  const addRow = () => {
    setJugadoresViaje([...jugadoresViaje, { nombre: '', apellido: '', dni: '', sexo: '', edad: '', nacionalidad: '' }]);
  };

  const removeRow = (index) => {
    const newJugadores = jugadoresViaje.filter((_, i) => i !== index);
    setJugadoresViaje(newJugadores);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    // First, save the trip details
    try {
      const viajeRes = await fetch('http://localhost:3000/api/viajes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(viajeDetalle),
      });

      if (!viajeRes.ok) {
        const errorData = await viajeRes.json();
        throw new Error(`Error al registrar el viaje: ${errorData.message || viajeRes.statusText}`);
      }

      const newViaje = await viajeRes.json();
      const id_viaje = newViaje.viaje.id_viaje; // Assuming your API returns the new trip with its ID

      // Now, save the players associated with the trip
      for (const jugador of jugadoresViaje) {
        // You might need to first find or register the player in your 'Jugador' table
        // This example assumes 'dni' is unique and you can fetch the player's ID from it
        let id_jugador = null;
        try {
          const playerSearchRes = await fetch(`http://localhost:3000/api/jugadores/buscarPorDni/${jugador.dni}`);
          if (playerSearchRes.ok) {
            const playerData = await playerSearchRes.json();
            id_jugador = playerData.jugador.id_jugador;
          } else if (playerSearchRes.status === 404) {
            // If player not found, you might want to register them or handle as an error
            setMensaje(`Advertencia: Jugador con DNI ${jugador.dni} no encontrado. Asegúrate de registrarlo primero.`);
            continue; // Skip this player for now or handle registration
          } else {
            throw new Error(`Error buscando jugador con DNI ${jugador.dni}: ${playerSearchRes.statusText}`);
          }
        } catch (playerError) {
          console.error(playerError);
          setMensaje(`Error al buscar/validar jugador con DNI ${jugador.dni}: ${playerError.message}`);
          allSuccessful = false;
          continue;
        }

        if (id_jugador) {
          await fetch('http://localhost:3000/api/viajes/jugadores', { // Assuming an endpoint to link players to a trip
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_viaje, id_jugador }),
          });
        }
      }

      setMensaje('Viaje y jugadores registrados correctamente.');
      // Clear forms
      setViajeDetalle({ origen: '', destino: '', fecha_hora_salida: '', fecha_hora_llegada: '' });
      setJugadoresViaje([{ nombre: '', apellido: '', dni: '', sexo: '', edad: '', nacionalidad: '' }]);

    } catch (error) {
      console.error('Error al registrar viaje:', error);
      setMensaje(`Error al registrar el viaje: ${error.message}`);
    }
  };

  const exportToExcel = () => {
    const data = [
      ['Detalle del Viaje'],
      ['Origen:', viajeDetalle.origen],
      ['Destino:', viajeDetalle.destino],
      ['Fecha y Hora de Salida:', viajeDetalle.fecha_hora_salida],
      ['Fecha y Hora de Llegada:', viajeDetalle.fecha_hora_llegada],
      [], // Empty row for separation
      ['Jugadores del Viaje'],
      ['Nombre', 'Apellido', 'DNI', 'Sexo', 'Edad', 'Nacionalidad']
    ].concat(
      jugadoresViaje.map(j => [j.nombre, j.apellido, j.dni, j.sexo, j.edad, j.nacionalidad])
    );

    const ws = XLSX.utils.aoa_to_sheet(data);

    // Apply some basic Excel-like styling
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFFFF" } }, // White text
      fill: { fgColor: { rgb: "FF008000" } }, // Dark green background
      alignment: { horizontal: "center" }
    };

    const subHeaderStyle = {
      font: { bold: true },
      fill: { fgColor: { rgb: "FFCCFFCC" } } // Light green background
    };

    // Apply styles to headers
    ws['A1'].s = headerStyle; // "Detalle del Viaje"
    ws['A7'].s = headerStyle; // "Jugadores del Viaje"
    ['A8', 'B8', 'C8', 'D8', 'E8', 'F8'].forEach(cell => {
      if (ws[cell]) ws[cell].s = subHeaderStyle;
    });

    // Auto-width columns
    const max_width_col_A = Math.max(...data.map(row => row[0] ? String(row[0]).length : 0));
    const max_width_col_B = Math.max(...data.map(row => row[1] ? String(row[1]).length : 0));
    const max_width_col_C = Math.max(...data.map(row => row[2] ? String(row[2]).length : 0));
    const max_width_col_D = Math.max(...data.map(row => row[3] ? String(row[3]).length : 0));
    const max_width_col_E = Math.max(...data.map(row => row[4] ? String(row[4]).length : 0));
    const max_width_col_F = Math.max(...data.map(row => row[5] ? String(row[5]).length : 0));

    ws['!cols'] = [
      { wch: max_width_col_A + 2 },
      { wch: max_width_col_B + 2 },
      { wch: max_width_col_C + 2 },
      { wch: max_width_col_D + 2 },
      { wch: max_width_col_E + 2 },
      { wch: max_width_col_F + 2 },
    ];


    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Detalle del Viaje");
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, 'detalle_viaje.xlsx');
  };


  const inputClasses = "mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm";
  const labelClasses = "block text-sm font-medium text-gray-700";
  const tableHeaderClasses = "px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider bg-green-700";
  const tableCellClasses = "px-4 py-2 whitespace-nowrap text-sm text-gray-900";


  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Registro de Viajes</h1>

        <div className="bg-white p-6 rounded-lg shadow-xl mb-8">
          <h2 className="text-2xl font-semibold text-green-800 mb-6 border-b pb-2">Detalles del Viaje</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="origen" className={labelClasses}>Origen</label>
              <input type="text" name="origen" id="origen" value={viajeDetalle.origen} onChange={handleViajeDetalleChange} className={inputClasses} required />
            </div>
            <div>
              <label htmlFor="destino" className={labelClasses}>Destino</label>
              <input type="text" name="destino" id="destino" value={viajeDetalle.destino} onChange={handleViajeDetalleChange} className={inputClasses} required />
            </div>
            <div>
              <label htmlFor="fecha_hora_salida" className={labelClasses}>Fecha y Hora de Salida</label>
              <input type="datetime-local" name="fecha_hora_salida" id="fecha_hora_salida" value={viajeDetalle.fecha_hora_salida} onChange={handleViajeDetalleChange} className={inputClasses} required />
            </div>
            <div>
              <label htmlFor="fecha_hora_llegada" className={labelClasses}>Fecha y Hora de Llegada</label>
              <input type="datetime-local" name="fecha_hora_llegada" id="fecha_hora_llegada" value={viajeDetalle.fecha_hora_llegada} onChange={handleViajeDetalleChange} className={inputClasses} />
            </div>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-xl mb-8">
          <h2 className="text-2xl font-semibold text-green-800 mb-6 border-b pb-2">Lista de Jugadores en el Viaje</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-green-500">
              <thead className="bg-green-600">
                <tr>
                  <th scope="col" className={tableHeaderClasses}>Nombre</th>
                  <th scope="col" className={tableHeaderClasses}>Apellido</th>
                  <th scope="col" className={tableHeaderClasses}>DNI</th>
                  <th scope="col" className={tableHeaderClasses}>Sexo</th>
                  <th scope="col" className={tableHeaderClasses}>Edad</th>
                  <th scope="col" className={tableHeaderClasses}>Nacionalidad</th>
                  <th scope="col" className={tableHeaderClasses}>Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jugadoresViaje.map((jugador, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-green-50' : 'bg-white'}>
                    <td className={tableCellClasses}>
                      <input type="text" name="nombre" value={jugador.nombre} onChange={(e) => handleJugadorChange(index, e)} className={`${inputClasses} border-green-300`} />
                    </td>
                    <td className={tableCellClasses}>
                      <input type="text" name="apellido" value={jugador.apellido} onChange={(e) => handleJugadorChange(index, e)} className={`${inputClasses} border-green-300`} />
                    </td>
                    <td className={tableCellClasses}>
                      <input type="text" name="dni" value={jugador.dni} onChange={(e) => handleJugadorChange(index, e)} className={`${inputClasses} border-green-300`} />
                    </td>
                    <td className={tableCellClasses}>
                      <input type="text" name="sexo" value={jugador.sexo} onChange={(e) => handleJugadorChange(index, e)} className={`${inputClasses} border-green-300`} />
                    </td>
                    <td className={tableCellClasses}>
                      <input type="number" name="edad" value={jugador.edad} onChange={(e) => handleJugadorChange(index, e)} className={`${inputClasses} border-green-300`} />
                    </td>
                    <td className={tableCellClasses}>
                      <input type="text" name="nacionalidad" value={jugador.nacionalidad} onChange={(e) => handleJugadorChange(index, e)} className={`${inputClasses} border-green-300`} />
                    </td>
                    <td className={tableCellClasses}>
                      <button
                        type="button"
                        onClick={() => removeRow(index)}
                        className="text-red-600 hover:text-red-900 font-medium"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={addRow}
            className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-md shadow-md transition duration-300"
          >
            Agregar Jugador
          </button>
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          <button
            type="submit" // This button will submit the form that wraps the entire component
            onClick={handleSubmit}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out"
          >
            Guardar Viaje y Jugadores
          </button>
          <button
            type="button"
            onClick={exportToExcel}
            className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition duration-300 ease-in-out"
          >
            Exportar a Excel
          </button>
        </div>


        {mensaje && (
          <div className={`mt-4 p-4 rounded-md text-center ${mensaje.includes("Error") || mensaje.includes("Advertencia") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {mensaje}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ViajesForm;