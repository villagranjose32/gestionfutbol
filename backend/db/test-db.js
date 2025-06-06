// C:\Users\pc\proyecto-cacc\test-db.js

const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('juvenilescentraldb', 'root', 'root', {
  host: '127.0.0.1',
  dialect: 'mysql',
  logging: false // Esto es opcional, silencia los logs de Sequelize si te molestan
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa con la base de datos.');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
  }
}

testConnection();

module.exports = sequelize; // Exporta la instancia de sequelize