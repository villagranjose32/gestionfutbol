const { DataTypes } = require('sequelize');
const sequelize = require('../../test-db'); 

const Usuario = sequelize.define('Usuario', { 
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,        
    autoIncrement: true,
    allowNull: false,
  },
  usuario: {
    type: DataTypes.STRING(50), 
    allowNull: true,
  },
  contraseña: {
    type: DataTypes.STRING(50), 
    allowNull: true,
  },
  estado: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  inactivo_fecha: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  id_rol: {
    type: DataTypes.INTEGER, 
    allowNull: true,
 
  },
  id_personal: {
    type: DataTypes.INTEGER,
    allowNull: true,

  },
  motivo_baja: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'usuarios', 
  timestamps: true,
});

module.exports = Usuario; 