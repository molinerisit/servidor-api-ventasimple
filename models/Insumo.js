// src/database/models/Insumo.js (CORREGIDO PARA SINCRONIZACIÓN)
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Insumo = sequelize.define('Insumo', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    stock: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    unidad: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ultimoPrecioCompra: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    InsumoDepartamentoId: {
      type: DataTypes.UUID, // Clave foránea también debe ser UUID
      allowNull: true
    },
    InsumoFamiliaId: {
      type: DataTypes.UUID, // Clave foránea también debe ser UUID
      allowNull: true
    }
  }, {
    tableName: 'insumos',
    timestamps: true,
    paranoid: true // Activa la eliminación lógica
  });

  return Insumo;
};