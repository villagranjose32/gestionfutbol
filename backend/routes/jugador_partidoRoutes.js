const express = require('express');
const router = express.Router();
const {
    listarJugadores,
    asignarJugadoresAPartido,
    jugadoresDeUnPartido,
    actualizarDatosJugadorPartido
} = require('../controllers/jugador_partidoC');

// Listar todos los jugadores registrados
router.get('/jugadores', listarJugadores);

// Asignar un grupo de jugadores a un partido
router.post('/partidos/:id_partido/jugadores', asignarJugadoresAPartido);

// Listar jugadores de un partido (con datos de jugador_partido)
router.get('/partidos/:id_partido/jugadores', jugadoresDeUnPartido);

// Actualizar datos de jugador_partido
router.put('/jugador-partido/:id_jugador_partido', actualizarDatosJugadorPartido);

module.exports = router;