// src/database/models/Venta.js (CORREGIDO PARA SINCRONIZACIÓN)
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Venta = sequelize.define('Venta', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    metodoPago: {
      type: DataTypes.STRING,
      allowNull: false
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    montoPagado: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    vuelto: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    recargo: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    montoDescuento: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    ClienteId: {
      type: DataTypes.UUID, // Clave foránea debe ser UUID
      allowNull: true
    },
    dniCliente: {
      type: DataTypes.STRING,
      allowNull: true
    },
    facturada: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'ventas',
    timestamps: true,
    paranoid: true // Activa la eliminación lógica
  });

  return Venta;
};