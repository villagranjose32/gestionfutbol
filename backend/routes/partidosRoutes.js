const express = require('express');
const router = express.Router();
const Partido = require('../models/partidos');
const JugadorPartido = require('../models/jugador_partido');
const Jugador = require('../models/jugador');

// Buscar partidos por fecha, rival o ubicación
router.get('/buscar', async (req, res) => {
    const { fecha, rival, ubicacion } = req.query;
    const where = {};
    if (fecha) where.fecha = fecha;
    if (rival) where.rival = rival;
    if (ubicacion) where.ubicacion = ubicacion;
    try {
        const partidos = await Partido.findAll({ where });
        res.json(partidos);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar partidos', detalle: error.message });
    }
});

// Crear un partido
router.post('/', async (req, res) => {
    try {
        const partido = await Partido.create(req.body);
        res.json(partido);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear partido' });
    }
});

// Asignar un grupo de jugadores a un partido
router.post('/:id_partido/jugadores', async (req, res) => {
    const { jugadores } = req.body; // jugadores = [id_jugador1, id_jugador2, ...]
    const id_partido = req.params.id_partido;
    try {
        const registros = await Promise.all(
            jugadores.map(id_jugador =>
                JugadorPartido.create({ id_partido, id_jugador })
            )
        );
        res.json({ mensaje: 'Jugadores asignados al partido', registros });
    } catch (error) {
        res.status(500).json({ error: 'Error al asignar jugadores', detalle: error.message });
    }
});

// Obtener los jugadores de un partido con datos de jugador_partido
router.get('/:id_partido/jugadores', async (req, res) => {
    try {
        const jugadores = await JugadorPartido.findAll({
            where: { id_partido: req.params.id_partido },
            include: [{ model: Jugador, as: 'jugador' }]
        });
        res.json(jugadores);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener jugadores del partido', detalle: error.message });
    }
});

module.exports = router;