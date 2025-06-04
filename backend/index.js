// backend/index.js
const express = require('express');
const cors = require('cors');
const app = express();

// 1. Importa la instancia de Sequelize. La ruta es ../test-db porque test-db.js está un nivel arriba.
const sequelize = require('../test-db');
// 2. Importa el modelo Jugador. La ruta es relativa a index.js.
const Jugador = require('./models/jugador');

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // La URL de tu frontend. Asegúrate de que sea la correcta.
  methods: 'GET,HEAD,PUT,POST,DELETE',
  credentials: true
}));
app.use(express.json()); // Permite que Express lea JSON en el cuerpo de las peticiones

// Rutas
const jugadorRoutes = require('./routes/jugadores');
app.use('/api/jugadores', jugadorRoutes);

// Inicio del servidor
const PORT = 3000;
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);

  // 3. Sincroniza la base de datos aquí, después de que Sequelize y el modelo estén disponibles.
  try {
    await sequelize.authenticate(); // Reconfirma que la conexión a la DB esté activa
    console.log('Conexión a DB reconfirmada en inicio de app.');

    // Sincroniza la tabla Jugador.
    // { force: false } significa: NO borrar la tabla si ya existe. Solo añadir o modificar columnas.
    // Si quieres que Sequelize borre la tabla y la recree (borrando todos los datos), usa { force: true }
    // ¡Ten mucho cuidado con { force: true } en entornos que no sean de desarrollo!
    await Jugador.sync({ force: false });
    console.log('✅ Tabla "jugador" sincronizada correctamente al iniciar el servidor.');
  } catch (error) {
    console.error('❌ Error al sincronizar la base de datos al iniciar el servidor:', error);
  }
});