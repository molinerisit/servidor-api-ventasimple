// src/database/models/Compra.js (CORREGIDO PARA SINCRONIZACIÓN)
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Compra = sequelize.define('Compra', {
    id: { 
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true 
    },
    fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    nroFactura: { type: DataTypes.STRING, allowNull: true },
    subtotal: { type: DataTypes.FLOAT, allowNull: false },
    descuento: { type: DataTypes.FLOAT, defaultValue: 0 },
    recargo: { type: DataTypes.FLOAT, defaultValue: 0 },
    total: { type: DataTypes.FLOAT, allowNull: false },
    metodoPago: { type: DataTypes.ENUM('Efectivo', 'Transferencia', 'Tarjeta', 'Cuenta Corriente'), allowNull: true },
    montoAbonado: { type: DataTypes.FLOAT, allowNull: true },
    estadoPago: { type: DataTypes.ENUM('Pagada', 'Pendiente', 'Parcial'), defaultValue: 'Pendiente' }
  }, {
    tableName: 'compras',
    timestamps: true,
    paranoid: true // Activa la eliminación lógica
  });

  return Compra;
};