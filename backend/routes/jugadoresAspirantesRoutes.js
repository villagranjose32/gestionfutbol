const express = require('express');
const router = express.Router();

// Ruta de ejemplo
router.get('/jugadores-aspirantes', (req, res) => {
  res.send('Ruta de jugadores aspirantes funcionando correctamente');
});

module.exports = router;
