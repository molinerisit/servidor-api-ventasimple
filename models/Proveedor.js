// src/database/models/Proveedor.js (CORREGIDO PARA SINCRONIZACIÓN)
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Proveedor = sequelize.define('Proveedor', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    nombreEmpresa: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    nombreRepartidor: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tipo: {
        type: DataTypes.ENUM('producto', 'insumos', 'ambos'),
        allowNull: false,
        defaultValue: 'producto'
    },
    telefono: {
      type: DataTypes.STRING
    },
    diasReparto: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    limitePedido: {
        type: DataTypes.STRING,
        allowNull: true,
    },
     deuda: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    }
  }, {
    tableName: 'proveedores',
    timestamps: true,
    paranoid: true // Activa la eliminación lógica
  });

  return Proveedor;
};