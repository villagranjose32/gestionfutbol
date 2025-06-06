const { DataTypes } = require('sequelize');
const sequelize = require('../db/test-db'); // Ajusta la ruta si es necesario

const Jugador = sequelize.define('Jugador', {
  id_jugador: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  dni: {
    type: DataTypes.INTEGER,
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
  direccion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  posicion: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  fecha_nacimiento: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  grupo_sanguineo: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  nro_afiliado: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  obra_social: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  pierna_habil: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  categoria: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  contacto: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  tutor_uno: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  tel_tutor_uno: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  tutor_dos: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  tel_tutor_dos: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  fecha_alta: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  fecha_baja: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  motivo_baja: {
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
  tableName: 'jugador', // Especifica el nombre de la tabla si es diferente del nombre del modelo pluralizado
  timestamps: true, // Habilita createdAt y updatedAt automáticamente
});

module.exports = Jugador;