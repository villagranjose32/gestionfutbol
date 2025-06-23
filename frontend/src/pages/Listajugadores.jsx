import React, { useState, useEffect } from 'react';

const jugadoresMock = [
  {
    nombre: 'Matías López',
    categoria: 'Sub-18',
    goles: 5,
    informeMedico: 'Apto',
    informeSocial: 'Apto',
    informeFisico: 'Apto',
    fechaIngreso: '2021-03-15',
    fechaBaja: ''
  },
  {
    nombre: 'Santiago Pérez',
    categoria: 'Sub-18',
    goles: 3,
    informeMedico: 'Apto\nBajo seguimiento',
    informeSocial: 'Bajo',
    informeFisico: 'Apto',
    fechaIngreso: '2020-08-12',
    fechaBaja: '2023-05-10'
  },
  // ...agrega el resto de los jugadores aquí
];

const Listajugadores = () => {
  const [jugadores, setJugadores] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    setJugadores(jugadoresMock);
  }, []);

  const handleBuscar = (e) => {
    setBusqueda(e.target.value);
  };

  const jugadoresFiltrados = jugadores.filter(j =>
    j.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const verPerfil = (jugador) => {
    alert(`Ver perfil de: ${jugador.nombre}`);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Lista de Jugadores</h2>
      <input
        type="text"
        placeholder="Buscar jugador..."
        value={busqueda}
        onChange={handleBuscar}
        style={{ marginBottom: '1rem', padding: '0.5rem', width: '300px' }}
      />
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Goles</th>
            <th>Informe Médico</th>
            <th>Informe Social</th>
            <th>Informe Físico</th>
            <th>Fecha de Ingreso</th>
            <th>Fecha de Baja</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {jugadoresFiltrados.map((jugador, idx) => (
            <tr key={idx}>
              <td>{jugador.nombre}</td>
              <td>{jugador.categoria}</td>
              <td>{jugador.goles}</td>
              <td>
                {jugador.informeMedico.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </td>
              <td>{jugador.informeSocial}</td>
              <td>{jugador.informeFisico}</td>
              <td>{new Date(jugador.fechaIngreso).toLocaleDateString()}</td>
              <td>
                {jugador.fechaBaja
                  ? new Date(jugador.fechaBaja).toLocaleDateString()
                  : '-'}
              </td>
              <td>
                <button
                  onClick={() => verPerfil(jugador)}
                  style={{
                    background: '#22395d',
                    color: '#fff',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: 6,
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Ver perfil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Listajugadores;