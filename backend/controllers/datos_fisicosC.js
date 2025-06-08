const DatosFisicos = require('../models/datos_fisicos');

// Registrar datos físicos
async function registrarDatosFisicos(req, res) {
    try {
        const nuevoDato = await DatosFisicos.create(req.body);
        res.status(201).json({ mensaje: 'Datos físicos registrados', datos: nuevoDato });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al registrar datos físicos', error: error.message });
    }
}

// Obtener datos físicos por id_jugador
async function obtenerDatosFisicosPorJugador(req, res) {
    const { id_jugador } = req.params;
    try {
        const datos = await DatosFisicos.findAll({ where: { id_jugador } });
        if (datos.length > 0) {
            res.status(200).json(datos);
        } else {
            res.status(404).json({ mensaje: 'No se encontraron datos físicos para este jugador' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener datos físicos', error: error.message });
    }
}

module.exports = {
    registrarDatosFisicos,
    obtenerDatosFisicosPorJugador
};