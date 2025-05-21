const express = require('express');
const router = express.Router();

// Ruta GET para /api/jugadores-activos/
router.get('/', (req, res) => {
  res.send('Ruta de jugadores activos funcionando correctamente');
});

// Aquí podrías agregar más rutas POST, PUT, DELETE según necesidad

module.exports = router;
