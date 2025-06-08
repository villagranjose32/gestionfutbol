const { DataTypes } = require('sequelize');
const sequelize = require('../db/test-db');

const Partido = sequelize.define('Partido', { 
  id_partido: {
    type: DataTypes.INTEGER, 
    primaryKey: true,        
    autoIncrement: true,      
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  rival: {
    type: DataTypes.STRING(30), 
    allowNull: true,
  },
  categoria: {
    type: DataTypes.STRING(10), 
    allowNull: true,
  },
  ubicacion: {
    type: DataTypes.STRING(100), 
    allowNull: true,
  },
  resultado: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
}, {
  tableName: 'partidos', 
  timestamps: true,
});

module.exports = Partido; 