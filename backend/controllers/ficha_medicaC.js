// Controlador para ficha médica
const FichaMedica = require('../models/ficha_medica');

// Obtener todas las fichas médicas
const fichaMedica_getAll = async (req, res) => {
  try {
    const datos = await FichaMedica.findAll();
    res.json(datos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las fichas médicas' });
  }
};

// Obtener una ficha médica por ID
const fichaMedica_getById = async (req, res) => {
  try {
    const { id } = req.params;
    const dato = await FichaMedica.findByPk(id);
    if (!dato) return res.status(404).json({ error: 'Ficha médica no encontrada' });
    res.json(dato);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la ficha médica' });
  }
};

// Crear una nueva ficha médica
const fichaMedica_create = async (req, res) => {
  try {
    const { id_jugador } = req.body;
    if (!id_jugador) {
      return res.status(400).json({ error: 'El campo id_jugador es obligatorio' });
    }
    const nuevo = await FichaMedica.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear la ficha médica', detalle: error.message });
  }
};

// Actualizar una ficha médica existente
const fichaMedica_update = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await FichaMedica.update(req.body, { where: { id_ficha_medica: id } });
    if (!updated) return res.status(404).json({ error: 'Ficha médica no encontrada' });
    const actualizado = await FichaMedica.findByPk(id);
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar la ficha médica' });
  }
};

// Eliminar una ficha médica
const fichaMedica_delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await FichaMedica.destroy({ where: { id_ficha_medica: id } });
    if (!deleted) return res.status(404).json({ error: 'Ficha médica no encontrada' });
    res.json({ mensaje: 'Ficha médica eliminada' });
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar la ficha médica' });
  }
};

module.exports = {
  fichaMedica_getAll,
  fichaMedica_getById,
  fichaMedica_create,
  fichaMedica_update,
  fichaMedica_delete
};
