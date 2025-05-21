// index.js

const express = require('express');
const cors = require('cors');
const app = express();

// Conexión a la base de datos
const db = require('./db/db'); // Asegurate que este archivo se conecte correctamente

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
const loginAdminRoutes = require('./routes/loginAdminRoutes');
const jugadoresActivosRoutes = require('./routes/jugadoresActivosRoutes');
const jugadoresAspirantesRoutes = require('./routes/jugadoresAspirantesRoutes');

app.use('/api/login', loginAdminRoutes);
app.use('/api/jugadores-activos', jugadoresActivosRoutes);
app.use('/api/jugadores-aspirantes', jugadoresAspirantesRoutes);


// Inicio del servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
