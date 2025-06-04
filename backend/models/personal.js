const { DataTypes } = require('sequelize');
const sequelize = require('../../test-db'); 

const Personal = sequelize.define('Personal', { 
  id_personal: {
    type: DataTypes.INTEGER,
    primaryKey: true,        
    autoIncrement: true,
    allowNull: false,
  },
  tipo_personal: {
    type: DataTypes.STRING(59), // 
    allowNull: true,
  },
  nombre: {
    type: DataTypes.STRING(20), 
    allowNull: true,
  },
  apellido: {
    type: DataTypes.STRING(20), 
    allowNull: true,
  },
  activo_fecha: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  inactivo_fecha: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  motivo_baja: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'personal', 
  timestamps: true,
});

module.exports = Personal; 