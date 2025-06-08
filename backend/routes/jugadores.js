// backend/routes/jugadores.js

const express = require('express');
const router = express.Router();
const jugadorController = require('../controllers/jugadoresC');

// Ruta para registrar jugador
router.post('/', jugadorController.registrarJugador);

// Ruta para buscar jugadores por query params
router.get('/', jugadorController.buscarJugadores);

// Ruta para obtener datos de un jugador por DNI
router.get('/:dni', jugadorController.obtenerJugadorPorDni);

module.exports = router;