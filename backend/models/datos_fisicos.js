const { DataTypes } = require('sequelize');
const sequelize = require('../db/test-db');

const DatosFisicos = sequelize.define('DatosFisicos', {
  id_datos_fisico: { // ← nombre igual que en la tabla
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  id_jugador: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  fecha_registro: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  altura: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  peso: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  velocidad: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'datos_fisicos',
  timestamps: false, // Si tu tabla no tiene createdAt/updatedAt
});

module.exports = DatosFisicos;

// Relación después de exportar el modelo
const Jugador = require('./jugador');
DatosFisicos.belongsTo(Jugador, { foreignKey: 'id_jugador', as: 'jugador' });