const express = require('express');
const router = express.Router();

// Ruta de ejemplo
router.get('/login', (req, res) => {
  res.send('Ruta de login funcionando correctamente');
});

module.exports = router;
