const express = require('express');
const router = express.Router();
const { registrarAspirantes, obtenerAspiranteDni, buscarAspirantes } = require('../controllers/aspirantesC');

// Registrar un nuevo aspirante
router.post('/aspirantes', registrarAspirantes);

// Buscar aspirantes por filtros (query params)
router.get('/aspirantes', buscarAspirantes);

// Obtener aspirante por DNI
router.get('/aspirantes/:dni', obtenerAspiranteDni);

module.exports = router;