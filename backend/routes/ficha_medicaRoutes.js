const express = require('express');
const router = express.Router();
const {
  fichaMedica_getAll,
  fichaMedica_getById,
  fichaMedica_create,
  fichaMedica_update,
  fichaMedica_delete
} = require('../controllers/ficha_medicaC');

// Obtener todas las fichas médicas
router.get('/', fichaMedica_getAll);
// Obtener una ficha médica por ID
router.get('/:id', fichaMedica_getById);
// Crear una ficha médica
router.post('/', fichaMedica_create);
// Actualizar una ficha médica
router.put('/:id', fichaMedica_update);
// Eliminar una ficha médica
router.delete('/:id', fichaMedica_delete);

module.exports = router;
