// src/database/models/MovimientoCuentaCorriente.js (CORREGIDO PARA SINCRONIZACIÓN)
'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MovimientoCuentaCorriente = sequelize.define('MovimientoCuentaCorriente', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    tipo: {
      type: DataTypes.ENUM('DEBITO', 'CREDITO'),
      allowNull: false
    },
    monto: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    concepto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    saldoAnterior: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    saldoNuevo: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    tableName: 'movimientos_cuenta_corriente',
    timestamps: true,
    paranoid: true // Activa la eliminación lógica
  });

  return MovimientoCuentaCorriente;
};