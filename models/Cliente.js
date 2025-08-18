// src/database/models/Cliente.js (CORREGIDO PARA SINCRONIZACIÓN)
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Cliente = sequelize.define('Cliente', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    dni: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    nombre: {
      type: DataTypes.STRING
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: true
    },
    descuento: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    deuda: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    }
  }, {
    tableName: 'clientes',
    timestamps: true,
    paranoid: true // Activa la eliminación lógica
  });

  return Cliente;
};