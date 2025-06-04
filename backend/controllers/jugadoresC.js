// backend/controllers/jugadoresC.js

const Jugador = require('../models/jugador');

async function registrarJugador(req, res) {
  try {
    const nuevoJugador = await Jugador.create(req.body);
    const responseData = { mensaje: 'Jugador registrado exitosamente', jugador: nuevoJugador };
    console.log('Respondiendo con:', JSON.stringify(responseData, null, 2)); // Añade esto
    res.status(201).json(responseData);
  } catch (error) {
    console.error('Error al registrar jugador:', error);
    const errorResponse = { mensaje: 'Error al registrar el jugador', error: error.message };
    console.log('Respondiendo con error:', JSON.stringify(errorResponse, null, 2)); // Añade esto
    res.status(500).json(errorResponse);
  }
}

async function obtenerJugadorPorDni(req, res) {
  const { dni } = req.params;
  try {
    const jugador = await Jugador.findOne({ where: { dni: dni } });
    if (jugador) {
      res.status(200).json(jugador);
    } else {
      res.status(404).json({ mensaje: 'Jugador no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener jugador por DNI:', error);
    res.status(500).json({ mensaje: 'Error al obtener el jugador', error: error.message });
  }
}

module.exports = {
  registrarJugador,
  obtenerJugadorPorDni
};
