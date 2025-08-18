// src/database/models/DetalleCompra.js (CORREGIDO PARA SINCRONIZACIÓN)
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DetalleCompra = sequelize.define('DetalleCompra', {
    id: { // Se añade un ID propio para facilitar la sincronización
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    cantidad: { type: DataTypes.FLOAT, allowNull: false },
    precioUnitario: { type: DataTypes.FLOAT, allowNull: false },
    subtotal: { type: DataTypes.FLOAT, allowNull: false }
  }, {
    tableName: 'detalle_compras',
    timestamps: true, // Se activa para la sincronización
    paranoid: true // Activa la eliminación lógica
  });
  
  return DetalleCompra;
};