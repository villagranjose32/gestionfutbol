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
  id_jugador: { // <-- Esta línea es necesaria para que coincida con tu tabla
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'jugador',
      key: 'id_jugador'
    }
  }
}, {
  tableName: 'partidos',
  timestamps: true,
});

module.exports = Partido;

// Relación muchos a muchos entre Partido y Jugador
const Jugador = require('./jugador');
const JugadorPartido = require('./jugador_partido');

Partido.belongsToMany(Jugador, {
  through: JugadorPartido,
  foreignKey: 'id_partido',
  otherKey: 'id_jugador',
  as: 'jugadores'
});