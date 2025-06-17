// C:\Users\pc\proyecto-cacc\test-db.js
const { Sequelize } = require('sequelize');

<<<<<<< HEAD
const sequelize = new Sequelize('juvenilescentraldb', 'root', 'root', {
=======
const sequelize = new Sequelize('juvenilescentraldb', 'root', '123456789', {
>>>>>>> 504b890d4f077989f7ab1d363b6003229f76f291
  host: 'localhost',  // Cambié '127.0.0.1' por 'localhost' según tu configuración de Workbench
  port: 3306,  // Agregué explícitamente el puerto que vi en tu configuración
  dialect: 'mysql',
  logging: false  // Esto silencia los logs de Sequelize si no quieres verlos en la consola
});
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa con la base de datos juvenilescentraldb');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message);
  }
}

testConnection();

module.exports = sequelize;
