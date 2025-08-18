// src/database/models/InsumoFamilia.js (CORREGIDO PARA SINCRONIZACIÓN)
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const InsumoFamilia = sequelize.define('InsumoFamilia', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    InsumoDepartamentoId: {
      type: DataTypes.UUID, // Clave foránea también debe ser UUID
      allowNull: false
    }
  }, {
    tableName: 'insumo_familias',
    timestamps: true,
    paranoid: true // Activa la eliminación lógica
  });

  return InsumoFamilia;
};