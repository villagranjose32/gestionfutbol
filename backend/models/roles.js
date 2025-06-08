const { DataTypes } = require('sequelize');
const sequelize = require('../db/test-db');

const Rol = sequelize.define('Rol', { 
  id_rol: {
    type: DataTypes.INTEGER,
    primaryKey: true,        
    autoIncrement: true,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
}, {
  tableName: 'roles', 
  timestamps: true,
});

module.exports = Rol; 