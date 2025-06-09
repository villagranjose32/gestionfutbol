const { Op } = require('sequelize');
const Aspirante = require('../models/aspirantes');

async function registrarAspirantes(req, res) {
    try {
        const nuevoAspirante = await Aspirante.create(req.body);
        const responseData = { mensaje: 'Registrado Exitosamente', aspirante: nuevoAspirante };
        console.log('respondiendo con: ', JSON.stringify(responseData, null, 2));
        res.status(201).json(responseData);
    } catch (error) {
        console.error('Error al registrar aspirante:', error);
        const errorResponse = { mensaje: 'Error al registrar aspirante', error: error.message };
        console.log('Respondiendo con error: ', JSON.stringify(errorResponse, null, 2));
        res.status(500).json(errorResponse);
    }
}

async function obtenerAspiranteDni(req, res) {
    const { dni } = req.params;
    try {
        const aspirante = await Aspirante.findOne({ where: { dni: dni } });
        if (aspirante) {
            res.status(200).json(aspirante);
        } else {
            res.status(404).json({ mensaje: 'Aspirante no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener aspirante por dni ', error);
        res.status(500).json({ mensaje: 'Error al obtener aspirante', error: error.message });
    }
}

// Nueva función de búsqueda
async function buscarAspirantes(req, res) {
    try {
        const {
            nombre,
            apellido,
            provincia,
            localidad,
            dni,
            estado,
            fecha_nacimiento 
        } = req.query;

        const condiciones = {};

        if (nombre) condiciones.nombre = { [Op.like]: `%${nombre}%` };
        if (apellido) condiciones.apellido = { [Op.like]: `%${apellido}%` };
        if (provincia) condiciones.provincia = { [Op.like]: `%${provincia}%` };
        if (localidad) condiciones.localidad = { [Op.like]: `%${localidad}%` };
        if (dni) condiciones.dni = dni;
        if (estado) condiciones.estado = { [Op.like]: `%${estado}%` };
        if (fecha_nacimiento) condiciones.fecha_nacimiento = fecha_nacimiento; 


        const aspirantes = await Aspirante.findAll({ where: condiciones });

        res.status(200).json(aspirantes);
    } catch (error) {
        console.error('❌ Error al buscar aspirantes:', error);
        res.status(500).json({ mensaje: 'Error al buscar aspirantes' });
    }
}

module.exports = { registrarAspirantes, obtenerAspiranteDni, buscarAspirantes };