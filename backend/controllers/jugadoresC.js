// backend/controllers/jugadoresC.js
const { Op } = require('sequelize');
const Jugador = require('../models/jugador');
const DatosFisicos = require('../models/datos_fisicos');

// Registrar un nuevo jugador
async function registrarJugador(req, res) {
  try {
    const nuevoJugador = await Jugador.create(req.body);
    const responseData = { mensaje: 'Jugador registrado exitosamente', jugador: nuevoJugador };
    res.status(201).json(responseData);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar el jugador', error: error.message });
  }
}

// Obtener jugador por DNI (incluye datos físicos)
async function obtenerJugadorPorDni(req, res) {
  const { dni } = req.params;
  try {
    const jugador = await Jugador.findOne({
      where: { dni: dni },
      include: [{ model: DatosFisicos, as: 'datosFisicos' }]
    });
    if (jugador) {
      res.status(200).json(jugador);
    } else {
      res.status(404).json({ mensaje: 'Jugador no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el jugador', error: error.message });
  }
}

// Buscar jugadores con filtros, incluyendo datos físicos si se solicitan
async function buscarJugadores(req, res) {
  try {
    const {
      apellido,
      dni,
      posicion,
      pierna_habil,
      fecha_nacimiento,
      categoria,
      altura,
      peso
    } = req.query;

    // Filtros para Jugador
    const condicionesJugador = {};
    if (apellido) condicionesJugador.apellido = { [Op.like]: `%${apellido}%` };
    if (dni) condicionesJugador.dni = dni;
    if (posicion) condicionesJugador.posicion = { [Op.like]: `%${posicion}%` };
    if (pierna_habil) condicionesJugador.pierna_habil = { [Op.like]: `%${pierna_habil}%` };
    if (fecha_nacimiento) condicionesJugador.fecha_nacimiento = fecha_nacimiento;
    if (categoria) condicionesJugador.categoria = { [Op.like]: `%${categoria}%` };

    // Filtros para DatosFisicos
    const condicionesDatosFisicos = {};
    if (altura) condicionesDatosFisicos.altura = altura;
    if (peso) condicionesDatosFisicos.peso = peso;

    const jugadores = await Jugador.findAll({
      where: condicionesJugador,
      include: [{
        model: DatosFisicos,
        as: 'datosFisicos',
        where: Object.keys(condicionesDatosFisicos).length ? condicionesDatosFisicos : undefined,
        required: Object.keys(condicionesDatosFisicos).length > 0 // Inner join solo si hay filtro en datos físicos
      }]
    });

    res.status(200).json(jugadores);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar jugadores', error: error.message });
  }
}

module.exports = {
  registrarJugador,
  obtenerJugadorPorDni,
  buscarJugadores
};