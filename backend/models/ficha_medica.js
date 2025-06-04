const { DataTypes } = require('sequelize');
const sequelize = require('../../test-db'); 

const FichaMedica = sequelize.define('FichaMedica', { 
  id_ficha_medica: {
    type: DataTypes.INTEGER,
    primaryKey: true,        
    autoIncrement: true,
    allowNull: false, 
  },
  diagnostico: {
    type: DataTypes.STRING(50), 
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
    type: DataTypes.BLOB, 
    allowNull: true,
  },
  id_jugador: {
    type: DataTypes.INTEGER,

  },
}, {
  tableName: 'ficha_medica', 
  timestamps: true,
});

module.exports = FichaMedica; 