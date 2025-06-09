const Jugador = require('../models/jugador');
const Partido = require('../models/partidos');
const JugadorPartido = require('../models/jugador_partido');

// 1. Listar todos los jugadores registrados
async function listarJugadores(req, res) {
    try {
        const jugadores = await Jugador.findAll();
        res.json(jugadores);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener jugadores' });
    }
}

// 2. Asignar un grupo de jugadores a un partido
async function asignarJugadoresAPartido(req, res) {
    const { id_partido, jugadores } = req.body; // jugadores = [id_jugador1, id_jugador2, ...]
    try {
        const registros = await Promise.all(
            jugadores.map(id_jugador =>
                JugadorPartido.create({ id_partido, id_jugador })
            )
        );
        res.json({ mensaje: 'Jugadores asignados al partido', registros });
    } catch (error) {
        res.status(500).json({ error: 'Error al asignar jugadores' });
    }
}

// 3. Listar jugadores de un partido con datos de jugador_partido
async function jugadoresDeUnPartido(req, res) {
    const { id_partido } = req.params;
    try {
        const jugadores = await JugadorPartido.findAll({
            where: { id_partido },
            include: [{ model: Jugador, as: 'jugador' }]
        });
        res.json(jugadores);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener jugadores del partido' });
    }
}

// 4. Actualizar datos de jugador_partido (amarilla, roja, asistencia, observacion)
async function actualizarDatosJugadorPartido(req, res) {
    const { id_jugador_partido } = req.params;
    const { amarilla, roja, asistencia, observacion } = req.body;
    try {
        const registro = await JugadorPartido.findByPk(id_jugador_partido);
        if (!registro) return res.status(404).json({ error: 'No encontrado' });
        registro.amarilla = amarilla;
        registro.roja = roja;
        registro.asistencia = asistencia;
        registro.observacion = observacion;
        await registro.save();
        res.json({ mensaje: 'Datos actualizados', registro });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar datos' });
    }
}

module.exports = {
    listarJugadores,
    asignarJugadoresAPartido,
    jugadoresDeUnPartido,
    actualizarDatosJugadorPartido
};