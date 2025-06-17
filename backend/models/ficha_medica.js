const { DataTypes } = require('sequelize');
const sequelize = require('../db/test-db');
const Jugador = require('./jugador');

const FichaMedica = sequelize.define('FichaMedica', {
  id_ficha_medica: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  diagnostico: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fecha_inicio: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  fecha_tentativa_recuperacion: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  fecha_fin: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  documento: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  id_jugador: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'jugador', // nombre de la tabla en la base de datos
      key: 'id_jugador'
    }
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'ficha_medica',
  timestamps: true,
});

FichaMedica.belongsTo(Jugador, { foreignKey: 'id_jugador', as: 'jugador' });

module.exports = FichaMedica;