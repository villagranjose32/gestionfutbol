const { DataTypes } = require('sequelize');
const sequelize = require('../db/test-db');

const FichaSocial = sequelize.define('FichaSocial', {
  id_ficha_social: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false
  },
  situacion_social: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  id_jugador: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'jugador',
      key: 'id_jugador'
    }
  },
  gestionado_por: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  archivo: {
    type: DataTypes.BLOB('long'),
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE
  },
  updatedAt: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'ficha_social',
  timestamps: true
});

// Relación con el modelo Jugador
const Jugador = require('./jugador');
FichaSocial.belongsTo(Jugador, { foreignKey: 'id_jugador', as: 'jugador' });

module.exports = FichaSocial;