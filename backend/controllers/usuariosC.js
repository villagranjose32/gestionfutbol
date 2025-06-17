const Usuario = require('../models/usuarios');

// Obtener todos los usuarios
const usuarios_getAll = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

// Obtener un usuario por ID
const usuarios_getById = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};

// Crear un nuevo usuario
const usuarios_create = async (req, res) => {
  try {
    const nuevoUsuario = await Usuario.create(req.body);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el usuario', detalle: error.message });
  }
};

// Actualizar un usuario existente
const usuarios_update = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Usuario.update(req.body, { where: { id_usuario: id } });
    if (!updated) return res.status(404).json({ error: 'Usuario no encontrado' });
    const usuarioActualizado = await Usuario.findByPk(id);
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar el usuario', detalle: error.message });
  }
};

// Eliminar un usuario
const usuarios_delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Usuario.destroy({ where: { id_usuario: id } });
    if (!deleted) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ mensaje: 'Usuario eliminado' });
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar el usuario', detalle: error.message });
  }
};

module.exports = {
  usuarios_getAll,
  usuarios_getById,
  usuarios_create,
  usuarios_update,
  usuarios_delete
};