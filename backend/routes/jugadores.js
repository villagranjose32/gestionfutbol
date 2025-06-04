// backend/routes/jugadores.js
const express = require('express');
const router = express.Router();
const jugadorController = require('../controllers/jugadoresC');

console.log('jugadorController:', jugadorController); // <--- Añade esta línea

// Ruta para registrar jugador
//router.post('/', jugadorController.registrarJugador);

router.post('/', (req, res) => jugadorController.registrarJugador(req, res));

// Ruta para obtener datos de un jugador por DNI
router.get('/:dni', jugadorController.obtenerJugadorPorDni);

module.exports = router;