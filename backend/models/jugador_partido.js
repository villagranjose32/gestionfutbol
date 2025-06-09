const { DataTypes } = require('sequelize');
const sequelize = require('../db/test-db');

const JugadorPartido = sequelize.define('JugadorPartido', {
  id_jugador_partido: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  id_partido: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'partidos',
      key: 'id_partido'
    }
  },
  id_jugador: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'jugador',
      key: 'id_jugador'
    }
  },
  amarilla: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  roja: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  asistencia: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  observacion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  goles: { // <--- NUEVA COLUMNA
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  }
}, {
  tableName: 'jugador_partido',
  timestamps: true,
});

module.exports = JugadorPartido;

// Relación con el modelo Jugador
const Jugador = require('./jugador');
JugadorPartido.belongsTo(Jugador, { foreignKey: 'id_jugador', as: 'jugador' });