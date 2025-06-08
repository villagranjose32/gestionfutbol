const { DataTypes } = require('sequelize');
const sequelize = require('../db/test-db');
const Jugador = require('./jugador'); // Importa el modelo relacionado
const { version } = require('react');

const DatosFisicos = sequelize.define('DatosFisicos', {
  id_datos_fisicos: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_jugador: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  altura: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  peso: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  velocidad : {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  
  updatedAt: {
    type: DataTypes.DATE,
    },
}, {
  tableName: 'datos_fisicos',
  timestamps: true,
});

// Relación: Los datos físicos pertenecen a un jugador
DatosFisicos.belongsTo(Jugador, { foreignKey: 'id_jugador', as: 'jugador' });

module.exports = DatosFisicos;