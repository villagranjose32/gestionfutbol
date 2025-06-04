const { DataTypes } = require('sequelize');
const sequelize = require('../../test-db'); 

const DatosFisicos = sequelize.define('DatosFisicos', { 
  id_dato_fisico: {
    type: DataTypes.INTEGER,
    primaryKey: true,       
    autoIncrement: true,
    allowNull: true,
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
  timestamps: true,
});

module.exports = DatosFisicos; 