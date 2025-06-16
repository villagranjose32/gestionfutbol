// C:\Users\pc\proyecto-cacc\test-db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('juvenilescentraldb', 'root', '123456789', {
  host: 'localhost',  // Cambié '127.0.0.1' por 'localhost' según tu configuración de Workbench
  port: 3306,  // Agregué explícitamente el puerto que vi en tu configuración
  dialect: 'mysql',
  logging: false  // Esto silencia los logs de Sequelize si no quieres verlos en la consola
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa con la base de datos.');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message);
  }
}

testConnection();

module.exports = sequelize;
