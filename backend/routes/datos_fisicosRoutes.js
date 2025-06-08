const express = require('express');
const router = express.Router();
const { registrarDatosFisicos, obtenerDatosFisicosPorJugador } = require('../controllers/datos_fisicosC');

// Registrar datos físicos
router.post('/datos_fisicos', registrarDatosFisicos);

// Obtener datos físicos por id_jugador
router.get('/datos_fisicos/:id_jugador', obtenerDatosFisicosPorJugador);

module.exports = router;