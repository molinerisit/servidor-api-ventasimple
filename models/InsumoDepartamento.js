// src/database/models/InsumoDepartamento.js (CORREGIDO PARA SINCRONIZACIÓN)
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const InsumoDepartamento = sequelize.define('InsumoDepartamento', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'insumo_departamentos',
    timestamps: true, // Se activa para la sincronización
    paranoid: true // Activa la eliminación lógica
  });

  return InsumoDepartamento;
};