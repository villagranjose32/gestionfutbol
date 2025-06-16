// Controlador para ficha social
const FichaSocial = require('../models/ficha_social');

// Obtener todas las fichas sociales
const fichaSocial_getAll = async (req, res) => {
  try {
    const datos = await FichaSocial.findAll();
    res.json(datos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las fichas sociales' });
  }
};

// Obtener una ficha social por ID
const fichaSocial_getById = async (req, res) => {
  try {
    const { id } = req.params;
    const dato = await FichaSocial.findByPk(id);
    if (!dato) return res.status(404).json({ error: 'Ficha social no encontrada' });
    res.json(dato);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la ficha social' });
  }
};

// Crear una nueva ficha social
const fichaSocial_create = async (req, res) => {
  try {
    const nuevo = await FichaSocial.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear la ficha social', detalle: error.message });
  }
};

// Actualizar una ficha social existente
const fichaSocial_update = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await FichaSocial.update(req.body, { where: { id_ficha_social: id } });
    if (!updated) return res.status(404).json({ error: 'Ficha social no encontrada' });
    const actualizado = await FichaSocial.findByPk(id);
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar la ficha social', detalle: error.message });
  }
};

// Eliminar una ficha social
const fichaSocial_delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await FichaSocial.destroy({ where: { id_ficha_social: id } });
    if (!deleted) return res.status(404).json({ error: 'Ficha social no encontrada' });
    res.json({ mensaje: 'Ficha social eliminada' });
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar la ficha social', detalle: error.message });
  }
};

module.exports = {
  fichaSocial_getAll,
  fichaSocial_getById,
  fichaSocial_create,
  fichaSocial_update,
  fichaSocial_delete
};
