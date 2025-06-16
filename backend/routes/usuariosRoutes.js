const express = require('express');
const router = express.Router();
const {
  usuarios_getAll,
  usuarios_getById,
  usuarios_create,
  usuarios_update,
  usuarios_delete
} = require('../controllers/usuariosC');

// Obtener todos los usuarios
router.get('/', usuarios_getAll);
// Obtener un usuario por ID
router.get('/:id', usuarios_getById);
// Crear un nuevo usuario
router.post('/', usuarios_create);
// Actualizar un usuario existente
router.put('/:id', usuarios_update);
// Eliminar un usuario
router.delete('/:id', usuarios_delete);

module.exports = router;