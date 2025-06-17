const express = require('express');
const router = express.Router();
const {
  fichaSocial_getAll,
  fichaSocial_getById,
  fichaSocial_create,
  fichaSocial_update,
  fichaSocial_delete
} = require('../controllers/ficha_socialC');

// Obtener todas las fichas sociales
router.get('/', fichaSocial_getAll);
// Obtener una ficha social por ID
router.get('/:id', fichaSocial_getById);
// Crear una ficha social
router.post('/', fichaSocial_create);
// Actualizar una ficha social
router.put('/:id', fichaSocial_update);
// Eliminar una ficha social
router.delete('/:id', fichaSocial_delete);

module.exports = router;