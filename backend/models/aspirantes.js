const { DataTypes } = require('sequelize');
const sequelize = require('../db/test-db');

const Aspirante = sequelize.define('Aspirante', {
  id_aspirante: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  apellido: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  provincia: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  localidad: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  dni: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  fecha_nacimiento: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  contacto: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
  estado: {
    type: DataTypes.STRING(20),
    allowNull: true,
  }
}, {
  tableName: 'aspirantes',
  timestamps: true,
});

module.exports = Aspirante;