const express = require('express');
const cors = require('cors');
const app = express();

// 1. Importa la instancia de Sequelize.
const sequelize = require('./db/test-db');

// 2. Importa los modelos
const Jugador = require('./models/jugador');
const DatosFisicos = require('./models/datos_fisicos'); // Agregado

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // La URL de tu frontend. Asegúrate de que sea la correcta.
  methods: 'GET,HEAD,PUT,POST,DELETE',
  credentials: true
}));
app.use(express.json()); // Permite que Express lea JSON en el cuerpo de las peticiones

// RUTA JUGADOR
const jugadorRoutes = require('./routes/jugadores');
app.use('/api/jugadores', jugadorRoutes);

// RUTA ASPIRANTES
const aspirantesRoutes = require('./routes/aspirantes.R');
app.use('/api', aspirantesRoutes);

// RUTA DATOS FISICOS
const datosFisicosRoutes = require('./routes/datos_fisicosRoutes');
app.use('/api', datosFisicosRoutes);

// Inicio del servidor
const PORT = 3000;
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);

  // 3. Sincroniza la base de datos aquí, después de que Sequelize y los modelos estén disponibles.
  try {
    await sequelize.authenticate(); // Reconfirma que la conexión a la DB esté activa
    console.log('Conexión a DB reconfirmada en inicio de app.');

    // Sincroniza ambos modelos respetando las relaciones
    await Jugador.sync({ alter: true });
    await DatosFisicos.sync({ alter: true });
    console.log('✅ Tablas sincronizadas correctamente al iniciar el servidor.');
  } catch (error) {
    console.error('❌ Error al sincronizar la base de datos al iniciar el servidor:', error);
  }
});